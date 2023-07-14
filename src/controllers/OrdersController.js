const { validationResult } = require("express-validator");
const knex = require("../database/knex");

function generateUniqueCodeNumber() {
  // Gera um número aleatório de 6 dígitos
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  return randomNumber.toString();
}

async function updateStatusAutomatically(knex, orderId) {
  console.log("OorderID CHEGANDO =>", orderId);

  console.log("updateStatusAutomatically CHEGANDO =>");
  const statusIds = [1, 2, 3]; // IDs dos status na ordem desejada
  let currentIndex = 0;

  const intervalId = setInterval(async () => {
    currentIndex = (currentIndex + 1) % statusIds.length;
    const newStatusId = statusIds[currentIndex];

    try {
      // Atualize o status do pedido específico no banco de dados
      await knex("orders")
        .where("id", orderId)
        .update({ status_id: newStatusId });

      console.log(`Status atualizado para ${newStatusId}`);

      // Verificar se o novo status é igual a 3 (ou o último status)
      if (newStatusId === 3) {
        // Parar o setInterval quando o status for igual a 3
        clearInterval(intervalId);
        console.log("Atualização automática do status interrompida.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }, 5 * 60 * 1000); // 5 minutos em milissegundos
}

class OrdersController {
  async create(req, res) {
    try {
      // Verificar se houve erros de validação nos dados da requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let status_id = "1";
      let total_value = "17.90";

      // Extrair os dados da requisição
      const { details, plates } = req.body;

      console.log("Request PLATES ===>>", req.body);

      // Verificar se todos os campos necessários foram fornecidos
      if (!status_id || !plates) {
        return res.status(400).json({
          error: "Dados incompletos, erro a buscar status_id ou Plates",
        });
      }

      // Verificar se o plates é um array
      const plateIds = plates;

      // Gerar o código único
      const code = generateUniqueCodeNumber();

      // Criar o novo pedido no banco de dados
      const order = {
        status_id,
        code,
        details,
        total_value,
        user_id: req.user.id,
      };

      const [orderId] = await knex("orders").insert(order);

      console.log("orders ===>", orderId);

      // Chamar a função para atualizar automaticamente o status apenas para o pedido criado
      updateStatusAutomatically(knex, orderId);

      // Inserir os pratos no pedido
      const orderItems = plateIds.map((plates) => ({
        order_id: orderId,
        plates_id: plates,
      }));

      await knex("order_items").insert(orderItems);

      // Retornar a resposta com o ID do pedido criado
      return res.status(201).json({ id: orderId });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async index(request, response) {
    try {
      const orders = await knex("orders")
        .select(
          "orders.id",
          "orders.code",
          "orders.details",
          "orders.total_value",
          "orders.user_id",
          "order_statuses.status",
        )
        .leftJoin("order_statuses", "orders.status_id", "order_statuses.id")
        .where("orders.user_id", request.user.id);

      const orderIds = orders.map((order) => order.id);

      const plates = await knex("order_items")
        .select("order_items.order_id", "plates.*")
        .whereIn("order_items.order_id", orderIds)
        .leftJoin("plates", "order_items.plates_id", "plates.id");

      const ordersWithPlates = orders.map((order) => {
        const orderPlates = plates.filter(
          (plate) => plate.order_id === order.id,
        );
        return { ...order, plates: orderPlates };
      });

      return response.json(ordersWithPlates);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao listar os pedidos" });
    }
  }

  async show(request, response) {
    const { id } = request.params;

    try {
      // Buscar o pedido no banco de dados pelo ID
      const order = await knex("orders")
        .select(
          "orders.id",
          "orders.code",
          "orders.details",
          "orders.total_value",
          "orders.user_id",
          "order_statuses.status",
        )
        .leftJoin("order_statuses", "orders.status_id", "order_statuses.id")
        .where("orders.id", id)
        .first();

      if (!order) {
        return response.status(404).json({ error: "Pedido não encontrado" });
      }

      return response.json(order);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ error: "Erro ao buscar os detalhes do pedido" });
    }
  }

  async update(request, response) {
    const { id } = request.params;
    const { status, status_id, code, details, total_value } = request.body;

    try {
      // Verificar se o pedido existe
      const existingOrder = await knex("orders").where("id", id).first();

      if (!existingOrder) {
        return response.status(404).json({ error: "Pedido não encontrado" });
      }

      // Atualizar os dados do pedido
      await knex("orders").where("id", id).update({
        status,
        status_id,
        code,
        details,
        total_value,
      });

      // Buscar o pedido atualizado
      const updatedOrder = await knex("orders").where("id", id).first();

      return response.json(updatedOrder);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao atualizar o pedido" });
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    try {
      // Verificar se o pedido existe
      const existingOrder = await knex("orders").where("id", id).first();

      if (!existingOrder) {
        return response.status(404).json({ error: "Pedido não encontrado" });
      }

      // Excluir o pedido
      await knex("orders").where("id", id).del();

      return response.status(204).end();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao excluir o pedido" });
    }
  }
}

module.exports = OrdersController;

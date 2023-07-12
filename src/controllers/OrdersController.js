const { validationResult } = require("express-validator");
const knex = require("../database/knex");
const crypto = require("crypto");

function generateUniqueCodeHex() {
  // Gera um número aleatório de 6 dígitos
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  // Calcula um hash MD5 do número aleatório
  const hash = crypto
    .createHash("md5")
    .update(randomNumber.toString())
    .digest("hex");

  // Obtém os primeiros 6 dígitos do hash
  const code = hash.substr(0, 6);

  return code;
}

function generateUniqueCodeNumber() {
  // Gera um número aleatório de 6 dígitos
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  return randomNumber.toString();
}

async function updateStatusAutomatically() {
  const statusIds = [1, 2, 3]; // IDs dos status na ordem desejada
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % statusIds.length;
    const newStatusId = statusIds[currentIndex];

    // Atualize o status dos pedidos no banco de dados conforme necessário
    // Aqui você pode usar seu código para atualizar o status_id nos pedidos

    console.log(`Status atualizado para ${newStatusId}`);
  }, 5 * 60 * 100); // 5 minutos em milissegundos, falta o zero no cem
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

      // Verificar se todos os campos necessários foram fornecidos
      if (!status_id || !plates) {
        return res.status(400).json({ error: "Dados incompletos" });
      }

      // Verificar se o plates é um array
      const plateIds = Object.keys(plates);

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

      // Buscar os detalhes do prato associado ao pedido
      const plate = await knex("order_items")
        .select("order_items.order_id", "plates.*")
        .where("order_items.order_id", order.id)
        .leftJoin("plates", "order_items.plates_id", "plates.id")
        .first();

      if (!plate) {
        return response.status(404).json({ error: "Prato não encontrado" });
      }

      order.plate = plate;

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

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

class OrdersController {
  async create(req, res) {
    try {
      // Verificar se houve erros de validação nos dados da requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extrair os dados da requisição
      const { status_id, details, plates, userId, totalValue } = req.body;

      // Verificar se todos os campos necessários foram fornecidos
      if (!status_id || !plates || !userId || !totalValue) {
        return res.status(400).json({ error: "Dados incompletos" });
      }

      // Verificar se o plates é um array
      const plateIds = Array.isArray(plates) ? plates : [plates];

      // Gerar o código único
      const code = generateUniqueCodeNumber();

      // Criar o novo pedido no banco de dados
      const order = {
        status_id,
        code,
        details,
        user_id: userId,
        total_value: totalValue,
      };

      const [orderId] = await knex("orders").insert(order);

      // Inserir os pratos no pedido
      const orderItems = plateIds.map((plateId) => ({
        order_id: orderId,
        shopping_cart_id: plateId,
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
      // Buscar todos os pedidos no banco de dados
      const orders = await knex("orders")
        .select(
          "orders.id",
          "orders.code",
          "orders.details",
          "orders.total_value",
          "orders.plate_id",
          "order_statuses.status",
        )
        .leftJoin("order_statuses", "orders.status_id", "order_statuses.id");

      // Buscar os detalhes dos pratos associados a cada pedido
      for (const order of orders) {
        const plates = await knex("plates")
          .select(
            "plates.id",
            "plates.title",
            "plates.description",
            "plates.ingredients",
            "plates.picture",
            "plates.value",
          )
          .where("plates.id", order.plate_id);

        order.plates = plates;
      }

      return response.json(orders);
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
          "orders.plate_id",
          "order_statuses.status",
        )
        .leftJoin("order_statuses", "orders.status_id", "order_statuses.id")
        .where("orders.id", id)
        .first();

      if (!order) {
        return response.status(404).json({ error: "Pedido não encontrado" });
      }

      // Buscar os detalhes do prato associado ao pedido
      const plate = await knex("plates")
        .select(
          "plates.id",
          "plates.title",
          "plates.description",
          "plates.ingredients",
          "plates.picture",

          "plates.value",
        )
        .where("plates.id", order.plate_id)
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

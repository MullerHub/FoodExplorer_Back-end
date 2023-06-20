const { validationResult } = require("express-validator");
const knex = require("../database/knex");

class OrdersController {
  async create(req, res) {
    try {
      // Verificar se houve erros de validação nos dados da requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extrair os dados da requisição
      const { status, code, details, plateId, userId, totalValue } = req.body;

      // Criar o novo pedido no banco de dados
      const [orderId] = await knex("orders").insert({
        status,
        code,
        details,
        plate_id: plateId,
        user_id: userId,
        total_value: totalValue,
      });

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
}

module.exports = OrdersController;

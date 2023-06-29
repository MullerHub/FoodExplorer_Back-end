const knex = require("../database/knex");

class ShoppingCartController {
  async addToCart(req, res) {
    const { plate_id, quantity } = req.body;

    // Verificar se o prato existe na tabela "plates"
    const [plate] = await knex("plates").where("id", plate_id).select("value");

    if (!plate) {
      return res.status(404).json({ error: "Prato não encontrado" });
    }

    // Calcular o valor total do item no carrinho
    const itemTotalValue = plate.value * quantity;

    // Verificar se o item já existe no carrinho do usuário
    const [cartItem] = await knex("shopping_cart")
      .where("plate_id", plate_id)
      .select("id", "quantity", "total_value");

    if (cartItem) {
      // Atualizar a quantidade e o valor total do item no carrinho
      const updatedQuantity = cartItem.quantity + quantity;
      const updatedTotalValue = cartItem.total_value + itemTotalValue;

      await knex("shopping_cart")
        .where("id", cartItem.id)
        .update({ quantity: updatedQuantity, total_value: updatedTotalValue });
    } else {
      // Adicionar um novo item no carrinho
      await knex("shopping_cart").insert({
        plate_id,
        quantity,
        total_value: itemTotalValue,
      });
    }

    return res.json({ success: true });
  }
}

module.exports = ShoppingCartController;

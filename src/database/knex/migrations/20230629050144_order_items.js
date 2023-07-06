//  DESATIVADO POR ENQUANTO INUTIL
exports.up = (knex) =>
  knex.schema.createTable("order_items", (table) => {
    table.increments("id");
    table.integer("order_id").unsigned().references("id").inTable("orders");
    table
      .integer("shopping_cart_id")
      .unsigned()
      .references("id")
      .inTable("shopping_cart");
    console.log("Criada tabela de itens do pedido");
  });

exports.down = (knex) => knex.schema.dropTableIfExists("order_items");

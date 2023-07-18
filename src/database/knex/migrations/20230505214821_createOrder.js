exports.up = (knex) =>
  knex.schema.createTable("orders", (table) => {
    table.increments("id");
    table
      .integer("status_id")
      .unsigned()
      .references("id")
      .inTable("order_statuses");
    table.text("code").notNullable();
    table.text("details");
    table.integer("user_id").unsigned().references("id").inTable("users");
    table.float("total_value").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    console.log("Criada tabela de pedidos");
  });

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("orders");
  await knex.schema.dropTableIfExists("order_statuses");
  console.log("Tabelas de pedidos removidas");
};

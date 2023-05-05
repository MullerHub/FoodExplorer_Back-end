exports.up = knex => knex.schema.createTable("orders", (table) => {
    table.increments("id");
    table.text("status");
    table.text("code").notNullable();
    table.text("details");
    table.integer("orders_id").references("id").inTable("plates");
    table.integer("users_id").references("id").inTable("users");
    table.timestamp("created_at").default(knex.fn.now());
  });
  
  exports.down = knex => knex.schema.dropTable("orders");
  
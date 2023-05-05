exports.up = knex => knex.schema.createTable("plates", (table) => {
  table.increments("id");
  table.text("titles").notNullable();
  table.text("description");
  table.text("Ingredients");
  table.float("value");
  table.integer("user_id").references("id").inTable("users");
  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());
  
});

exports.down = knex => knex.schema.dropTable("plates");

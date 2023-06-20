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
    table.integer("plate_id").unsigned().references("id").inTable("plates");
    table.integer("user_id").unsigned().references("id").inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.float("total_value").notNullable();
  });

exports.down = (knex) => knex.schema.dropTable("orders");

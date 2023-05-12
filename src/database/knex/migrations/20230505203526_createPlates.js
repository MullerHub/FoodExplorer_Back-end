exports.up = (knex) =>
  knex.schema.createTable("plates", (table) => {
    table.increments("id");
    table.text("title").notNullable();
    table.text("description");
    table.text("ingredients");
    table.float("value");
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTableIfExists("plates");

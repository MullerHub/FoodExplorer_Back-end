exports.up = (knex) =>
  knex.schema.createTable("plates_ingredients", (table) => {
    table.increments("id").primary();
    table.integer("plate_id").unsigned().notNullable();
    table.foreign("plate_id").references("plates.id");
    table.integer("ingredient_id").unsigned().notNullable();
    table.foreign("ingredient_id").references("ingredients.id");
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("plates_ingredients");

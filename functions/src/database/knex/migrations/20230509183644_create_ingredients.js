exports.up = function (knex) {
  return knex.schema
    .createTable("ingredients", function (table) {
      table.increments("id").primary();
      table.text("name").notNullable().unique();
    })
    .then(function () {
      return knex.raw(`
      INSERT INTO ingredients (name)
      VALUES
        ("Pão"),
        ("Cheddar"),
        ("Alho"),
        ("Cebola"),
        ("Sal"),
        ("Tomate"),
        ("Maionese"),
        ("Pepino"),
        ("Carne moida"),
        ("Queijo"),
        ("Picanha")
    `);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("ingredients");
};

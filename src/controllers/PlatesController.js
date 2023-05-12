const knex = require("../database/knex");

class PlatesController {
  async index(request, response) {
    const { title } = request.query;

    let plates;

    if (title) {
      plates = await knex("plates").whereLike("plates.title", `%${title}%`);
    } else {
      plates = await knex("plates");
    }
    return response.json(plates);
  }

  async create(request, response) {
    const { title, description, value } = request.body;
    const { user_id } = request.params;

    // Busca de ingredientes estáticos já criados no back-end
    const ingredientIds = [];

    for (const ingredient of ingredient) {
      const [ingredientId] = await knex("ingredients")
        .where("name", ingredientId)
        .pluck("id"); // mudar id por name para teste de implementação já convertida

      ingredientIds.push(ingredientId);
    }

    console.log("IngredientsIds => ", ingredientIds);

    // Erro de criação inicial por falta de parametros passados pelo cliente

    if (!title || !value || !description) {
      throw new AppError("Não foi possivel realizar a criação do prato");
    }

    // const ingredientsToString = JSON.stringify(ingredients);

    // Criação do prato

    const [plate] = await knex("plates")
      .insert({
        title,
        description,
        // ingredientIds,
        value,
        user_id,
      })
      .returning("id");

    /*  if (!ingredientIds || ingredientIds.length === 0) {
      return response.status(400).json({ error: "No ingredients provided" });
    } */

    const { plateIngredientsInsert } = ingredientIds.map((ingredientId) => ({
      plate_id: plate.id,
      ingredient_id: ingredientId,
    }));

    console.log("Plate ingredients insert:", plateIngredientsInsert);

    await knex("plates_ingredients").insert(plateIngredientsInsert);

    const userPlateInsert = {
      user_id,
      plate_id: plate.id,
    };

    await knex("plates_ingredients").insert(userPlateInsert);

    response.json({ plate_id: plate.id });
  }

  async show(request, response) {
    const { id } = request.params;

    const plate = await knex("plates")
      .join("ingredients", "plates.id", "=", "ingredients.plates_id")
      .where("plates.id", "=", id)
      .first();
    console.log("plate info:", plate);

    const ingredients = await knex("ingredients")
      .where({ plates_id: id })
      .orderby("name");
    const links = await knex("links")
      .where({ plates_id: id })
      .orderby("created_at");

    console.log(response.json());
    return response.json();
  }
}

module.exports = PlatesController;
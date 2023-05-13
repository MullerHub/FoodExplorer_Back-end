const knex = require("../database/knex");

class PlatesWithIngredients {
  async index(request, response) {
    return response.json(plates);
  }

  async create(request, response) {
    const { data } = request.data;

    await knex("plates_ingredients").insert(plateIngredientsInsert);

    const userPlateInsert = {
      user_id,
      plate_id: plate.id,
    };

    await knex("plates_ingredients").insert(userPlateInsert);

    response.json({ plate_id: plate });
  }

  async show(request, response) {
    const { id } = request.params;

    return response.json();
  }
}

module.exports = PlatesController;

const knex = require("../database/knex");

class FavoritesController {
  async create(request, response) {
    const { user_id } = request.params;
    const { plate_id } = request.body;

    console.log("dasdfas", user_id, plate_id);

    // Verificar se o prato já foi marcado como favorito pelo usuário
    const [existingFavorite] = await knex("favorite_plates")
      .where({ user_id, plate_id })
      .count("* as count");

    if (existingFavorite.count > 0) {
      return response
        .status(400)
        .json({ error: "Prato já marcado como favorito" });
    }

    // Adicionar o prato aos favoritos do usuário
    await knex("favorite_plates").insert({ user_id, plate_id });

    response.status(201).json({ message: "Prato marcado como favorito" });
  }

  async show(request, response) {
    const { user_id } = request.params;

    // Buscar a lista de pratos favoritos do usuário
    const favoritePlates = await knex("favorite_plates")
      .select("plates.*")
      .where("favorite_plates.user_id", user_id)
      .join("plates", "favorite_plates.plate_id", "=", "plates.id");

    response.json(favoritePlates);
  }

  async delete(request, response) {
    const { user_id, plate_id } = request.params;

    // Verificar se o prato está marcado como favorito pelo usuário
    const [existingFavorite] = await knex("favorite_plates")
      .where({ user_id, plate_id })
      .count("* as count");

    if (existingFavorite.count === 0) {
      return response
        .status(400)
        .json({ error: "Prato não está marcado como favorito" });
    }

    // Remover o prato dos favoritos do usuário
    await knex("favorite_plates").where({ user_id, plate_id }).del();

    response.status(200).json({ message: "Prato removido dos favoritos" });
  }
}

module.exports = FavoritesController;

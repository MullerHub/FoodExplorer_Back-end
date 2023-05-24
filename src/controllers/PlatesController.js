const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");
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
    const { title, description, value, ingredients } = request.body;
    const user_id = request.user.id;
    const picture = request.file.filename;

    if (!request.user.isAdmin) {
      console.log("Valor de request.user.isAdmin:", request.user);
      console.log("Requisição de usuário não é admin. Acesso negado.");
      return response
        .status(403)
        .json({ error: "Acesso negado, você não é o admin." });
    }

    const diskStorage = new DiskStorage();

    console.log("picture => ", picture);

    const filePlate = await diskStorage.saveFile(picture);

    if (!request.file) {
      throw new AppError("Faltou adicionar uma imagem pelo menos!!");
    }

    // Busca de ingredientes estáticos já criados no back-end
    let ingredientIds = [];
    console.log(ingredients);

    await Promise.all(
      ingredients.map(async (item) => {
        const [ingredient] = await knex("ingredients")
          .where("name", item)
          .pluck("id");

        if (ingredient) {
          ingredientIds.push(ingredient);
        }
      }),
    );
    console.log("IngredientsIds => ", ingredientIds);

    // Erro de criação inicial por falta de parametros passados pelo cliente

    if (!title || !value || !description) {
      throw new AppError("Não foi possivel realizar a criação do prato");
    }

    // Criação do prato

    const [plate] = await knex("plates")
      .insert({
        title,
        description,
        ingredients: JSON.stringify(ingredientIds),
        value,
        picture: filePlate,
        user_id,
      })
      .returning("id");

    if (!ingredientIds || ingredientIds.length === 0) {
      return response.status(400).json({ error: "No ingredients provided" });
    }

    return response.json({ plate_id: plate });
  }

  async show(request, response) {
    const { user_id } = request.user.id;

    const plates = await knex("plates").select("*");

    console.log("plate info:", plates);

    /* const ingredients = await knex("ingredients")
      .where({ plates_id: id })
      .orderby("name");
    const links = await knex("links")
      .where({ plates_id: id })
      .orderby("created_at"); */

    // console.log(response.json());
    return response.json(plates);
  }
}

module.exports = PlatesController;

const knex = require("../database/knex");

class PlatesController {
  async create(request, response) {
    const { title, description, status, code, details, orders_id } =
      request.body;

    const users_id  = request.user.id;
    // const {users_id}  = request.params;

    const [plates_id] = await knex("plates").insert({
      title,
      description,
      users_id,
    });

    const linksInsert = links.map((link) => {
      return {
        plates_id,
        url: link,
      };
    });

    await knex("links").insert(linksInsert);

    const tagsInsert = links.map((link) => {
      return {
        plates_id,
        url: link,
        users_id,
      };
    });

    await knex("tags").insert(tagsInsert);

    response.json();
  }
}

module.exports = PlatesController;

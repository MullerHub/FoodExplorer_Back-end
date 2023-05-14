const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");

const favoriteRoutes = Router();

const favoritesController = new FavoritesController();

favoriteRoutes.post("/:user_id/favorite_plates", favoritesController.create);

favoriteRoutes.get("/:user_id/favorite_plates", favoritesController.show);

// favoriteRoutes.put("/:id", favoritesController.update);

module.exports = favoriteRoutes;

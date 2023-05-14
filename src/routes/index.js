const { Router } = require("express");

const usersRoutes = require("./users.routes");
const platesRoutes = require("./plates.routes");
const favoriteRoutes = require("./favorite.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/plates", platesRoutes);
routes.use("/users", favoriteRoutes);

module.exports = routes;

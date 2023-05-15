const { Router } = require("express");
const SessionsController = require("../controllers/SessionsController");

const sessionsController = SessionsController();

const sessionsRoutes = Router();

sessionsRoutes.post("/", sessionsController.create);
// sessionsRoutes.get("/:id", sessionsController.show);

module.exports = sessionsRoutes;

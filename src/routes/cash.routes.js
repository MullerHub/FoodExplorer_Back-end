const { Router } = require("express");
const PaymentsController = require("../controllers/PaymentsController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const cashRoutes = Router();
const paymentsController = new PaymentsController();

cashRoutes.post("/", ensureAuthenticated, paymentsController.create);
cashRoutes.get("/", ensureAuthenticated, paymentsController.show);
cashRoutes.put("/", ensureAuthenticated, paymentsController.update);

module.exports = cashRoutes;

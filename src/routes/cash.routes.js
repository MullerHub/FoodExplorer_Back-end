const { Router } = require("express");
const PaymentsController = require("../controllers/PaymentsController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const cashRoutes = Router();
const paymentsController = new PaymentsController();

cashRoutes.post("/", ensureAuthenticated, paymentsController.create);

module.exports = cashRoutes;

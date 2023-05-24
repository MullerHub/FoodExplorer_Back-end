const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);

const PlatesController = require("../controllers/PlatesController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const platesRoutes = Router();

const platesController = new PlatesController();

platesRoutes.use(ensureAuthenticated);

// platesRoutes.post("/", platesController.create);
platesRoutes.post(
  "/",
  ensureAuthenticated,
  upload.single("picture"),
  platesController.create,
);

// platesRoutes.get("/:id", platesController.show);
/* platesRoutes.post(
  "/avatar",
  ensureAuthenticated,
  upload.single("image"),
  platesController.show,
); */

// platesRoutes.put("/:id", platesController.update);

module.exports = platesRoutes;

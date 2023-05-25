const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);

const PlatesController = require("../controllers/PlatesController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const platesRoutes = Router();

const platesController = new PlatesController();

platesRoutes.post(
  "/",
  ensureAuthenticated,
  upload.single("picture"),
  platesController.create,
);
platesRoutes.get("/:id", platesController.index);

platesRoutes.get("/", platesController.show);

// platesRoutes.put("/:id", platesController.update);

module.exports = platesRoutes;

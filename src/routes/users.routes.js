const { Router } = require("express");
const multer = require("multer");
// const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
// const UsersAvatarController = require("../controllers/UsersAvatarController");

const usersRoutes = Router();
// const upload = multer(uploadConfig.MULTER);
const usersController = new UsersController();
// const usersAvatarController = new UsersAvatarController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
//usersRoutes.patch("/", ensureAuthenticated, usersController.update);

usersRoutes.get("/:email", usersController.show);

module.exports = usersRoutes;

const functions = require("firebase-functions");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swagerFile = require("./src/swagger.json");
const swagerFilePtBr = require("./src/swagger_pt-br.json");
const routes = require("./src/routes");

const app = express();
const cors = require("cors");

// Rotas básicas para facilitar o front-end
app.use(cors({}));
app.use(express.json());

app.use("/docs/en", swaggerUi.serve, (req, res) => {
  const html = swaggerUi.generateHTML(swagerFile);
  res.send(html);
});

app.use("/docs/pt-br", swaggerUi.serve, (req, res) => {
  const html = swaggerUi.generateHTML(swagerFilePtBr);
  res.send(html);
});

app.use(routes);

// Exporte a função do Firebase
exports.app = functions.https.onRequest(app);

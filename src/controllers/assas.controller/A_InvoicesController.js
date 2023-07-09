const dotenv = require("dotenv");
const request = require("request");

// Configuração inicial e basica para funcionar a API do ASSAS
dotenv.config();
const ACESS_TOKEN = process.env.SUA_CHAVE_API;
/* const URL_BASE = (process.env.URL_SANDBOX += "/api/v3/payments"); */
const CONTENT_TYPE_DO_HEADER = `Content-Type": "application/json`;

// Controller da aplicação
class A_InvoicesController {
  async create(req, res) {
    try {
      const {
        customer,
        billingType,
        dueDate,
        value,
        description,
        externalReference,
        discount,
        fine,
        interest,
        postalService,
      } = req.body;

      request(
        {
          method: "POST",
          url: (process.env.URL_SANDBOX += "/api/v3/payments"),
          followOriginalHttpMethod: true,
          followRedirect: true,
          followAllRedirects: true,
          headers: {
            CONTENT_TYPE_DO_HEADER,
            access_token: ACESS_TOKEN,
          },
          body: JSON.stringify({
            customer,
            billingType,
            dueDate,
            value,
            description,
            externalReference,
            discount,
            fine,
            interest,
            postalService,
          }),
        },
        function (error, res, body) {
          console.log("Status:", res.statusCode);
          console.log("Headers:", JSON.stringify(res.headers));
          console.log("Response:", body);
        },
      );
    } catch (error) {
      console.error("Erro na requisição Asaas:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async show(req, res) {
    request(
      {
        method: "GET",
        url: (process.env.URL_SANDBOX += "/api/v3/payments"),
        headers: {
          access_token: ACESS_TOKEN,
        },
      },
      function (error, response, body) {
        console.log("Status:", response.statusCode);
        console.log("Headers:", JSON.stringify(response.headers));
        console.log("Response:", body);
        const payments = JSON.parse(body);
        res.status(response.statusCode).json(payments);
      },
    );
  }

  async update(req, res) {}
}

module.exports = A_InvoicesController;

const dotenv = require("dotenv");
const request = require("request");

dotenv.config();
const ACESS_TOKEN = process.env.SUA_CHAVE_API;
const URL_BASE = (process.env.URL_SANDBOX += "/api/v3/customers");
const CONTENT_TYPE_DO_HEADER = `Content-Type": "application/json`;

class PaymentsController {
  async create(req, res) {
    try {
      const {
        email,
        name,
        phone,
        mobilePhone,
        cpfCnpj,
        postalCode,
        address,
        addressNumber,
        complement,
        province,
        externalReference,
        notificationDisabled,
        additionalEmails,
        municipalInscription,
        stateInscription,
        observations,
      } = req.body;

      const responseAsaas = await fetch(URL_BASE, {
        method: "POST",
        headers: {
          CONTENT_TYPE_DO_HEADER,
          access_token: ACESS_TOKEN,
        },
        body: JSON.stringify({
          email,
          name,
          phone,
          mobilePhone,
          cpfCnpj,
          postalCode,
          address,
          addressNumber,
          complement,
          province,
          externalReference,
          notificationDisabled,
          additionalEmails,
          municipalInscription,
          stateInscription,
          observations,
        }),
      });

      console.log("ASAS RETORNO =>>", responseAsaas);

      if (!responseAsaas.ok) {
        throw new Error(`Erro na requisição Asaas: ${responseAsaas.status}`);
      }

      const responseData = await responseAsaas.text();
      const data = responseData ? JSON.parse(responseData) : null;

      return res.json(data);
    } catch (error) {
      console.error("Erro na requisição Asaas:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async show(req, res) {
    request(
      {
        method: "GET",
        url: URL_BASE,
        headers: {
          access_token: ACESS_TOKEN,
        },
      },
      function (error, response, body) {
        console.log("Status:", response.statusCode);
        console.log("Headers:", JSON.stringify(response.headers));
        console.log("Response:", body);

        const customers = JSON.parse(body);
        res.status(response.statusCode).json(customers);
      },
    );
  }

  async update(req, res) {
    var request = require("request");

    request(
      {
        method: "POST",
        url: URL_BASE,
        headers: {
          "Content-Type": "application/json",
          access_token: ACESS_TOKEN,
        },
        body: '{  "name": "Marcelo Almeida",  "email": "marcelo.almeida@gmail.com",  "phone": "4738010919",  "mobilePhone": "4799376637",  "cpfCnpj": "24971563792",  "postalCode": "01310-000",  "address": "Av. Paulista",  "addressNumber": "150",  "complement": "Sala 201",  "province": "Centro",  "externalReference": "12987382",  "notificationDisabled": false,  "additionalEmails": "marcelo.almeida2@gmail.com,marcelo.almeida3@gmail.com",  "municipalInscription": "46683695908",  "stateInscription": "646681195275"}',
      },
      function (error, response, body) {
        console.log("Status:", response.statusCode);
        console.log("Headers:", JSON.stringify(response.headers));
        console.log("Response:", body);
      },
    );
  }
}
module.exports = PaymentsController;

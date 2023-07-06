const dotenv = require("dotenv");

dotenv.config();

const accessToken = process.env.SUA_CHAVE_API;

class PaymentsController {
  async create(req, res) {
    try {
      const responseAsaas = await fetch(
        (process.env.URL_SANDBOX += "/api/v3/customers"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            access_token: accessToken,
          },
          body: JSON.stringify({
            name: "codigoss Almeida",
            email: "ojklhjkgh.almeida@gmail.com",
            phone: "4738010919",
            mobilePhone: "4799376637",
            cpfCnpj: "24971563792",
            postalCode: "01310-000",
            address: "Av. Paulista",
            addressNumber: "150",
            complement: "Sala 201",
            province: "Centro",
            externalReference: "12987382",
            notificationDisabled: false,
            additionalEmails:
              "marcelo.almeida2@gmail.com,marcelo.almeida3@gmail.com",
            municipalInscription: "46683695908",
            stateInscription: "646681195275",
            observations: "ótimo pagador, nenhum problema até o momento",
          }),
        },
      );

      if (!responseAsaas.ok) {
        throw new Error(`Erro na requisição Asaas: ${responseAsaas.status}`);
      }

      const data = await responseAsaas.json();
      return res.json(data);
    } catch (error) {
      console.error("Erro na requisição Asaas:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = PaymentsController;

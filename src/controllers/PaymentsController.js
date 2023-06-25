const dotenv = require("dotenv");

dotenv.config();

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class PaymentsController {
  create(req, res) {
    const url = (process.env.URL_SANDBOX += "/api/v3/customers");
    const accessToken = process.env.SUA_CHAVE_API;

    const request = new XMLHttpRequest();
    request.open("POST", url);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("access_token", accessToken);

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        /*   console.log("Status:", this.status);
        console.log("Headers:", this.getAllResponseHeaders());
        console.log("Body:", this.responseText); */

        res.sendStatus(this.status);
      }
    };

    const body = {
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
      additionalEmails: "marcelo.almeida2@gmail.com,marcelo.almeida3@gmail.com",
      municipalInscription: "46683695908",
      stateInscription: "646681195275",
      observations: "ótimo pagador, nenhum problema até o momento",
    };

    request.send(JSON.stringify(body));
  }
}

module.exports = PaymentsController;

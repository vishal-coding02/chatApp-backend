require("dotenv").config();
const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const transporter = new SibApiV3Sdk.TransactionalEmailsApi();

module.exports = { transporter };

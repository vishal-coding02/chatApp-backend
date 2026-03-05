const { transporter } = require("./transporter");
const SEND_EMAIL_TEMPLATE = require("./email/templates/sendEmailTemplate");

const sendEmail = async ({ toEmail, userFullName, token }) => {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const htmlContent = SEND_EMAIL_TEMPLATE.replace(
    /{userFullName}/g,
    userFullName,
  ).replace(/{token}/g, verifyLink);

  try {
    const response = await transporter.sendMail({
      from: process.env.SMTP_EMAIL_FROM,
      to: toEmail,
      subject: "Verify Your Email - ChatHub",
      html: htmlContent,
    });
    console.log("EMAIL RESPONSE:", response);
  } catch (error) {
    console.error("Error sending verify email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendEmail };

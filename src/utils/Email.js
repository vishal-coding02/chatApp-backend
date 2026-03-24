const { transporter } = require("./transporter");
const SEND_EMAIL_TEMPLATE = require("./email/templates/sendEmailTemplate");

const sendEmail = async ({ toEmail, userFullName, token }) => {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const htmlContent = SEND_EMAIL_TEMPLATE.replace(
    /{userFullName}/g,
    userFullName,
  ).replace(/{token}/g, verifyLink);

  try {
    await transporter.sendTransacEmail({
      sender: {
        email: process.env.SMTP_USER,
        name: "ChatHub",
      },
      to: [
        {
          email: toEmail,
        },
      ],
      subject: "Verify Your Email - ChatHub",
      htmlContent: htmlContent,
    });
  } catch (error) {
    console.error("Error sending verify email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendEmail };

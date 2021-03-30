const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_ACCOUNT,
    password: process.env.MAIL_PASSWORD,
  },
});

module.exports = {
  send: (from, to, subject, text) => {
    const options = {
      from,
      to,
      subject,
      text,
    };

    return transporter.sendMail(options);
  },
};

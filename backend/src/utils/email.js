const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "devendradhote179@gmail.com",
    pass: "qdcuulwjlujxhmxs",
  },
});
exports.sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: "princechouksey179@gmail.com",
    to,
    subject,
    html: htmlContent,
  };
};
return transporter.sendMail(mailOptions, (error, info) => {
  if (err) console.log("error in sending email", error);
  console.log("email sent successfully", info.response);
});

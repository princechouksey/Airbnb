const nodemailer  = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use Mailtrap / any SMTP service
      auth: {
        user: process.env.GMAIL_USER, // your email address
        pass: process.env.GMAIL_PASS, // your email password or app password
       
      },
    });
   // console.log('transporter--->', transporter);
    

    await transporter.sendMail({
      from: process.env.GMAIL_USER, // sender address
      to,
      subject,
      html, // ✅ use html instead of text
    });

    console.log("Email sent successfully ✅");
  } catch (error) {
    console.error("Email sending failed ❌", error);
  }
};

module.exports = sendEmail;

import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const sendMail = async ({ to, subject, text }) => {
  //transporter setup
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("email sent: " + info.response);
  } catch (error) {
    console.log("error sending email:", error);
  }
};

export default sendMail;
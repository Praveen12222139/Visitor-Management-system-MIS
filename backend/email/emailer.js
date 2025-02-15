

import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
configDotenv();

const sendEmail = async (email, name, data, attachment) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Ignore self-signed certificate issues
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Appointment Request",
      html: `<h2>Hi ${name}</h2> <h4>${data}</h4>`,
      attachments: [
        {
          filename: "appointment_qrcode.png",
          content: attachment.split("base64,")[1], // Extract base64 string from Data URL
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
const sendEmailWA= async (email, name, data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Ignore self-signed certificate issues
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Appointment Request",
      html: `<h2>Hi ${name}</h2> <h4>${data}</h4>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  }catch(err){
    console.error("Error sending email:", err);
  }
}


export { sendEmail, sendEmailWA };


import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    // Use "gmail" if using a Gmail App Password
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Your Gmail App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
    html: html, // Optional: Allows you to send pretty HTML emails later
  };

  await transporter.sendMail(mailOptions);
};
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Explicit host
      port: 587,              // Standard secure port for cloud servers
      secure: false,          // false for port 587 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // This helps prevent errors on some cloud networks
      tls: {
        rejectUnauthorized: false
      },
      family: 4
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    // Use await here to catch errors, but we will handle the speed in the Controller
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: " + info.response);
    
  } catch (error) {
    // Log the error so you can see it in Render logs
    console.error("Email sending failed:", error); 
    // We do NOT throw the error, so the user registration doesn't crash
  }
};
import nodemailer from "nodemailer";

// Set up a transporter
const transporter = nodemailer.createTransport({
  // service: "zohomail", // You can use any other email service provider
  host: "smtp.zoho.com", // Zoho's SMTP server
  port: 465, // Secure SMTP port for Zoho
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

// Function to send email with HTML content
const sendEmail = async (toEmailAddress, subject, text, htmlContent) => {
  const mailOptions = {
    from: process.env.ZOHO_EMAIL, // Sender's email
    to: toEmailAddress, // Recipient's email
    subject: subject, // Email subject
    text: text, // Plain text version of the email
    html: htmlContent, // HTML version of the email
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("Successfully Email sent TO:", info.accepted);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

export default sendEmail;

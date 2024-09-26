import nodemailer from "nodemailer";

// Set up a transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any other email service provider
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// Function to send email with HTML content
const sendEmail = (toEmailAddress, subject, text, htmlContent) => {
  const mailOptions = {
    from: process.env.USER_EMAIL, // Sender's email
    to: toEmailAddress, // Recipient's email
    subject: subject, // Email subject
    text: text, // Plain text version of the email
    html: htmlContent, // HTML version of the email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export default sendEmail;

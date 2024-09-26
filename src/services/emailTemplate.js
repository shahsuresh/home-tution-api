//?==== HTML email content=========

//#===============  password change email content =================================#

export const passwordChangedEmail = (username) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; color: #333;">
      <div style="background-color: #007bff; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Password Changed Successfully</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #555;">Hello ${username},</p>
        <p style="font-size: 16px; color: #555;">
          We wanted to let you know that your account password has been successfully changed. If you did not make this change, please contact us immediately.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://yourwebsite.com/support" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Contact Support</a>
        </div>
        <p style="font-size: 16px; color: #555;">
          If you made this change, you can safely ignore this email.
        </p>
        <p style="font-size: 14px; color: #999;">
          Best regards,<br>
          The One to One Tuition Team
        </p>
        <hr style="border: 0; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you did not request a password change,please <a href="https://yourwebsite.com/support" style="color: #007bff;">contact support</a> immediately.
        </p>
      </div>
    </div>
  `;
};

//#===============  contact-us form reply email content =================================#

export const contactUsReplyEmail = (username, inquiry) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; color: #333;">
      <div style="background-color: #28a745; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Thank You for Contacting Us, ${username}!</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #555;">Dear ${username},</p>
        <p style="font-size: 16px; color: #555;">
          We have received your message and will get back to you as soon as possible. Thank you for reaching out to us!
        </p>
        <p style="font-size: 16px; color: #555;">
          <strong>Your Inquiry:</strong><br>
          "${inquiry}"
        </p>
        <p style="font-size: 16px; color: #555;">
          Our team is reviewing your inquiry and will respond within the next 24-48 hours.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="#" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Visit Our Support Page</a>
        </div>
        <p style="font-size: 14px; color: #999;">
          If you have any further questions, feel free to reply to this email or visit our support page using the link above.
        </p>
        <p style="font-size: 14px; color: #999;">
          Best regards,<br>
          The One to One Tuition Team
        </p>
        <hr style="border: 0; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          This is an automated message. Please do not reply directly to this email.
        </p>
      </div>
    </div>
  `;
};

//#===============  student request-success email content =======================#

export const studentRegistrationSuccessEmail = (studentName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; color: #333;">
      <div style="background-color: #28a745; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome to One to One Tuition!</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #555;">Hello ${studentName},</p>
        <p style="font-size: 16px; color: #555;">
          We are excited to welcome you to One to One Tuition! Your registration was successful, and you're now a part of a growing community of students eager to enhance their learning experience with personalized, high-quality home tuition.
        </p>
        <p style="font-size: 16px; color: #555;">
          What's next:
        </p>
        <ul style="font-size: 16px; color: #555;">
          <li>We will match you with personalized tutor recommendations.</li>
          <li>We will find best available tutors based on subjects and location & Timing.</li>
          <li>Out team will contact you with the tutor details </li>
          <li>start your learning journey!</li>
        </ul>
       
        <p style="font-size: 16px; color: #555;">
          If you have any questions, feel free to <a href="mailto:support@onetoone.com" style="color: #28a745;">contact our support team</a>.
        </p>
        <p style="font-size: 14px; color: #999;">
          Best regards,<br>
          The One to One Tuition Team
        </p>
        <hr style="border: 0; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you did not register for this account, please <a href="https://yourwebsite.com/security" style="color: #28a745;">review your account activity</a> or <a href="https://yourwebsite.com/support" style="color: #28a745;">contact support</a> immediately.
        </p>
      </div>
    </div>
  `;
};

//#===============  teacher registration-success reply email content =================================#
export const teacherRegistrationSuccessEmail = (username) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; color: #333;">
      <div style="background-color: #28a745; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome, ${username}!</h1>
        <h2 style="color: white; margin: 0;">Your Registration is Successful</h2>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #555;">Dear ${username},</p>
        <p style="font-size: 16px; color: #555;">
          We're thrilled to have you join the One to One Tuition platform as a teacher! Your registration has been successfully completed, and you're now part of a community dedicated to connecting students with quality educators.
        </p>
        
        <h3 style="color: #28a745;">What's next?</h3>
        <ul style="font-size: 16px; color: #555; padding-left: 20px;">
          <li style="margin-bottom: 10px;">Complete your teacher profile by adding more details about your qualifications and expertise.</li>
          <li style="margin-bottom: 10px;"> Post your availability for home tuition classes.</li>
          <li style="margin-bottom: 10px;">Make sure to keep your profile updated to attract more students.</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://yourwebsite.com/teacher/dashboard" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px;">
            Go to Your Dashboard
          </a>
        </div>

        <p style="font-size: 16px; color: #555;">
          If you need any help along the way, feel free to reach out to our support team.
        </p>

        <p style="font-size: 14px; color: #999;">
          Best regards,<br>
          The One to One Tuition Team
        </p>

        <hr style="border: 0; border-top: 1px solid #ddd;" />

        <p style="font-size: 12px; color: #999; text-align: center;">
          If you did not register for this account, please <a href="https://yourwebsite.com/support" style="color: #28a745;">contact support</a> immediately.
        </p>
      </div>
    </div>
  `;
};

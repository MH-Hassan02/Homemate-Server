import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "officialhomemate@gmail.com",
    pass: "kfwo ydmx vmem ofao",
  },
});

// Function to send verification email
const sendEmail = (email, link, name) => {
  const mailOptions = {
    from: "officialhomemate@gmail.com",
    to: email,
    subject: "Verify your email",
    html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Welcome to Homemate, ${name}!</h2>
                <p>Thank you for signing up on our platform. To complete your registration, please verify your email address by clicking the link below:</p>
                <p><a href="${link}" style="color: #007bff; text-decoration: none; font-weight: bold;">Verify My Email</a></p>
                <p>If you did not create an account with us, you can safely ignore this email. No further action is required.</p>
                <p style="margin-top: 20px; font-size: 14px; color: #777;">If you have any questions or need assistance, please contact us at <a href="mailto:support@homemate.com" style="color: #007bff; text-decoration: none;">support@homemate.com</a>.</p>
                <p style="margin-top: 20px; font-size: 14px; color: #777;">Thank you,<br>The Homemate Team</p>
            </div>
        `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export default sendEmail;

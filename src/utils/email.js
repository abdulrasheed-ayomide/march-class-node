const nodemailer = require("nodemailer");
const envObj = require("../config/env");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envObj.appEmail,
    pass: envObj.appPassword,
  },
});

const verifyTransport = async () => {
  try {
    await transporter.verify();

    console.log("Server is ready to take our messages");
  } catch (error) {
    console.log("Verification failed:", error);
  }
};

const sendMail = async () => {
  try {
    const info = await transporter.sendMail({
      from: envObj.appEmail, // sender address
      to: "abiodunhusinat@gmail.com", // list of recipients  abiodunhusinat@gmail.com
      subject: "Hello", // subject line  
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

const sendWelcomingEmail = async (name, email) => {
  try {
    const info = await transporter.sendMail({
      from: envObj.appEmail,
      to: email,
      subject: `Welcome ${name}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Onboard!</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f6f9fc; font-family: sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .card { background-color: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .btn { background: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 6px; display: inline-block; font-weight: bold; }
        .footer { text-align: center; font-size: 12px; color: #a0aec0; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1 style="color: #1a202c; font-size: 24px;">Welcome to the community! 🎉</h1>
            <p style="color: #4a5568; font-size: 16px; line-height: 24px;">Hi ${name},</p>
            <p style="color: #4a5568; font-size: 16px; line-height: 24px;">We are absolutely thrilled to have you here. Your account is officially set up and ready to go.</p>
            <p style="margin: 30px 0;"><a href="https://www.linkedin.com/in/rasheed-ayomide-3a8453395" class="btn">Get Started Now</a></p>
            <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;">
            <p style="color: #718096; font-size: 14px;">Cheers,<br><strong>The Team</strong></p>
        </div>
        <div class="footer">
            <p>123 Business Rd, Suite 100, San Francisco, CA 94103</p>
            <p><a href="#" style="color: #4f46e5;">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error while sending mail:", error);
  }
};

const sendVerificationEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: envObj.appEmail,

      to: email,

      subject: "Verify Your Email",

      html: `
        <div style="font-family: sans-serif; background: #f6f9fc; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
            <h1 style="font-size: 24px; color: #1a202c; margin-bottom: 16px;">Email Verification</h1>
            <p style="font-size: 16px; color: #4a5568; line-height: 1.5; margin-bottom: 24px;">Your verification code is:</p>
            <div style="display: inline-block; padding: 16px 24px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;">
              <h2 style="font-size: 28px; color: #4f46e5; margin: 0; letter-spacing: 2px;">${otp}</h2>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Verification email sent");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verifyTransport, sendMail, sendWelcomingEmail, sendVerificationEmail};
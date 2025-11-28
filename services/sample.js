const axios = require("axios");
const base64 = require("base-64");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

exports.sendEmail = async (to, subject, html) => {
  try {
    async function getAccessToken() {
      const res = await axios.post(
        "https://api.sendpulse.com/oauth/access_token",
        {
          grant_type: "client_credentials",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }
      );
      return res.data.access_token;
    }

    async function executeSendEmail() {
      const token = await getAccessToken();

      const emailData = {
        email: {
          text: base64.encode(html),
          html: base64.encode(html),
          subject,
          from: {
            name: `${process.env.FROM_NAME}`,
            email: `${process.env.FROM_EMAIL}`,
          },
          to: [
            {
              email: to,
              // name: "John Doe",
              //   variables: {
              //     name: "John",
              //     company: "MyApp",
              //   },
            },
          ],
          //   template: {
          //     id: 1234567, // <-- replace with your actual template ID
          //   },
        },
      };

      const res = await axios.post(
        "https://api.sendpulse.com/smtp/emails",
        emailData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Email sent successfully:", res.data);
    }

    await executeSendEmail();
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw error;
  }
};

exports.sendVerificationEmail = async (email, name, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/views/verify-email.html?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #13a4ec;">Welcome to VeeTech, ${name}!</h2>
        <p>Thank you for registering. Please verify your email address to complete your registration.</p>
        <p style="margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #13a4ec; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Verify Email
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Or copy this link: ${verificationLink}</p>
        <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
      </div>
    </body>
    </html>
  `;

  await this.sendEmail(email, "Verify Your Email - VeeTech", html);
};

exports.sendPasswordResetEmail = async (email, name, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password.html?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below:</p>
        <p style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #13a4ec; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
        <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
      </div>
    </body>
    </html>
  `;

  await exports.sendEmail(email, "Password Reset Request - VeeTech", html);
};

exports.sendStudentWelcomeEmail = async (
  email,
  name,
  tempPassword,
  schoolName = ""
) => {
  try {
    const loginLink = `${process.env.FRONTEND_URL}/login.html`;
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #13a4ec;">Welcome, ${name}!</h2>
          <p>Your account has been created by ${
            schoolName || "your school"
          } on VeeTech.</p>

          <p><strong>Temporary Password:</strong></p>
          <p style="background:#f5f5f5;padding:12px;border-radius:6px;font-family:monospace;">${tempPassword}</p>

          <p>Please use the temporary password above to sign in and change your password immediately.</p>

          <p style="margin: 24px 0;">
            <a href="${loginLink}" style="background-color: #13a4ec; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Sign In
            </a>
          </p>

          <p style="color:#666;font-size:13px;">If you did not expect this email, please contact your school administrator.</p>

          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
          <p style="color:#999;font-size:12px;">This is an automated message from VeeTech.</p>
        </div>
        </body>
      </html>
    `;

    await exports.sendEmail(email, "Your VeeTech Student Account", html);
  } catch (err) {
    console.error("Failed to send student welcome email:", err);
    throw err;
  }
};

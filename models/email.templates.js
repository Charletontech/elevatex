const logoUrl =
  process.env.LOGO_URL ||
  "https://res.cloudinary.com/dbfue99qr/image/upload/c_thumb,w_200,g_face/v1764243416/Gemini_Generated_Image_wyuc3gwyuc3gwyuc_iakvy5.png";

// Brand Configuration
const BRAND = {
  name: "ElevateX Assets",
  url: "https://elevatexassets.com",
  logo: logoUrl,
  colors: {
    bg: "#020617", // Main Background
    card: "#0f172a", // Card Background
    border: "#1e293b", // Border Color
    text: "#cbd5e1", // Body Text
    heading: "#ffffff", // Headings
    accent: "#22d3ee", // Cyan Accent
    buttonStart: "#3b82f6", // Blue
    buttonEnd: "#22d3ee", // Cyan
  },
};

/**
 * Shared Header Component
 * Features a gradient top border and centered logo.
 */
const getHeader = () => {
  return `
    <!-- Top Gradient Line -->
    <tr>
      <td height="4" style="background: linear-gradient(90deg, ${BRAND.colors.buttonStart} 0%, ${BRAND.colors.accent} 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
    </tr>
    <!-- Logo Section -->
    <tr>
      <td align="center" style="padding: 40px 0 30px 0;">
        <a href="${BRAND.url}" target="_blank" style="text-decoration: none;">
          <img src="${BRAND.logo}" alt="${BRAND.name}" width="180" style="display: block; font-family: sans-serif; color: #ffffff; border: 0;">
        </a>
      </td>
    </tr>
  `;
};

const getFooter = () => {
  const year = new Date().getFullYear();
  return `
    <tr>
      <td align="center" style="padding: 30px; background-color: #020617; border-top: 1px solid ${BRAND.colors.border};">
        <p style="margin: 0 0 10px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #ffffff; font-weight: bold;">
          ${BRAND.name}
        </p>
        <p style="margin: 0 0 10px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #64748b;">
          123 Financial District, New York, NY 10005
        </p>
        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #475569;">
          &copy; ${year} ${BRAND.name}. All rights reserved.
        </p>
        <div style="margin-top: 15px;">
          <a href="${BRAND.url}/legal-and-privacy/" style="color: ${BRAND.colors.accent}; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy Policy</a>
          <a href="${BRAND.url}/legal-and-privacy/" style="color: ${BRAND.colors.accent}; text-decoration: none; font-size: 12px; margin: 0 10px;">Terms of Service</a>
        </div>
      </td>
    </tr>
  `;
};

/**
 * Main Layout Wrapper
 * Centers the content card on a dark background.
 */
const wrapTemplate = (content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${BRAND.name}</title>
      <style>
        /* Reset Styles */
        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        
        /* Font Import (Outlook will ignore this and fall back to Arial) */
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');
        
        /* Mobile Responsive */
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; }
          .content-padding { padding: 20px !important; }
          .mobile-text { font-size: 16px !important; }
        }
      </style>
    </head>
    <body style="background-color: ${BRAND.colors.bg}; margin: 0; padding: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${
        BRAND.colors.bg
      };">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <!-- Main Card -->
            <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: ${
              BRAND.colors.card
            }; border: 1px solid ${
    BRAND.colors.border
  }; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              ${getHeader()}
              
              <!-- Content Area -->
              <tr>
                <td class="content-padding" style="padding: 0 40px 40px 40px;">
                  ${content}
                </td>
              </tr>
              
              ${getFooter()}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * WELCOME EMAIL TEMPLATE
 */
const getWelcomeEmailTemplate = (user) => {
  const loginUrl = `${BRAND.url}/login`; // Replace with production URL

  const content = `
    <h1 style="margin: 0 0 20px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 28px; line-height: 36px; color: ${BRAND.colors.heading}; text-align: center;">
      Welcome to <span style="color: ${BRAND.colors.accent};">The Future</span>
    </h1>
    
    <p style="margin: 0 0 24px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${BRAND.colors.text}; text-align: center;">
      Hello <strong>${user.fullname}</strong>,<br><br>
      Thank you for joining <strong>ElevateX Assets</strong>. You have taken the first step towards smarter, data-driven wealth creation. Our platform gives you the tools to invest in high-growth digital assets with confidence.
    </p>

    <!-- Action Button -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px 0 30px 0;">
          <a href="${loginUrl}" style="background: linear-gradient(90deg, ${BRAND.colors.buttonStart}, ${BRAND.colors.buttonEnd}); color: #ffffff; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3);">
            Access Dashboard
          </a>
        </td>
      </tr>
    </table>

    <!-- Features Grid (Simple Table) -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid ${BRAND.colors.border}; padding-top: 30px;">
      <tr>
        <td width="33%" align="center" style="padding: 10px;">
          <img src="https://img.icons8.com/ios-filled/50/22d3ee/bullish.png" width="32" style="display:block; margin-bottom:10px;">
          <p style="margin:0; font-family: 'Outfit', sans-serif; font-size:12px; color:${BRAND.colors.text};">High ROI</p>
        </td>
        <td width="33%" align="center" style="padding: 10px; border-left: 1px solid ${BRAND.colors.border}; border-right: 1px solid ${BRAND.colors.border};">
          <img src="https://img.icons8.com/ios-filled/50/22d3ee/shield.png" width="32" style="display:block; margin-bottom:10px;">
          <p style="margin:0; font-family: 'Outfit', sans-serif; font-size:12px; color:${BRAND.colors.text};">Secure</p>
        </td>
        <td width="33%" align="center" style="padding: 10px;">
          <img src="https://img.icons8.com/ios-filled/50/22d3ee/online-support.png" width="32" style="display:block; margin-bottom:10px;">
          <p style="margin:0; font-family: 'Outfit', sans-serif; font-size:12px; color:${BRAND.colors.text};">24/7 Support</p>
        </td>
      </tr>
    </table>
  `;

  return wrapTemplate(content);
};

/**
 * FORGOT PASSWORD EMAIL TEMPLATE
 */
const getForgotPasswordEmailTemplate = (user, resetUrl) => {
  const content = `
    <!-- Icon -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://img.icons8.com/fluency-systems-filled/96/22d3ee/lock.png" width="48" alt="Lock">
    </div>

    <h1 style="margin: 0 0 20px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 32px; color: ${BRAND.colors.heading}; text-align: center;">
      Reset Your Password
    </h1>
    
    <p style="margin: 0 0 24px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${BRAND.colors.text}; text-align: center;">
      Hello <strong>${user.fullname}</strong>,<br>
      We received a request to reset the password for your account. If you didn't ask for this, you can safely ignore this email.
    </p>

    <!-- Action Button -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 10px 0 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(90deg, ${BRAND.colors.buttonStart}, ${BRAND.colors.buttonEnd}); color: #ffffff; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3);">
            Set New Password
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 22px; color: #64748b; text-align: center;">
      This link is valid for 1 hour. For security reasons, please do not share this link with anyone.
    </p>
  `;

  return wrapTemplate(content);
};

const getDepositApprovedEmailTemplate = (user, transaction) => {
  const content = `
    <h1 style="margin: 0 0 20px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 32px; color: ${BRAND.colors.heading}; text-align: center;">
      Deposit Approved
    </h1>
    
    <p style="margin: 0 0 24px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${BRAND.colors.text}; text-align: center;">
      Hello <strong>${user.fullname}</strong>,<br>
      Your deposit of <strong>$${transaction.amount}</strong> has been approved and your balance has been updated.
    </p>

    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px 0 30px 0;">
          <a href="${BRAND.url}/dashboard" style="background: linear-gradient(90deg, ${BRAND.colors.buttonStart}, ${BRAND.colors.buttonEnd}); color: #ffffff; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3);">
            View Dashboard
          </a>
        </td>
      </tr>
    </table>
  `;

  return wrapTemplate(content);
};

const getDepositDeclinedEmailTemplate = (user, transaction) => {
  const content = `
    <h1 style="margin: 0 0 20px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 32px; color: ${BRAND.colors.heading}; text-align: center;">
      Deposit Declined
    </h1>
    
    <p style="margin: 0 0 24px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${BRAND.colors.text}; text-align: center;">
      Hello <strong>${user.fullname}</strong>,<br>
      We regret to inform you that your deposit of <strong>$${transaction.amount}</strong> has been declined.
    </p>

    <p style="margin: 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 22px; color: #64748b; text-align: center;">
      If you have any questions, please contact our support team.
    </p>
  `;

  return wrapTemplate(content);
};

const getWithdrawalApprovedEmailTemplate = (user, transaction) => {
  const content = `
    <h1 style="margin: 0 0 20px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 32px; color: ${BRAND.colors.heading}; text-align: center;">
      Withdrawal Approved
    </h1>
    
    <p style="margin: 0 0 24px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${BRAND.colors.text}; text-align: center;">
      Hello <strong>${user.fullname}</strong>,<br>
      Your withdrawal request for <strong>$${transaction.amount}</strong> has been approved and is being processed.
    </p>

    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px 0 30px 0;">
          <a href="${BRAND.url}/dashboard" style="background: linear-gradient(90deg, ${BRAND.colors.buttonStart}, ${BRAND.colors.buttonEnd}); color: #ffffff; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3);">
            View Dashboard
          </a>
        </td>
      </tr>
    </table>
  `;

  return wrapTemplate(content);
};

const getWithdrawalDeclinedEmailTemplate = (user, transaction) => {
  const content = `
    <h1 style="margin: 0 0 20px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 32px; color: ${BRAND.colors.heading}; text-align: center;">
      Withdrawal Declined
    </h1>
    
    <p style="margin: 0 0 24px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${BRAND.colors.text}; text-align: center;">
      Hello <strong>${user.fullname}</strong>,<br>
      We regret to inform you that your withdrawal request for <strong>$${transaction.amount}</strong> has been declined.
    </p>

    <p style="margin: 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 22px; color: #64748b; text-align: center;">
      If you have any questions, please contact our support team.
    </p>
  `;

  return wrapTemplate(content);
};

const getLoanApprovedEmailTemplate = (user, loan) => {
  const content = `
    <h1 style="margin: 0 0 20px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 32px; color: ${BRAND.colors.heading}; text-align: center;">
      Loan Application Approved
    </h1>
    
    <p style="margin: 0 0 24px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${BRAND.colors.text}; text-align: center;">
      Hello <strong>${user.fullname}</strong>,<br>
      Congratulations! Your loan application for <strong>$${loan.amount}</strong> has been approved. The funds have been added to your account balance.
    </p>

    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px 0 30px 0;">
          <a href="${BRAND.url}/dashboard" style="background: linear-gradient(90deg, ${BRAND.colors.buttonStart}, ${BRAND.colors.buttonEnd}); color: #ffffff; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3);">
            View Dashboard
          </a>
        </td>
      </tr>
    </table>
  `;

  return wrapTemplate(content);
};

const getLoanDeclinedEmailTemplate = (user, loan) => {
  const content = `
    <h1 style="margin: 0 0 20px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 32px; color: ${BRAND.colors.heading}; text-align: center;">
      Loan Application Update
    </h1>
    
    <p style="margin: 0 0 24px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${BRAND.colors.text}; text-align: center;">
      Hello <strong>${user.fullname}</strong>,<br>
      We regret to inform you that your loan application for <strong>$${loan.amount}</strong> has been declined.
    </p>

    <p style="margin: 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 22px; color: #64748b; text-align: center;">
      If you have any questions, please contact our support team.
    </p>
  `;

  return wrapTemplate(content);
};

const getCustomEmailTemplate = (recipient, subject, message) => {
  const content = `
    <h1 style="margin: 0 0 20px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 32px; color: ${BRAND.colors.heading}; text-align: center;">
      ${subject}
    </h1>
    
    <p style="margin: 0 0 24px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${BRAND.colors.text};">
      Hello <strong>${recipient.name}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; font-family: 'Outfit', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; color: ${BRAND.colors.text};">
      ${message}
    </p>
  `;

  return wrapTemplate(content);
};

// Export for usage
module.exports = {
  getWelcomeEmailTemplate,
  getForgotPasswordEmailTemplate,
  getDepositApprovedEmailTemplate,
  getDepositDeclinedEmailTemplate,
  getWithdrawalApprovedEmailTemplate,
  getWithdrawalDeclinedEmailTemplate,
  getLoanApprovedEmailTemplate,
  getLoanDeclinedEmailTemplate,
  getCustomEmailTemplate,
};

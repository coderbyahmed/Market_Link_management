const LOGO_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="44" height="44" style="vertical-align: middle;">
      <rect width="64" height="64" rx="16" fill="#1e3f27"/>
      <path d="M32 46c-8-4-13-10-13-18 0-6 3-10 8-12-1 8 2 14 5 17V13c6 1 10 6 10 13 0 8-4 14-10 18v2z" fill="#97cd9e"/>
      <path d="M21 39c-3-1-5-3-6-6 4 0 8 1 10 3-2 1-4 2-4 3z" fill="#67b173"/>
    </svg>
`;

const escapeHtml = (value) =>
    String(value || "there")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

const buildCustomerWelcomeEmail = ({ name }) => {
    const safeName = escapeHtml(name);
    const subject = "Welcome to Market Link — Account Created Successfully";

    const html = `
        <div style="background-color: #f0f4f0; padding: 24px 12px;">
          <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e8e0; border-radius: 16px; overflow: hidden; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #23303b;">
            <div style="background-color: #1e3f27; padding: 26px 32px; text-align: center;">
              ${LOGO_SVG}
              <div style="display: inline-block; vertical-align: middle; margin-left: 10px; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.4px;">Market<span style="color: #97cd9e;">Link</span></div>
            </div>
            <div style="padding: 32px;">
              <div style="display: inline-block; margin-bottom: 18px; padding: 6px 10px; border-radius: 999px; background-color: #e9f5eb; color: #1e3f27; font-size: 12px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase;">Account Confirmed</div>
              <h1 style="margin: 0 0 20px; font-size: 24px; line-height: 1.3; font-weight: 700; color: #1e3f27;">Welcome to Market Link, ${safeName}!</h1>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #4a5a63;">
                Your customer account has been created successfully. You can now log in using the email address and password you registered with.
              </p>
              <div style="margin: 24px 0; padding: 18px 20px; background-color: #f0f8f1; border: 1px solid #cfe6d2; border-left: 4px solid #4b9b59; border-radius: 10px;">
                <p style="margin: 0 0 6px; font-size: 14px; font-weight: 700; color: #1e3f27;">You are ready to sign in</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4a5a63;">Use your registered email address and password to access your customer account.</p>
              </div>
              <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #4a5a63;">
                Thank you for joining Market Link. We are pleased to have you as part of our marketplace community.
              </p>
            </div>
            <div style="background-color: #f0f4f0; padding: 20px 32px; text-align: center; border-top: 1px solid #e0e8e0;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #33503b;"><strong>MarketLink</strong> — Fresh food, straight from local farms.</p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #7a8a93;">
                This is an informational account confirmation email. MarketLink will never ask for your password.
              </p>
            </div>
          </div>
        </div>
    `;

    const text = `
Welcome to Market Link — Account Created Successfully

Hello ${name || "there"},

Your customer account has been created successfully. You can now log in using the email address and password you registered with.

Use your registered email address and password to access your customer account.

Thank you for joining Market Link. We are pleased to have you as part of our marketplace community.

MarketLink — Fresh food, straight from local farms.
This is an informational account confirmation email. MarketLink will never ask for your password.
    `;

    return { subject, html, text };
};

export default buildCustomerWelcomeEmail;

const LOGO_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40" style="vertical-align: middle;">
      <rect width="64" height="64" rx="16" fill="#1e3f27"/>
      <path d="M32 46c-8-4-13-10-13-18 0-6 3-10 8-12-1 8 2 14 5 17V13c6 1 10 6 10 13 0 8-4 14-10 18v2z" fill="#97cd9e"/>
      <path d="M21 39c-3-1-5-3-6-6 4 0 8 1 10 3-2 1-4 2-4 3z" fill="#67b173"/>
    </svg>
`;

const buildFarmerApprovedEmail = ({ name }) => {
    const subject = "Your Market Link Farmer Account Has Been Approved";

    const html = `
        <div style="background-color: #f0f4f0; padding: 24px 12px;">
          <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e8e0; border-radius: 16px; overflow: hidden; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #23303b;">
            <div style="background-color: #1e3f27; padding: 24px 32px; text-align: center;">
              ${LOGO_SVG}
              <span style="display: inline-block; vertical-align: middle; margin-left: 10px; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Market<span style="color: #97cd9e;">Link</span></span>
            </div>
            <div style="padding: 32px;">
              <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #1e3f27;">Account Approved Successfully</h1>
              <p style="margin: 0 0 20px; font-size: 14px; color: #4a5a63;">
                Hello ${name || "there"},
              </p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #4a5a63;">
                Good news! Your Market Link farmer account has been approved by the administrator.
              </p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #4a5a63;">
                You can now log in to your Market Link account using the email address and password you registered with. Your account is now active and ready to use.
              </p>
              <div style="margin: 20px 0 0; font-size: 13px; color: #1e3f27; background-color: #f0f8f1; border: 1px solid #cfe6d2; border-radius: 8px; padding: 12px 14px;">
                Your Market Link farmer account is now active.
              </div>
              <p style="margin: 16px 0 0; font-size: 14px; color: #4a5a63;">
                Thank you for joining Market Link.
              </p>
            </div>
            <div style="background-color: #f0f4f0; padding: 18px 32px; text-align: center; border-top: 1px solid #e0e8e0;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #33503b;"><strong>MarketLink</strong> — Fresh food, straight from local farms.</p>
              <p style="margin: 0; font-size: 12px; color: #7a8a93;">
                This is an informational email about your MarketLink account. MarketLink will never ask for your password.
              </p>
            </div>
          </div>
        </div>
    `;

    const text = `
MarketLink — Account Approved Successfully

Hello ${name || "there"},

Good news! Your Market Link farmer account has been approved by the administrator.

You can now log in to your Market Link account using the email address and password you registered with. Your account is now active and ready to use.

Thank you for joining Market Link.

MarketLink — Fresh food, straight from local farms.
    `;

    return { subject, html, text };
};

export default buildFarmerApprovedEmail;
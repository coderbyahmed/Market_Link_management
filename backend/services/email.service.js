import nodemailer from "nodemailer";
import buildCustomerWelcomeEmail from "../templates/emails/customerWelcome.template.js";
import buildFarmerApprovedEmail from "../templates/emails/farmerApproved.template.js";

let transporter;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });
    }
    return transporter;
};

const LOGO_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40" style="vertical-align: middle;">
      <rect width="64" height="64" rx="16" fill="#1e3f27"/>
      <path d="M32 46c-8-4-13-10-13-18 0-6 3-10 8-12-1 8 2 14 5 17V13c6 1 10 6 10 13 0 8-4 14-10 18v2z" fill="#97cd9e"/>
      <path d="M21 39c-3-1-5-3-6-6 4 0 8 1 10 3-2 1-4 2-4 3z" fill="#67b173"/>
    </svg>
`;

const sendOtpEmail = async ({ to, name, otp, expiryMinutes }) => {
    const expiryDate = new Date(Date.now() + expiryMinutes * 60 * 1000);
    const expiryTime = expiryDate.toLocaleString();

    const html = `
        <div style="background-color: #f0f4f0; padding: 24px 12px;">
          <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e8e0; border-radius: 16px; overflow: hidden; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #23303b;">
            <div style="background-color: #1e3f27; padding: 24px 32px; text-align: center;">
              ${LOGO_SVG}
              <span style="display: inline-block; vertical-align: middle; margin-left: 10px; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Market<span style="color: #97cd9e;">Link</span></span>
            </div>
            <div style="padding: 32px;">
              <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #1e3f27;">Password Reset Verification</h1>
              <p style="margin: 0 0 4px; font-size: 14px; color: #4a5a63;">Hi ${name || "there"},</p>
              <p style="margin: 0 0 20px; font-size: 14px; color: #4a5a63;">
                We received a request to reset the password for your MarketLink account. Use the verification code below to continue.
              </p>
              <p style="margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #7a8a93;">Your verification code is:</p>
              <p style="margin: 0 0 20px; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #1e3f27; background-color: #f0f4f0; border: 1px dashed #97cd9e; border-radius: 10px; padding: 14px 10px; text-align: center;">${otp}</p>
              <p style="margin: 0 0 8px; font-size: 14px; color: #4a5a63;">
                This OTP is valid for <strong>${expiryMinutes} minutes</strong> and will expire at <strong>${expiryTime}</strong>.
              </p>
              <p style="margin: 0; font-size: 14px; color: #b01e1e; background-color: #fdf0f0; border: 1px solid #f2cccc; border-radius: 8px; padding: 12px 14px;">
                If you did not request this password reset, please ignore this email and make sure no one else has access to your account.
              </p>
            </div>
            <div style="background-color: #f0f4f0; padding: 18px 32px; text-align: center; border-top: 1px solid #e0e8e0;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #33503b;"><strong>MarketLink</strong> — Fresh food, straight from local farms.</p>
              <p style="margin: 0; font-size: 12px; color: #7a8a93;">
                This email was sent for password recovery purposes only. MarketLink will never ask for your password.
              </p>
            </div>
          </div>
        </div>
    `;

    const text = `
MarketLink - Password Reset Verification

Hi ${name || "there"},

We received a request to reset the password for your MarketLink account.

Your verification code is: ${otp}

This OTP is valid for ${expiryMinutes} minutes and will expire at ${expiryTime}.

If you did not request this password reset, please ignore this email and make sure no one else has access to your account.

MarketLink — Fresh food, straight from local farms.
This email was sent for password recovery purposes only. MarketLink will never ask for your password.
    `;

    return getTransporter().sendMail({
        from: `"MarketLink" <${process.env.EMAIL_USER}>`,
        to,
        subject: "MarketLink - Password Reset OTP",
        html,
        text,
    });
};

const sendCustomerWelcomeEmail = async ({ to, name }) => {
    const { subject, html, text } = buildCustomerWelcomeEmail({ name });

    return getTransporter().sendMail({
        from: `"MarketLink" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text,
    });
};

const sendFarmerApprovalEmail = async ({ to, name }) => {
    const { subject, html, text } = buildFarmerApprovedEmail({ name });

    return getTransporter().sendMail({
        from: `"MarketLink" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text,
    });
};

export {
    getTransporter,
    sendOtpEmail,
    sendCustomerWelcomeEmail,
    sendFarmerApprovalEmail,
};
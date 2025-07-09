import nodemailer from "nodemailer";

// Create a reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.NEXT_PUBLIC_SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.NEXT_PUBLIC_SMTP_EMAIL,
            pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
        },
    });
};

// Function for sending OTP to clear account data
export async function sendClearDataOtpEmail({ to, otp }: { to: string; otp: string }) {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"TraderTrackr" <${process.env.NEXT_PUBLIC_SMTP_EMAIL}>`,
        to,
        subject: "OTP for Account Data Clearing",
        html: `
      <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
        <tr>
            <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <tr>
                <td align="center" style="padding-bottom: 30px;">
                    <h1 style="font-size: 28px; margin: 0; color: #333;">OTP for <span style="color: #185e61;">Data Clearance</span> 🔐</h1>
                </td>
                </tr>
                <tr>
                <td style="font-size: 16px; color: #555; padding-bottom: 20px;">
                      You requested to <strong>clear all data</strong> from your TraderTrackr account.
                    <br><br>
                    Please use the following One-Time Password (OTP) to confirm your action:
                </td>
                </tr>
                <tr>
                <td align="center" style="padding: 20px 0;">
                    <div style="font-size: 32px; font-weight: bold; color: #185e61; letter-spacing: 8px;">
                    ${otp}
                    </div>
                </td>
                </tr>
                <tr>
                <td style="font-size: 14px; color: #777;">
                    This OTP is valid for 5 minutes. Do not share it with anyone.
                    <br><br>
                    If you didn’t make this request, you can safely ignore this email.
                    <br><br>
                    — The TraderTrackr Team
                </td>
                </tr>
                <tr>
                <td align="center" style="font-size: 12px; color: #aaa; padding-top: 40px;">
                    © 2025 TraderTrackr, All rights reserved.
                </td>
                </tr>
            </table>
            </td>
        </tr>
        </table>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
}

// Function for sending OTP to delete account permanently
export async function sendDeleteAccountOtpEmail({ to, otp }: { to: string; otp: string }) {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"TraderTrackr" <${process.env.NEXT_PUBLIC_SMTP_EMAIL}>`,
        to,
        subject: "OTP for Account Deletion",
        html: `
      <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <tr>
          <td align="center" style="padding-bottom: 30px;">
            <h1 style="font-size: 28px; margin: 0; color: #333;">OTP for <span style="color: #185e61;">Account Deletion</span> ⚠️</h1>
          </td>
        </tr>
        <tr>
          <td style="font-size: 16px; color: #555; padding-bottom: 20px;">
            You're about to <strong>permanently delete your TraderTrackr account</strong>.
            <br><br>
            To confirm this action, use the OTP below:
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #185e61; letter-spacing: 8px;">
              ${otp}
            </div>
          </td>
        </tr>
        <tr>
          <td style="font-size: 14px; color: #777;">
            This OTP will expire in 5 minutes.
            <br><br>
            If you didn’t request this, please ignore the email and your account will remain safe.
            <br><br>
            — The TraderTrackr Team
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size: 12px; color: #aaa; padding-top: 40px;">
            © 2025 TraderTrackr, All rights reserved.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

    `,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
}

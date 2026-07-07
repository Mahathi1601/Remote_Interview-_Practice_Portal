const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
    // Read SMTP settings
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Check if credentials are set in .env
    if (!user || !pass) {
        console.log(`\n----------------------------------------`);
        console.log(`📧 Verification OTP for ${email}: ${otp}`);
        console.log(`🔑 Enter this code on the login page to access the account.`);
        console.log(`----------------------------------------\n`);
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // true for 465, false for other ports
            auth: {
                user,
                pass
            }
        });

        const mailOptions = {
            from: `"Interview Practice Portal" <${user}>`,
            to: email,
            subject: 'Verification Code - Forgot Password',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #23465B; border-bottom: 2px solid #23465B; padding-bottom: 10px; margin-top: 0;">Verification Code</h2>
                    <p style="font-size: 16px;">Hello,</p>
                    <p style="font-size: 16px;">We received a request to access your account via a verification code. Use the OTP code below to sign in directly:</p>
                    <div style="font-size: 28px; font-weight: bold; text-align: center; margin: 30px 0; color: #23465B; letter-spacing: 4px; background-color: #f3f4f6; padding: 15px; border-radius: 6px;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #6b7280;">This code is valid for 10 minutes. If you did not request this code, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 0;">© 2026 Remote Interview Practice Portal</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Real OTP email sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending real email via SMTP:', error.message);
        console.log(`\n----------------------------------------`);
        console.log(`📧 Verification OTP for ${email}: ${otp}`);
        console.log(`🔑 Enter this code on the login page to access the account.`);
        console.log(`----------------------------------------\n`);
        return false;
    }
};

module.exports = { sendOTPEmail };

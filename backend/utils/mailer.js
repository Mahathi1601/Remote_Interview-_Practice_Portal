const nodemailer = require('nodemailer');
const dns = require('dns');

// Force Node.js to prefer IPv4 over IPv6 when resolving SMTP hosts.
// Cloud networks (like Render) often do not support IPv6 outbound connections,
// causing ENETUNREACH errors if Node tries connecting via IPv6 by default.
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const sendOTPEmail = async (email, otp) => {
    const htmlContent = `
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
    `;

    // 🌟 Resend HTTP API Mode (Highly recommended for Render Free tier - bypasses SMTP blocks)
    if (process.env.RESEND_API_KEY) {
        try {
            console.log('Sending OTP email via Resend HTTP API...');
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Interview Portal <onboarding@resend.dev>', // Resend sandbox domain
                    to: email,
                    subject: 'Verification Code - Forgot Password',
                    html: htmlContent
                })
            });

            const data = await response.json();
            if (response.ok && data.id) {
                console.log(`✅ Real OTP email sent successfully via Resend API to ${email}`);
                return { success: true };
            } else {
                console.error('❌ Resend API error response:', data);
                throw new Error(data.message || 'Resend API error');
            }
        } catch (error) {
            console.error('❌ Error sending real email via Resend API:', error.message);
            return { success: false, error: `Resend API failed: ${error.message}` };
        }
    }

    // --- Fallback to SMTP Mode (Works locally or on paid Render servers) ---
    let host = process.env.SMTP_HOST || 'smtp.gmail.com';
    if (host === 'smtp.gmail.com') {
        host = '74.125.140.108'; // Direct IPv4 bypass to avoid DNS IPv6 bugs on cloud networks
    }
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Check if credentials are set in .env
    if (!user || !pass) {
        console.log(`\n----------------------------------------`);
        console.log(`📧 Verification OTP for ${email}: ${otp}`);
        console.log(`🔑 Enter this code on the login page to access the account.`);
        console.log(`----------------------------------------\n`);
        return { success: false, error: 'SMTP credentials missing' };
    }

    try {
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // true for 465, false for other ports
            auth: {
                user,
                pass
            },
            lookup: (hostname, options, callback) => {
                const cb = typeof options === 'function' ? options : callback;
                dns.lookup(hostname, { family: 4 }, cb); // Force IPv4 resolution
            },
            tls: {
                rejectUnauthorized: false // Bypasses SSL validation errors
            },
            connectionTimeout: 5000, // 5 seconds connection timeout
            greetingTimeout: 5000,   // 5 seconds greeting timeout
            socketTimeout: 10000     // 10 seconds socket timeout
        });

        const mailOptions = {
            from: `"Interview Practice Portal" <${user}>`,
            to: email,
            subject: 'Verification Code - Forgot Password',
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Real OTP email sent successfully to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending real email via SMTP:', error.message);
        console.log(`\n----------------------------------------`);
        console.log(`📧 Verification OTP for ${email}: ${otp}`);
        console.log(`🔑 Enter this code on the login page to access the account.`);
        console.log(`----------------------------------------\n`);
        return { success: false, error: error.message };
    }
};

module.exports = { sendOTPEmail };

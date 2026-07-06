const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { sendOTPEmail } = require('../utils/mailer');

const run = async () => {
    console.log('Using SMTP_USER:', process.env.SMTP_USER);
    console.log('Using SMTP_PASS:', process.env.SMTP_PASS ? 'Defined (Hidden)' : 'Undefined');
    
    console.log('Sending test OTP...');
    const result = await sendOTPEmail('maira210507@gmail.com', '123456');
    console.log('Send result:', result);
    process.exit(0);
};

run();

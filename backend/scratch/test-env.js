const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

console.log('process.cwd():', process.cwd());
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Exists' : 'Undefined');
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS);

dotenv.config({ path: path.join(__dirname, '.env') });
console.log('After specifying path:');
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS);

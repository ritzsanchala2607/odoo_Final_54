const nodemailer = require('nodemailer');

// Validate required environment variables
const requiredEnvVars = ['SMTP_USER', 'SMTP_PASS', 'SMTP_MAIL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required SMTP environment variables:', missingVars.join(', '));
  console.error('Please set the following environment variables:');
  missingVars.forEach(varName => {
    console.error(`  - ${varName}`);
  });
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail({ to, subject, html, text }) {
  try {
    // Verify SMTP connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    
    const result = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("Message ID:", result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your SMTP_USER and SMTP_PASS credentials.');
    }
    throw error;
  }
}

module.exports = { sendMail };


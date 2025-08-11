const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../helper/db.helper');

async function signup({ email, password, full_name, role, avatar_url , phone , short_bio }) {
    const existingUser = await User.findOne({
        where: { email: email.toLowerCase() }
    });

    if (existingUser) {
        // Instead of throwing, return a response object
        return "Email Already Exists";
    }

    const hash = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);

    const user = await User.create({
      full_name: full_name,
      email: email.toLowerCase(),
      password_hash: hash,
      avatar_url: avatar_url,
      otp: otp , 
      role: role,
      is_active: true,
      otp_verified: false,
      phone: phone,
      short_bio: short_bio,
    });

    //Commented out email sending logic for now to avoid reference errors
    let mailSubject = "Verification Email From Griwa Internationals";
    let content = '<p> Hello ' + full_name + ', Please verify your email address.</p>';
    await sendMail(email, mailSubject, content);

    return user;
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  return { user, token };
} 

async function verifyOtp({ email, otp }) {
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) throw new Error('User not found');
  if (user.otp !== otp) throw new Error('Invalid OTP');
  user.otp = null;
  user.otp_verified = true;
  await user.save();
  return { message: 'OTP verified successfully' };
}

module.exports = { signup, login, verifyOtp };


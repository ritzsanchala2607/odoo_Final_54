const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../helper/db.helper');
const { sendMail } = require('../helper/send_mail');

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

    let mailSubject = "Verification Email From QuickCourt";

    let content = '<p> Hello ' + full_name + ', Please verify your email address.'+'<br>Your OTP is '+otp+'</p>';
    console.log(email, mailSubject, content);
    await sendMail({
      to: email,
      subject: mailSubject,
      html: content
    });

    return user;
}

async function login({ email, password }, req, res) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error('Invalid credentials');
  
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  
  // Set JWT token as HTTP-only cookie
  if (res) {
    res.cookie('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/'
    });
  }
  
  // Set session data
  if (req && req.session) {
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userEmail = user.email;
    req.session.isAuthenticated = true;
  }
  
  return { user, message: 'Login successful' };
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

async function logout(req, res) {
  // Clear JWT token cookie
  if (res) {
    res.clearCookie('jwt_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
  }
  
  // Destroy session
  if (req && req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
  }
  return { message: 'Logged out successfully' };
}

async function checkAuth(req) {
  if (req && req.session && req.session.isAuthenticated) {
    return {
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        role: req.session.userRole,
        email: req.session.userEmail
      }
    };
  }
  return { isAuthenticated: false };
}

async function refreshToken(req, res) {
  try {
    // Check if user is authenticated via session or existing token
    let userData = null;
    
    if (req.session && req.session.isAuthenticated) {
      userData = {
        id: req.session.userId,
        role: req.session.userRole,
        email: req.session.userEmail
      };
    } else if (req.cookies.jwt_token) {
      const payload = jwt.verify(req.cookies.jwt_token, process.env.JWT_SECRET || 'dev_secret');
      userData = payload;
    }
    
    if (!userData) {
      throw new Error('No valid authentication found');
    }
    
    // Generate new token
    const newToken = jwt.sign(
      { id: userData.id, role: userData.role, email: userData.email }, 
      process.env.JWT_SECRET || 'dev_secret', 
      { expiresIn: '7d' }
    );
    
    // Set new token as cookie
    if (res) {
      res.cookie('jwt_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });
    }
    
    return { message: 'Token refreshed successfully' };
  } catch (error) {
    throw new Error('Token refresh failed');
  }
}

async function getCurrentUser(req) {
  try {
    let userData = null;
    
    // Check session first
    if (req.session && req.session.isAuthenticated) {
      userData = {
        id: req.session.userId,
        role: req.session.userRole,
        email: req.session.userEmail
      };
    } else if (req.cookies.jwt_token) {
      // Verify JWT token from cookie
      const payload = jwt.verify(req.cookies.jwt_token, process.env.JWT_SECRET || 'dev_secret');
      userData = payload;
    }
    
    if (!userData) {
      throw new Error('No valid authentication found');
    }
    
    // Get full user data from database
    const user = await User.findByPk(userData.id, {
      attributes: { exclude: ['password_hash', 'otp'] }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw new Error('Failed to get current user');
  }
}

module.exports = { signup, login, verifyOtp, logout, checkAuth, refreshToken, getCurrentUser };


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Select from '../components/Select';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
    short_bio: '',
    avatar: null
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  // const [generatedOtp, setGeneratedOtp] = useState(''); // Store generated OTP for verification

  const roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Owner', value: 'owner' },
    { label: 'Admin', value: 'admin' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select an image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, avatar: 'Image size should be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, avatar: file }));
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    if (!formData.avatar) {
      newErrors.avatar = 'Please upload an avatar';
    }

    return newErrors;
  };

  // const generateOTP = () => {
  //   // Generate a 6-digit OTP
  //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
  //   setGeneratedOtp(otp);
  //   return otp;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    console.log(formData);

    if (Object.keys(newErrors).length === 0) {
      let avatarUrl = '';
      try {
        // 1. Upload avatar image if present
        if (formData.avatar) {
          const formDataObj = new FormData();
          formDataObj.append('avatar', formData.avatar);
          const uploadRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/upload-avatar`, formDataObj, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          });
          avatarUrl = uploadRes.data.avatar_url;
        }
      } catch (err) {
        setErrors({ general: 'Avatar upload failed. Please try again.' });
        console.log(err);
        return;
      }
      try {
        // 2. Register user with avatar_url
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          short_bio: formData.short_bio,
          avatar_url: avatarUrl,
        });
        // 3. Generate OTP for demo-only fallback and move to verify page
        // const otp = generateOTP();
        // console.log('Generated OTP (demo fallback):', otp);
        // Go to verify-otp page, pass email in query
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } catch (error) {
        console.error('❌ Registration failed:', error);
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleOTPVerification = (e) => {
    e.preventDefault();

    // if (!otp) {
    //   setOtpError('Please enter the OTP');
    //   return;
    // }

    // if (otp === generatedOtp) {
    //   // OTP verified successfully
    //   console.log('✅ OTP verified successfully');

    //   // Simulate successful registration
    //   setTimeout(() => {
    //     navigate('/login');
    //   }, 1000);
    // } else {
    //   setOtpError('Invalid OTP. Please try again.');
    // }
  };

  // const resendOTP = () => {
  //   const newOtp = generateOTP();
  //   console.log('New OTP generated:', newOtp);
  //   setOtpError('');
  //   setOtp('');
  // };

  const goBackToRegistration = () => {
    setCurrentStep(1);
    setOtp('');
    setOtpError('');
  };

  if (currentStep === 2) {
    return (
      <div className="register-page">
        <Header />
        <div className="register-container fade-in">
          <div className="otp-verification-form">
            <div className="otp-header">
              <h1>Verify Your Email</h1>
              <p>We've sent a verification code to {formData.email}</p>
            </div>

            {/* <div className="otp-info">
              <p className="otp-note">
                <strong>Demo Mode:</strong> Use this OTP: <span className="otp-display">{generatedOtp}</span>
              </p>
            </div> */}

            <form onSubmit={handleOTPVerification}>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpError('');
                  }}
                  maxLength={6}
                  error={!!otpError}
                />
                {otpError && <span className="error-message">{otpError}</span>}
              </div>

              <Button type="submit" fullWidth>
                Verify OTP
              </Button>
            </form>

            <div className="otp-actions">
              {/* <button type="button" className="resend-otp-btn" onClick={resendOTP}>
                Resend OTP
              </button> */}
              <button type="button" className="back-btn" onClick={goBackToRegistration}>
                Back to Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <Header />
      <div className="register-container fade-in">
        <div className="register-form">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join the VenueBook community</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="avatar-section">
              <label htmlFor="avatar" className="avatar-label">
                <div className="avatar-upload">
                  {formData.avatar ? (
                    <img
                      src={URL.createObjectURL(formData.avatar)}
                      alt="Avatar preview"
                      className="avatar-preview"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <span>📷</span>
                      <p>Upload Avatar</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
              {errors.avatar && <span className="error-message">{errors.avatar}</span>}
            </div>

            <div className="form-group">
              <Input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleInputChange}
                error={!!errors.full_name}
              />
              {errors.full_name && <span className="error-message">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <Select
                name="role"
                placeholder="Select your role"
                options={roleOptions}
                value={formData.role}
                onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                error={!!errors.role}
              />
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>

            <div className="form-group">
              <Input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <Input
                type="text"
                name="short_bio"
                placeholder="Short Bio (optional)"
                value={formData.short_bio}
                onChange={handleInputChange}
                error={!!errors.short_bio}
              />
              {errors.short_bio && <span className="error-message">{errors.short_bio}</span>}
            </div>

            <div className="form-group">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            {errors.general && <span className="error-message general-error">{errors.general}</span>}

            <Button type="submit" fullWidth>
              Create Account
            </Button>
          </form>

          <div className="register-footer">
            <p>Already have an account? <Link to="/login" className="login-link">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

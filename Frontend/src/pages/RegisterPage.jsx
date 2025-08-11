import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Avatar from '../components/Avatar';
import Select from '../components/Select';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    avatar: null
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(''); // Store generated OTP for verification

  const roleOptions = [
    'Student',
    'Professional',
    'Freelancer',
    'Entrepreneur',
    'Teacher',
    'Other'
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

    if (!formData.username.trim()) {
      newErrors.username = 'Full name is required';
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

    if (!formData.avatar) {
      newErrors.avatar = 'Please upload an avatar';
    }

    return newErrors;
  };

  const generateOTP = () => {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    return otp;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    console.log(formData);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Attempt to hit backend signup to trigger OTP email (best-effort)
        try {
          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, {
            full_name: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }, { withCredentials: true });
        } catch (err) {
          console.warn('Backend signup failed or unavailable. Proceeding to OTP step anyway.', err?.message);
        }

        // Generate OTP for demo-only fallback and move to verify page
        const otp = generateOTP();
        console.log('Generated OTP (demo fallback):', otp);

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

    if (!otp) {
      setOtpError('Please enter the OTP');
      return;
    }

    if (otp === generatedOtp) {
      // OTP verified successfully
      console.log('✅ OTP verified successfully');

      // Simulate successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  const resendOTP = () => {
    const newOtp = generateOTP();
    console.log('New OTP generated:', newOtp);
    setOtpError('');
    setOtp('');
  };

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

            <div className="otp-info">
              <p className="otp-note">
                <strong>Demo Mode:</strong> Use this OTP: <span className="otp-display">{generatedOtp}</span>
              </p>
            </div>

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
              <button type="button" className="resend-otp-btn" onClick={resendOTP}>
                Resend OTP
              </button>
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
            <p>Join the Skill Swap community</p>
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
                name="username"
                placeholder="Full Name"
                value={formData.username}
                onChange={handleInputChange}
                error={!!errors.username}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
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

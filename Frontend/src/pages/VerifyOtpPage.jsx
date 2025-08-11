import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import axios from 'axios';
import './VerifyOtpPage.css';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const [email, setEmail] = useState(query.get('email') || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If email not present in query, stay but show editable email field
    if (!email) {
      setInfo('Enter your email and the 6-digit OTP you received.');
    } else {
      setInfo(`We sent a 6-digit code to ${email}.`);
    }
  }, [email]);

  const handleResend = async () => {
    setError('');
    setInfo('');
    if (!email) {
      setError('Please enter your email first.');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/resend-otp`, { email });
      setInfo(`A new OTP has been sent to ${email}.`);
    } catch (err) {
      console.error(err);
      setInfo('Could not reach server. If this is a demo, you may proceed using Get Started.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!otp || otp.length !== 6) {
      setError('Enter the 6-digit OTP.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/verify-otp`, { email, otp });
      navigate('/home');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      } else {
        setInfo('Could not verify due to network/server issue. If this is a demo, you can use Get Started to continue.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="verify-otp-page">
      <Header />
      <div className="verify-container fade-in">
        <div className="verify-card">
          <h1>Email Verification</h1>
          <p className="subtitle">Secure your account with a one-time password</p>

          {info && <div className="info-banner">{info}</div>}
          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleVerify} className="verify-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="otp">6-digit OTP</label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </Button>
          </form>

          <div className="verify-actions">
            <button type="button" className="link-button" onClick={handleResend}>
              Resend OTP
            </button>
          </div>

          <div className="helper-text">
            You can always click "Get Started" in the header to continue to Home.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

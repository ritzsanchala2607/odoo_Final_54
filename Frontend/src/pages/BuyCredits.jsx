import React, { useState } from 'react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BuyCredits = () => {
  const [amount, setAmount] = useState(500);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const startTopup = async () => {
    setMessage('');
    if (amount <= 0) {
      setMessage('Enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage('Razorpay SDK failed to load');
        setLoading(false);
        return;
      }

      const orderRes = await fetch('/api/payments/credits/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'QuickCourt Credits',
        description: `Top-up ₹${amount}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/payments/credits/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message || 'Verification failed');
            setMessage('Credits added successfully!');
          } catch (e) {
            setMessage(e.message);
          }
        },
        prefill: {},
        theme: { color: '#4B0082' },
        modal: { ondismiss: () => setMessage('Payment cancelled') }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '20px auto', padding: 16 }}>
      <h2>Buy Credits</h2>
      <label>Amount (₹)</label>
      <input
        type="number"
        min={1}
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value || '0', 10))}
        style={{ display: 'block', width: '100%', marginBottom: 12 }}
      />
      <button onClick={startTopup} disabled={loading} className="book-btn">
        {loading ? 'Processing...' : 'Pay with Razorpay'}
      </button>
      {message && (
        <p style={{ marginTop: 12, color: message.includes('success') ? 'green' : 'crimson' }}>{message}</p>
      )}
    </div>
  );
};

export default BuyCredits;

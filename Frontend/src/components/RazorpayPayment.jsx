import React from 'react';

const RazorpayPayment = ({ bookingDetails, onPaymentSuccess, onPaymentFailure }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    // Create order on backend using your API
    try {
            const orderResponse = await fetch('http://localhost:3000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: bookingDetails.totalPrice * 100, // Amount in paise
          currency: 'INR',
          bookingId: bookingDetails.bookingId,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const options = {
        key: orderData.key, // Use the key from backend response
        amount: orderData.amount, // Amount from backend
        currency: orderData.currency,
        name: 'Venue Booking',
        description: `Booking for ${bookingDetails.venue?.name || 'Venue'}`,
        order_id: orderData.orderId,
        handler: function (response) {
          // Payment successful
          const paymentData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            bookingDetails: bookingDetails,
          };
          
          // Verify payment on backend
          verifyPayment(paymentData);
        },
        prefill: {
          name: bookingDetails.customerDetails.customerName,
          email: bookingDetails.customerDetails.customerEmail,
          contact: bookingDetails.customerDetails.customerPhone,
        },
        notes: {
          booking_id: bookingDetails.bookingId,
          venue_name: bookingDetails.venue?.name,
          date: bookingDetails.date,
          time_slot: bookingDetails.timeSlot?.time,
          sport: bookingDetails.sport?.name,
          members: bookingDetails.memberCount,
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: function() {
            onPaymentFailure('Payment cancelled by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
            const response = await fetch('http://localhost:3000/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        onPaymentSuccess({
          ...paymentData,
          bookingConfirmed: true,
          paymentStatus: 'completed',
          bookingData: result.booking,
          paymentData: result.payment,
        });
      } else {
        onPaymentFailure(result.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      onPaymentFailure('Payment verification failed');
    }
  };

  // Auto-initiate payment when component mounts
  React.useEffect(() => {
    if (bookingDetails) {
      initiatePayment();
    }
  }, [bookingDetails]);

  return (
    <div className="payment-processing">
      <div className="payment-loader">
        <div className="spinner"></div>
        <p>Redirecting to payment gateway...</p>
      </div>
      
      <style jsx>{`
        .payment-processing {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }
        
        .payment-loader {
          text-align: center;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .payment-loader p {
          color: #6b7280;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default RazorpayPayment;

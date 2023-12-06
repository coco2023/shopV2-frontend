import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { completePayPalPayment } from './CheckoutUtils';

// Component for handling the redirect back from PayPal
const PaymentSuccessComponent = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
  
    useEffect(() => {
      const paymentId = searchParams.get('paymentId');
      const payerId = searchParams.get('PayerID');
  
      if (paymentId && payerId) {
        completePayPalPayment(paymentId, payerId);
        navigate("/order-confirmation"); // Navigate to order confirmation page
      }
    }, [searchParams, navigate]);

    
  
    return (
        <div>
          Processing PayPal payment...
        </div>
      );    
}

export default PaymentSuccessComponent;

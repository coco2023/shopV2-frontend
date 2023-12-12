import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PayPalPaymentStatus = ({ token }) => {
    const [paymentStatus, setPaymentStatus] = useState('checking');

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/check-payment-status?token=${token}`);
                const status = response.data.status;

                // Handle payment statuses
                if (status === 'created') {
                    setPaymentStatus('created');
                } else if (status === 'created') {
                    setPaymentStatus('created');
                } else if (status === 'cancelled') {
                    setPaymentStatus('cancelled');
                } else {
                    setPaymentStatus('unknown');
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                setPaymentStatus('error');
            }
        };

        // Poll for payment status every 3 seconds
        const interval = setInterval(checkPaymentStatus, 3000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, [token]);

    return (
        <div>
            {paymentStatus === 'created' && <p>Payment created successfully!</p>}
            {paymentStatus === 'completed' && <p>Payment was successful!</p>}
            {paymentStatus === 'cancelled' && <p>Payment was cancelled by the user.</p>}
            {paymentStatus === 'unknown' && <p>Unknown payment status.</p>}
            {paymentStatus === 'error' && <p>Error checking payment status.</p>}
            {paymentStatus === 'checking' && <p>Checking payment status...</p>}
        </div>
    );
};

export default PayPalPaymentStatus;

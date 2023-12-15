import { useEffect, useState } from 'react';

const useBeforeUnload = () => {
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!notificationSent) {
        // Send a notification to the server when the user is leaving the page
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/payments/notify-exit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ exitReason: 'User closed the page during order placement' }),
        });

        // Set a flag to indicate that the notification has been sent
        setNotificationSent(true);
      }

      // Show a confirmation message to the user (browser default)
      e.preventDefault();
      e.returnValue = '';
    };

    // Attach the event listener when the component using this hook mounts
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [notificationSent]);

  return null; // This component doesn't render anything
};

export default useBeforeUnload;

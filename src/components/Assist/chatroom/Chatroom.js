import React, { useState, useEffect } from 'react';
import { IntercomProvider, useIntercom } from 'react-use-intercom';
import IntercomChat from './Chatroom copy';

const INTERCOM_APP_ID = 'dG9rOjU5Y2JlYTg3X2U4NTNfNDczMF85ZWJlXzVmMzAyNWQwMmJmOToxOjA=';
function Chatroom() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const { boot, shutdown } = useIntercom(); // Using Intercom hook

  useEffect(() => {
    // Boot Intercom when the component mounts
    boot({
      appId: INTERCOM_APP_ID,
      // You can include additional options here, like user's name, email, etc.
    });

    // Shutdown Intercom when the component unmounts
    return () => {
      shutdown();
    };
  }, []);

  const handleSendMessage = async () => {
    const newMessage = { id: messages.length + 1, text: userInput, sender: 'user' };
    setMessages([...messages, newMessage]);

    // Simulate API call
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    });

    const responseData = await response.json();
    const botMessage = { id: messages.length + 2, text: responseData.message, sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setUserInput(''); // Clear input field
  };

  return (
    <div className="chatroom">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

// Wrap your Chatroom component with the IntercomProvider at a higher level (e.g., App component) if not already
function ChatroomWithIntercom() {

  const currentUser = {
    name: "John Doe",
    id: "uuid-for-john",
    email: "john@example.com",
    createdAt: Math.floor(Date.now() / 1000), // Example timestamp
  };

  return (
    <IntercomProvider appId={INTERCOM_APP_ID}>
      <Chatroom user={currentUser} />
    </IntercomProvider>
  );
}

export default ChatroomWithIntercom;

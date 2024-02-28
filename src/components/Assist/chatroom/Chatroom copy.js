import React, { useState } from 'react';
import IntercomChat from '../intercom/IntercomChat';
import { IntercomProvider, useIntercom } from 'react-use-intercom';

function Chatroom() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = async () => {
    const newMessage = { id: messages.length + 1, text: userInput, sender: 'user' };
    setMessages([...messages, newMessage]);

    // Call your backend API here
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInput),
    });

    const responseData = await response.json();
    const botMessage = { id: messages.length + 2, text: responseData, sender: 'bot' };
    setMessages([...messages, newMessage, botMessage]);
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

      <IntercomChat appId="dG9rOjU5Y2JlYTg3X2U4NTNfNDczMF85ZWJlXzVmMzAyNWQwMmJmOToxOjA=" />
    </div>
  );
}

export default Chatroom;

import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const InventoryComponent = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = new SockJS(`${REACT_APP_API_URL}/ws`);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, function () {
            stompClient.subscribe('/topic/inventoryReduction', function (message) {
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    return (
        <div>
            <h2>Inventory Reductions</h2>
            {messages.map((msg, index) => (
                <div key={index}>
                    <p>SkuCode: {msg.skuCode}</p>
                    <p>Quantity: {msg.quantity}</p>
                </div>
            ))}
        </div>
    );
};

export default InventoryComponent;

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatApp = ({username}) => {
  const [socket, setSocket] = useState(null);
  // const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');

  useEffect(() => {
    const socketIo = io('http://localhost:5000');
    
    socketIo.on('connect', () => {
      console.log('Connected to server');
      setSocket(socketIo);
    });

    socketIo.emit('register', username);

    socketIo.on('friendList', (friends) => {
      setFriendList(friends);
    });

    socketIo.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketIo.on('messageHistory', (messages) => {
      setMessages(messages);
    });

    return () => {
      socketIo.disconnect();
    };
  }, [username]);

  // const handleRegister = () => {
  //   // if (socket && username) {
  //   //   socket.emit('register', username);
  //   // }
  // };

  const handleSendMessage = () => {
    if (socket && username && selectedFriend && message) {
      socket.emit('sendMessage', { from: username, to: selectedFriend, message });
      setMessage('');
    }
  };

  const handleAddFriend = (friendUsername) => {
    if (socket && username && friendUsername) {
      socket.emit('addFriend', { username, friend: friendUsername });
    }
  };

  const handleSelectFriend = (friendUsername) => {
    setSelectedFriend(friendUsername);
    setMessages([]);
    socket.emit('getMessageHistory', { user1: username, user2: friendUsername });
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        {/* <input
          type="text"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="button" onClick={handleRegister}>Register</button> */}
        <h2>Friends</h2>
        {friendList.length > 0 ? (
          friendList.map((friend, index) => (
            <div
              key={index}
              className="friend"
              onClick={() => handleSelectFriend(friend)}
            >
              {friend}
            </div>
          ))
        ) : (
          <p>No friends added yet. Please add some friends!</p>
        )}
        <div>
          <button onClick={() => handleAddFriend(prompt('Enter friend\'s username:'))}>Add Friend</button>
        </div>
      </div>

      <div className="chat-panel">
        <div className="header">
          <h2>Chat with {selectedFriend || 'Select a friend'}</h2>
        </div>
        <div className="messages">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.from === username ? 'sent' : 'received'}`}>
                <strong>{msg.from}: </strong>{msg.message}
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>

        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;

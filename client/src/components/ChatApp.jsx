import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Box, IconButton, Stack, Typography, Button, Divider } from "@mui/material";
import { ArchiveBox, CircleDashed } from "phosphor-react";
import Conversation from "./Conversation";
import ChatElement from "./ChatElement";
import { ChatList } from "../data";
const ChatApp = ({ username }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState("");

  useEffect(() => {
    const socketIo = io("http://localhost:5000");

    socketIo.on("connect", () => {
      console.log("Connected to server");
      setSocket(socketIo);
    });

    socketIo.emit("register", username);

    socketIo.on("friendList", (friends) => {
      setFriendList(friends);
    });

    socketIo.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketIo.on("messageHistory", (messages) => {
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
      socket.emit("sendMessage", { from: username, to: selectedFriend, message });
      setMessage("");
    }
  };

  const handleAddFriend = (friendUsername) => {
    if (socket && username && friendUsername) {
      socket.emit("addFriend", { username, friend: friendUsername });
    }
  };

  const handleSelectFriend = (friendUsername) => {
    setSelectedFriend(friendUsername);
    setMessages([]);
    socket.emit("getMessageHistory", { user1: username, user2: friendUsername });
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: 320,
          backgroundColor: "#F8FAFF",
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      >
        <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">Chats</Typography>
            <IconButton>
              {" "}
              <CircleDashed />{" "}
            </IconButton>
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ArchiveBox size={24} />
              <Button>Archive</Button>
            </Stack>
            <Divider />
          </Stack>

          <Stack className="scrollbar" spacing={2} direction="column" sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}>
            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                Pinned
              </Typography>
              {ChatList.filter((el) => el.pinned).map((el) => {
                return <ChatElement {...el} />;
              })}
            </Stack>

            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                All Chats
              </Typography>
              {ChatList.filter((el) => !el.pinned).map((el) => {
                return <ChatElement {...el} />;
              })}
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Conversation />

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
              <div key={index} className="friend" onClick={() => handleSelectFriend(friend)}>
                {friend}
              </div>
            ))
          ) : (
            <p>No friends added yet. Please add some friends!</p>
          )}
          <div>
            <button onClick={() => handleAddFriend(prompt("Enter friend's username:"))}>Add Friend</button>
          </div>
        </div>

        <div className="chat-panel">
          <div className="header">
            <h2>Chat with {selectedFriend || "Select a friend"}</h2>
          </div>
          <div className="messages">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.from === username ? "sent" : "received"}`}>
                  <strong>{msg.from}: </strong>
                  {msg.message}
                </div>
              ))
            ) : (
              <p>No messages yet.</p>
            )}
          </div>

          <div className="message-input">
            <input type="text" placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatApp;

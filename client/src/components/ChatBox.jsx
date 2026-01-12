import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { getSocket } from "../socket";
import { AuthContext } from "../context/AuthContext";

const ChatBox = ({ chat, onDeleteChat }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user } = useContext(AuthContext);

  const sameId = (a, b) => {
    if (!a || !b) return false;
    return a.toString() === b.toString();
  };

  useEffect(() => {
    if (!chat) return;

    const fetchMessages = async () => {
      const res = await API.get(`/message/${chat._id}`);
      setMessages(res.data);
    };

    fetchMessages();
  }, [chat]);

  useEffect(() => {
    const socket = getSocket();
    const handleReceive = (data) => {
      if (!chat) return;
      // data may be populated message object
      if (data.chatId === chat._id || data.chatId === chat._id.toString()) {
        setMessages(prev => [...prev, data]);
      }
    };

    const handleDelete = ({ messageId }) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    };

    socket.on("receive_message", handleReceive);
    socket.on("delete_message", handleDelete);

    // when switching chat, join its room
    if (chat) {
      socket.emit("join_chat", chat._id);
    }

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("delete_message", handleDelete);
    };
  }, [chat]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const res = await API.post("/message", {
      chatId: chat._id,
      content: text.trim()
    });
    // rely on server to emit the created message to all clients (including sender)
    // server will emit 'receive_message' after saving the message
    setText("");
  };

  const deleteMessage = async (messageId) => {
    try {
      await API.delete(`/message/${messageId}`);
      setMessages(prev => prev.filter(m => m._id !== messageId));
    } catch (err) {
      const msg = err?.response?.data?.message || "Delete failed";
      alert(msg);
    }
  };

  if (!chat) {
    return <div className="chat-main empty">Select a chat to start messaging.</div>;
  }

  const title = chat.isGroup
    ? chat.groupName
    : chat.participants.map(u => u.username).join(", ");

  return (
    <div className="chat-main">
      <div className="chat-header">
        <div>
          <p className="chat-room-name">{title}</p>
          <small style={{ color: "var(--muted)" }}>{chat.isGroup ? "Group chat" : "Direct chat"}</small>
        </div>

        {chat.isGroup && chat.admin && sameId(chat.admin._id || chat.admin, user?._id || user?.id) && (
          <button className="secondary danger" onClick={onDeleteChat}>Delete group</button>
        )}
      </div>

      <div className="message-board">
        {messages.length === 0 && <p style={{ color: "var(--muted)" }}>No messages yet. Say hi!</p>}
        {messages.map(msg => {
          const sender = msg.senderId || {};
          const senderId = sender._id || sender.id || sender;
          const userId = user?._id || user?.id;
          const isSelf = sameId(senderId, userId);

          return (
            <div
              key={msg._id}
              className={`message-row ${isSelf ? "self" : "other"}`}
            >
              <div className={`message ${isSelf ? "message-self" : "message-other"}`}>
                <div className="message-meta">
                  <strong>{sender.username || "User"}:</strong>
                  {isSelf && (
                    <button
                      className="message-delete"
                      onClick={() => deleteMessage(msg._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div>{msg.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="message-input-row">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;

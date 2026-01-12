import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import NewChatModal from "../components/NewChatModal";
import { getSocket } from "../socket";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { disconnectSocket } from "../socket";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const { user } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchChats = async () => {
    const res = await API.get("/chat");
    setChats(res.data);
  };

  const deleteGroup = async () => {
    if (!selectedChat || !selectedChat.isGroup) return;
    const confirm = window.confirm("Delete this group and all its messages?");
    if (!confirm) return;
    try {
      await API.delete(`/chat/${selectedChat._id}`);
      setSelectedChat(null);
      fetchChats();
    } catch (err) {
      const msg = err?.response?.data?.message || "Delete failed";
      alert(msg);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    return () => {
      // keep socket connected for reuse; do not disconnect here
    };
  }, [user]);

  useEffect(() => {
    const socket = getSocket();
    const handleChatDeleted = ({ chatId }) => {
      setChats(prev => prev.filter(c => c._id !== chatId));
      setSelectedChat(prev => (prev && prev._id === chatId ? null : prev));
    };

    socket.on("chat_deleted", handleChatDeleted);
    return () => {
      socket.off("chat_deleted", handleChatDeleted);
    };
  }, []);

  return (
    <div className="chat-shell">
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <div>
            <p className="sidebar-title">Chats</p>
            <small style={{ color: "var(--muted)" }}>{user?.username}</small>
          </div>

          <div className="chat-actions">
            <button onClick={() => setShowNewChat(true)}>➕ New</button>
            <button
              className="logout-btn"
              onClick={() => {
                // clear auth and disconnect socket
                logout();
                disconnectSocket();
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <ChatList
          chats={chats}
          setSelectedChat={setSelectedChat}
          activeChatId={selectedChat?._id}
        />
      </aside>

      <ChatBox chat={selectedChat} onDeleteChat={deleteGroup} />

      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          refreshChats={fetchChats}
        />
      )}
    </div>
  );
};

export default Chat;

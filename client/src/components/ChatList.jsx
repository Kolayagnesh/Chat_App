const ChatList = ({ chats, setSelectedChat, activeChatId }) => {
  return (
    <div className="chat-list">
      <h3>All conversations</h3>

      {chats.length === 0 && <p style={{ color: "var(--muted)" }}>No chats yet.</p>}

      {chats.map(chat => {
        const label = chat.isGroup
          ? chat.groupName
          : chat.participants.map(u => u.username).join(", ");

        const isActive = activeChatId === chat._id;

        return (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            className="chat-item"
            style={isActive ? { background: "rgba(14, 165, 233, 0.12)", borderColor: "rgba(14, 165, 233, 0.3)" } : undefined}
          >
            {label}
            <small>{chat.isGroup ? "Group" : "Direct"}</small>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;

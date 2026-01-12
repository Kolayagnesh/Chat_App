import { useState } from "react";
import API from "../api/axios";

const NewChatModal = ({ onClose, refreshChats }) => {
  const [userEmail, setUserEmail] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState("");

  const createOneToOne = async () => {
    await API.post("/chat/one-to-one", { email: userEmail.trim().toLowerCase() });
    refreshChats();
    onClose();
  };

  const createGroup = async () => {
    const usersArray = groupUsers
      .split(",")
      .map(u => u.trim().toLowerCase())
      .filter(Boolean);

    await API.post("/chat/group", {
      groupName,
      users: usersArray
    });

    refreshChats();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>New chat</h3>
        <div className="modal-grid">
          <div>
            <h4>1-to-1 Chat</h4>
            <input
              placeholder="User email"
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
            />
            <button style={{ marginTop: 10 }} onClick={createOneToOne}>Start Chat</button>
          </div>

          <hr className="section-divider" />

          <div>
            <h4>Group Chat</h4>
            <input
              placeholder="Group Name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
            />
            <input
              placeholder="User emails (comma separated)"
              value={groupUsers}
              onChange={e => setGroupUsers(e.target.value)}
              style={{ marginTop: 10 }}
            />
            <button style={{ marginTop: 10 }} onClick={createGroup}>Create Group</button>
          </div>
        </div>

        <div className="form-footer" style={{ marginTop: 18 }}>
          <span />
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;

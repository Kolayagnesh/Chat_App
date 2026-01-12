const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a chat room
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    // Send message
    socket.on("send_message", (data) => {
      // data = { chatId, message }
      socket.to(data.chatId).emit("receive_message", data);
    });

    // Typing indicator
    socket.on("typing", (chatId) => {
      socket.to(chatId).emit("typing");
    });

    socket.on("stop_typing", (chatId) => {
      socket.to(chatId).emit("stop_typing");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;

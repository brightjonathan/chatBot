const express = require('express');
const app = express();
const colour = require('colors')
require('dotenv').config();
const cors = require('cors');
const socket = require("socket.io");
const connectDB = require('./config/database');
const {errorHandler} = require('./middleware/errorMiddleware')
const registerUser = require('./router/registerUser')
const messageUser = require('./router/MessageUser')

//database connection
connectDB();


//internal middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())


//for all our router
app.use('/api/auth', registerUser)
app.use('/api/message', messageUser)

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  global.onlineUsers = new Map();
 io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});



//for our error handler
app.use(errorHandler)




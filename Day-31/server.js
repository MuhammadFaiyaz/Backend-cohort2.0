import app from "./src/app.js";

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
socket.on("message", (msg)=>{
    console.log("user fired message event")
    console.log(msg)
    io.emit("abc")
})
});

httpServer.listen(3000, (req,res)=>{
    console.log("server is running on port 3000")
});


import { io } from "socket.io-client";

export function initializeSocketConnection() {
    const socket = io("http://localhost:3000", {
        withCredentials: true
    });

    socket.on("connect", () => {
        console.log("io.socket is connected");
    });

}
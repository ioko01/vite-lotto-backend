import { Socket } from "socket.io";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../utils/socket-io";
import { io } from "../api";


export const userHandler = (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {

    const createUser = () => {
        io.emit("get_user")
    }

    socket.on("create_user", createUser)
}
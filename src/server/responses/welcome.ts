import { StatusInterface } from '../interfaces/core/status'
import ws from "ws"

export function sendWelcomeMSG(socket: ws) {
  const statusResp: StatusInterface = {
    name: "status",
    data: {
      status: "connected"
    }
  }

  socket.send(JSON.stringify(statusResp))
}

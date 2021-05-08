import ws from "ws"

export function sendPing(socket: ws) {
  const response = {
    name: "ping",
    data: null
  }

  socket.send(JSON.stringify(response))
}
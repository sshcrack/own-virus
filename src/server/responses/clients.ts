import ws from "ws"
import { ClientsInterface, WSEvent } from '../interfaces/core/base';

export function getClients(socket: ws, clients: ClientsInterface) {
  const response: WSEvent = {
    name: "clients",
    data: Object.keys(clients)
  }

  socket.send(JSON.stringify(response));
}
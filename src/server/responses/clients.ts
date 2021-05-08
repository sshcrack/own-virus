import ws from "ws"
import { GetClients } from '../client-config';
import { ClientsInterface, WSEvent } from '../interfaces/core/base';
import { SingleClient } from '../interfaces/user_managing/clients';

export function getClients(socket: ws, clientsObj: ClientsInterface) {
  const clients = Object.keys(clientsObj);
  const allClients: SingleClient[] = GetClients().map(e => {
    return {
      id: e,
      connected: clients.includes(e),
    }
  })

  const response: WSEvent = {
    name: "clients",
    data: allClients
  }

  socket.send(JSON.stringify(response));
}
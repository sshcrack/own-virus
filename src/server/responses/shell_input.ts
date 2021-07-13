import { ClientsInterface } from '../interfaces/core/base';
import { ShellDataCore, ShellDataInterface } from '../interfaces/remote/shell';
import ws from "ws"

export function handleShellInput(verified: boolean, data: ShellDataCore, clients: ClientsInterface, master: ws, id: string) {
  if (!master) return;
  if (verified && data.direction === "to_client") {
    const clientID = data.client;
    const client = clients[clientID];
    if (!client) {
      console.log("Client not found");
      return;
    }

    const resp: ShellDataInterface = {
      name: "shell",
      data: {
        direction: data.direction,
        text: data.text,
        pid: data.pid
      }
    }
    client.send(JSON.stringify(resp));
    return;
  }

  if (data.direction === "from_client") {
    const resp: ShellDataInterface = {
      name: "shell",
      data: {
        client: id,
        direction: "from_client",
        text: data.text,
        pid: data.pid
      }
    }

    const toSend = JSON.stringify(resp);
    master.send(toSend)
  }
}
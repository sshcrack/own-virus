import { ClientsInterface } from '../interfaces/core/base';
import { KillInterface, KillShellsData } from '../interfaces/remote/killproc';

export function handleKillShells(data: KillShellsData, clients: ClientsInterface) {
  const clientID = data.client;
  const client = clients[clientID];
  if (!client) {
    console.log("Client not found");
    return;
  }

  const killResp: KillInterface = {
    name: "killshells",
    data: {}
  }

  client.send(JSON.stringify(killResp))
}
import { ClientsInterface } from '../interfaces/core/base';
import { ExecInfo } from '../interfaces/remote/instruction';

export function handleInstruction(verified: boolean, json: ExecInfo, onlineClients: ClientsInterface) {
  if (!verified) {
    console.log("Not verified.")
    return;
  }

  const client = json.client;
  const target = onlineClients[client];
  if (!target) {
    console.log("Client not found")
    return;
  }

  target.send(JSON.stringify({
    name: "instruction",
    data: json
  }));
}

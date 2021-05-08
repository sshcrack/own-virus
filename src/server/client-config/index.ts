import fs from "fs"

export function AddClient(client: string) {
  const clients = GetClients();
  if (!clients.includes(client))
    clients.push(client)

  SaveClients(clients);
}

export function GetClients(): string[] {
  return JSON.parse(fs.readFileSync("clients.json", "utf-8"))
}

export function SaveClients(clients: string[]) {
  fs.writeFileSync("clients.json", JSON.stringify(clients))
}
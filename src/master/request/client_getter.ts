import { WSEvent } from '../../server/interfaces/core/base';
import ws from "ws"

export function getClients(conn: ws): Promise<string[]> {
  return new Promise(resolve => {
    const clientsEvent: WSEvent = {
      name: "get_clients",
      data: undefined
    }

    conn.send(JSON.stringify(clientsEvent));
    conn.on("message", (raw: string) => {
      try {
        const event: WSEvent = JSON.parse(raw)
        if (event.name === "clients") {
          resolve(event.data);
        }
      } catch (e) { }
    })
  });
}
import ws from "ws"
import { WSEvent } from '../../server/interfaces/core/base';

const { MASTER_KEY: KEY } = process.env

export function verifySocket(conn: ws): Promise<boolean> {
  return new Promise(resolve => {
    const verifyType: WSEvent = {
      name: "verify",
      data: KEY
    }

    conn.send(JSON.stringify(verifyType));

    conn.on("message", (raw: string) => {
      try {
        const res: WSEvent = JSON.parse(raw);

        if (res.name === "verified") {
          resolve(res.data);
        }
      } catch (e) { }
    })
  });
}
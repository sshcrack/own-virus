import ws from "ws"
import { WSEvent } from '../interfaces/core/base';

const { MASTER_KEY: KEY } = process.env;

export function verifyClient(socket: ws, verifyWith: string): boolean {
  let verified = false;

  const response: WSEvent = {
    name: "verified",
    data: false
  }


  if (verifyWith === KEY) {
    verified = true;
    response.data = true;
  }

  socket.send(JSON.stringify(response))
  if (!verified)
    socket.close();
  return verified;
}
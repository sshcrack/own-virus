import { WSEvent } from '../../server/interfaces/core/base';
import { SingleClient } from '../../server/interfaces/user_managing/clients';
import { Global } from '../Global/Global';
import { SocketEvent } from '../interfaces/socket';

const { MASTER_KEY } = process.env;

export function verifyMaster(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const { socket } = Global;
    const event: WSEvent = {
      name: "verify",
      data: MASTER_KEY
    }

    const onMSG = (incoming: SocketEvent) => {
      try {
        const event: WSEvent = JSON.parse(incoming.data);
        if (event.name !== "verified") return;

        socket.removeEventListener("message", onMSG)
        resolve(event.data);
      } catch (e) {
        reject(e)
      }
    }

    socket.send(JSON.stringify(event))
    socket.addEventListener("message", onMSG)

  });
}

export function listDevices(): Promise<SingleClient[]> {
  return new Promise((resolve, reject) => {
    const { socket } = Global;
    const event: WSEvent = {
      name: "get_clients"
    }

    const onMSG = (incoming: SocketEvent) => {
      try {
        const event: WSEvent = JSON.parse(incoming.data);
        if (event.name !== "clients") return;

        socket.removeEventListener("message", onMSG)
        resolve(event.data);
      } catch (e) {
        reject(e)
      }
    }

    socket.send(JSON.stringify(event))
    socket.addEventListener("message", onMSG)
  });
}
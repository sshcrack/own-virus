import express from "express";
import ws from "ws";
import { ClientsInterface, WSEvent } from './interfaces/core/base';
import { StatusInterface } from './interfaces/core/status';
import { ExecInfo } from './interfaces/remote/instruction';
import { ShellDataInterface } from './interfaces/remote/shell';
import { getClients } from './responses/clients';
import { sendPing } from './responses/ping';
import { verifyClient } from './responses/verify';

const app = express();
const port = 3000;

let registeredClients: ClientsInterface = {};
let master: ws;

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  let verified = false;
  let id;
  sendWelcomeMSG(socket);


  socket.on('message', async message => {

    try {
      const event: WSEvent = JSON.parse(message.toString())

      switch (event.name) {
        case "ping":
          sendPing(socket);
          break;
        case "get_clients":
          if (!verified)
            break;

          getClients(socket, registeredClients);
          break;

        case "verify":
          verified = verifyClient(socket, event.data);
          if (verified) {
            master = socket;
            console.log("Master connected.")
            master.on("close", () => {
              console.log("Master disconnected.")
              master = undefined;
            })
          }

          break;

        case "id":
          if (!id) {
            registeredClients[event.data.id] = socket;
            id = event.data.id
          } else
            socket.close();
          break;

        case "instruction":
          handleInstruction(verified, event.data);
          break;

        case "terminated":
          if (verified)
            break;

          const resp: WSEvent = {
            name: "terminated",
            data: {
              client: id
            }
          }

          master.send(JSON.stringify(resp))
          break;

        case "shell":
          const data = event.data;
          if (verified && data.direction === "to_client") {
            const clientID = data.client;
            const client = registeredClients[clientID];
            if (!client) {
              console.log("Client not found");
              break;
            }

            const resp: ShellDataInterface = {
              name: "shell",
              data: {
                direction: data.direction,
                text: data.text
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
                text: data.text
              }
            }

            const toSend = JSON.stringify(resp);
            master.send(toSend)
          }

          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e)
    }
  });

  socket.on("close", () => {
    console.log("Deleting id", id, "...")
    delete registeredClients[id]
  })
});

function handleInstruction(verified: boolean, json: ExecInfo) {
  if (!verified) {
    console.log("Not verified.")
    return;
  }

  const client = json.client;
  const target = registeredClients[client];
  if (!target) {
    console.log("Client not found")
    return;
  }

  target.send(JSON.stringify({
    name: "instruction",
    data: json
  }));
}



function sendWelcomeMSG(socket: ws) {
  const statusResp: StatusInterface = {
    name: "status",
    data: {
      status: "connected"
    }
  }

  socket.send(JSON.stringify(statusResp))
}

const server = app.listen(port, () => {
  console.log("Listening on port", port)
});
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
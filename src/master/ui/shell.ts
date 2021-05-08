import ws from "ws"
import { WSEvent } from '../../server/interfaces/core/base';
import { InstructionInterface } from '../../server/interfaces/remote/instruction'
import readline from "readline"
import { ShellDataInterface } from '../../server/interfaces/remote/shell';

export function runShell(socket: ws, client: string) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin
    });

    const response: InstructionInterface = {
      name: "instruction",
      data: {
        exec_type: "shell",
        client: client
      }
    }

    socket.send(JSON.stringify(response));

    rl.on("line", line => {
      const response: ShellDataInterface = {
        name: "shell",
        data: {
          client: client,
          direction: "to_client",
          text: line
        }
      }

      socket.send(JSON.stringify(response))
    })

    socket.on("message", raw => {
      try {
        const event: WSEvent = JSON.parse(raw.toString());
        if (event.name === "shell") {
          const data = event.data;
          if (data.direction !== 'from_client') return;
          if (data.client !== client) return;

          console.log(data.text);
        }

        if (event.name === "terminated") {
          if (event.data.client !== client) return;
          console.log("Terminated.")

          rl.close();
          socket.removeAllListeners("message");
          resolve();
          return;
        }
      } catch (e) {
        console.error(e);
      }
    });
  });
}
import chalk from 'chalk'
import onChange from 'on-change'
import ws from "ws"
import { WSEvent } from '../../server/interfaces/core/base'
import { ShellDataInterface } from '../../server/interfaces/remote/shell'
import { Global } from '../Global/Global'
import { ClientWithIndex, User } from '../Global/User'
import { UserInput } from '../Global/UserInput'
import { ForegroundCommand } from "../interfaces/basic-command"
import { Notifier } from '../Notifier/Notifier'
import { Updater } from '../Notifier/Updater'
import { center, debug } from '../tools/tools'

const maxLines = 50;

export default class ShellCommand implements ForegroundCommand {
  name = "shell"
  help = "Open cmd on a remote client"

  onMSG: (event: WSEvent) => void;

  constructor() {
    const { socket } = Global;

    socket.addListener("message", (data) => {
      const str = data.toString();
      try {
        const json = JSON.parse(str);

        if (this.onMSG)
          this.onMSG(json);
      } catch (e) {
        debug("Error parsing", str);
      }
    })
  }

  updater: Updater<string[]>
  socket: ws
  client: ClientWithIndex;
  observer: Updater<string[]>
  currPid: number;

  cmdHistory: string[] = this.genHistory();

  public genHistory() {
    return onChange([], (_path, _value, _previous, _apply) => {
      this.observer.update(this.cmdHistory)
    })
  }

  public execute(_args: string[]) {
    return new Notifier<string[]>(observer => {
      const { socket } = Global;
      const { currentClient } = User;

      if (!currentClient) {
        observer.finish([center(chalk`{red You have to be logged in to do this.}`)])
        return;
      }

      this.observer = observer;
      this.cmdHistory = this.genHistory();;

      this.socket = socket;
      this.client = currentClient;

      observer.update([center("Sending start request...")])
      this.updater = observer;

      const startReq: WSEvent = {
        name: "instruction",
        data: {
          exec_type: "shell",
          client: this.client.id
        }
      }

      socket.send(JSON.stringify(startReq));

      observer.update([center("Waiting for shell to start...")])
      this.onMSG = event => {
        switch (event.name) {
          case "shellstarted":
            const startedData = event.data;
            this.currPid = startedData.pid;
            this.cmdHistory.push(`Shell started with pid ${startedData.pid}`)
            this.cmdHistory.push(``);

            UserInput.prefix = chalk`{gray $${User.currentClient.index}} ({green active}) ${Global.standardPrefix}`
            break;

          case "shell":
            const data = event.data;
            if (data.direction !== "from_client")
              break;
            if (data.pid !== this.currPid) break;

            const lastIndex = this.cmdHistory.length - 1;
            this.cmdHistory[lastIndex] += data.text;

            let newLines = this.cmdHistory[lastIndex].split("\n");
            if (newLines.length > maxLines) {
              newLines = newLines.slice(newLines.length - maxLines, newLines.length - 1);
            }

            this.cmdHistory[lastIndex] = newLines.join("\n");
            break;

          case "terminated":
            const terminatedData = event.data;
            if (terminatedData.pid !== this.currPid) break;

            UserInput.prefix = chalk`{gray $${User.currentClient.index}} ${Global.standardPrefix}`
            this.observer.finish(this.cmdHistory.concat([center(chalk`Process terminated.`)]))
            break;
        }
      };
    });
  }

  public tab_complete(_str) { }

  public on_input(input: string) {
    const resp: ShellDataInterface = {
      name: "shell",
      data: {
        direction: "to_client",
        pid: this.currPid,
        text: input,
        client: User.currentClient.id
      }
    }

    Global.socket.send(JSON.stringify(resp));
  }
}
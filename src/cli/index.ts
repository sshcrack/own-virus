console.log("Importing modules...")
import blessed from "blessed";
import chalk from 'chalk';
import fs from "fs";
import ws from "ws";
import { getCommandElements as addCMDLine } from './cmd/cmd-line';
import { Global } from './Global/Global';
import { UserInput } from './Global/UserInput';
import { verifyMaster } from './socket-master';
import { loadCommands } from './tools/command-loader';
import { getNav as addNav } from './top/nav';

const { URL } = process.env;

UserInput.prefix = Global.standardPrefix;

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

console.log("Connecting...")
loading.setContent(chalk`Establishing connection...\nHost: {yellow ${URL}}`)
loadingScreen.append(loading)
loadingScreen.render();

Global.socket = new ws(URL, {
  rejectUnauthorized: false
});
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

  await loadCommands();
  onLoaded();
})

Global.socket.on("close", () => {
  sendError("Websocket has been closed")
  process.exit(0);
})

/**
 * This function is called, when the websocket is connected and verified
 */
function onLoaded() {
  const screen = blessed.screen({
    smartCSR: true,
    focusable: false,
  })

  Global.screen = screen;

  /**
   * A list of widgets that should be added
   */
  const addFuncs = [
    () => addNav(),
    () => addCMDLine()
  ]

  addFuncs.forEach(func => func())
  screen.render();
}
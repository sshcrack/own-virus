import blessed from "blessed";
import chalk from 'chalk';
import fs from "fs";
import ws from "ws";
import { getCommandElements as addCMDLine } from './cmd/cmd-line';
import { Global } from './Global/Global';
import { UserInput } from './Global/UserInput';
import { verifyMaster } from './socket-master';
import { debug } from './tools';
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

  /**
   * Runs on every screen rerender
   */
  screen.on("render", () => {
    const { historyElement: history, } = Global;

    /**
     * Updates the history
     */
    const newHistory = Global.history.map(e => {
      if (e.command)
        return e.prefix + chalk.green(e.text)

      return e.text;
    }).join("\n");

    if (history.getContent() !== newHistory)
      history.setContent(newHistory)
  })

  UserInput.inputEvent.subscribe(input => {
    const prefix = UserInput.prefix;
    const { cmdLine } = Global;

    /**
   * Updates command line values to show the right input
   */
    const newLine = prefix + input

    debug(newLine);
    cmdLine.setValue(newLine)
    screen.render();
  })

  screen.render();
}
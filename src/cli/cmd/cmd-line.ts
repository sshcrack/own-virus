
import blessed from "blessed";
import { Global } from '../Global/Global';
import { processTabComplete } from '../processor/tabcomplete';
import { addQuit, resetHelpCMDs } from '../tools';
import { checkArrowKeys } from './arrowFunc';
import { OnCommandSubmit } from './command-submit';
import { keepPrefix } from './prefix';
import { stylizeTerminal } from './terminal-color';

/**
 * Gets all elements within the console
 * @returns The command lien form
 */
export function getCommandElements() {
  const screen = Global.screen;
  const prefix = Global.prefix;

  const form = blessed.form({
    keys: true,
    parent: screen,
    bg: "red",
    height: "shrink",
    align: 'center',
    width: "100%",
    top: "99%",
  })

  const cmdLine = blessed.textbox({
    parent: form,
    inputOnFocus: true,
    tags: true,
    name: "command",
    style: {
      fg: "yellow"
    },
    value: prefix
  })

  Global.cmdLine = cmdLine;

  Global.historyElement = blessed.log({
    parent: screen,
    content: "",
    bottom: 1,
    width: "100%",
    height: screen.rows - 2,
    tags: true,
    scrollable: true,
    alwaysScroll: true,
  })

  process.stdin.addListener("data", b => {
    const res = checkArrowKeys(b);

    const str = b.toString();
    if (str !== "\t" && !res) {
      if (str.match(/./g))
        Global.userInput.input += b.toString("utf-8")
      resetHelpCMDs()
    }

    //PREVENTING OF DELETING PREFIX
    keepPrefix();


    //SETTING INPUT COLOR
    stylizeTerminal();
  })

  cmdLine.on("submit", _e => OnCommandSubmit())

  cmdLine.key("tab", () => processTabComplete())

  cmdLine.key(" ", () => resetHelpCMDs())

  cmdLine.focus();
  addQuit(cmdLine)

  return form
}
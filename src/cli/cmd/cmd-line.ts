
import blessed from "blessed";
import { Global } from '../Global/Global';
import { processTabComplete } from '../processor/tabcomplete';
import { addQuit, debug, resetHelpCMDs } from '../tools';
import { checkArrowKeys } from './arrowFunc';
import { OnCommandSubmit } from './command-submit';
import { keepPrefix } from './prefix';
import { stylizeTerminal } from './terminal-color';


const notAllowedChars = [
  "\t",
  "\n",
  "\r"
]


/**
 * Gets all elements within the console
 * @returns The command lien form
 */
export function getCommandElements() {
  const screen = Global.screen;
  const prefix = Global.userInput.prefix;

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
    let input = Global.userInput.input;
    const res = checkArrowKeys(b);
    let rerender = res;

    const str = b.toString();
    if (str !== "\t" && !res) {
      if (!notAllowedChars.some(e => str.includes(e)))
        input += str

      if (str.includes(Global.keys.back))
        input.substr(0, input.length - 1)
      resetHelpCMDs()
    }

    Global.userInput.input = input;

    //PREVENTING OF DELETING PREFIX
    rerender = rerender || keepPrefix();


    //SETTING INPUT COLOR
    rerender = rerender || stylizeTerminal();
    if (rerender)
      Global.screen.render();
  })

  cmdLine.on("submit", _e => OnCommandSubmit())

  cmdLine.key("tab", () => processTabComplete())

  cmdLine.key(" ", () => resetHelpCMDs())

  cmdLine.focus();
  addQuit(cmdLine)

  return form
}
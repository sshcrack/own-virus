
import blessed from "blessed";
import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';
import { processTabComplete } from '../processor/tabcomplete';
import { addQuit, renderCMDLine, resetHelpCMDs } from '../tools';
import { checkArrowKeys } from './arrowFunc';
import { OnCommandSubmit } from './command-submit';
import { keepPrefix } from './prefix';
import { stylizeTerminal } from './terminal-color';

const replaceControlChars = /[\u0000-\u001F\u007F-\u009F]/g

/**
 * Gets all elements within the console
 * @returns The command lien form
 */
export function getCommandElements() {
  const screen = Global.screen;
  const prefix = UserInput.prefix;

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
    const hex = b.toString("hex");
    const str = b.toString();

    if (b.toString("hex") === "0d") {
      OnCommandSubmit()
      return;
    }

    const res = checkArrowKeys(b);
    let shouldRender = res;

    let input = UserInput.input;
    if (str !== "\t" && !res)
      resetHelpCMDs()

    input += str.replace(replaceControlChars, "");

    if (hex.includes(Global.keys.wordBack)) {
      const phrases = input.split(" ");
      phrases.pop();

      input = phrases.join(" ")
    } else if (hex.includes(Global.keys.back)) {
      input = input.substr(0, input.length - 1)
    }

    UserInput.input = input;
    shouldRender = shouldRender || keepPrefix();
    shouldRender = shouldRender || stylizeTerminal();
    if (shouldRender)
      renderCMDLine();
  })

  cmdLine.key("tab", () => processTabComplete())

  cmdLine.key(" ", () => resetHelpCMDs())

  cmdLine.focus();
  addQuit(cmdLine)

  return form
}
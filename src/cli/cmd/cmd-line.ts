
import blessed from "blessed";
import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';
import { RLKey } from '../interfaces/readline';
import { processTabComplete } from '../processor/tabcomplete';
import { isAbort, isAlphanumericKey, isBackspace, isReturn, isSpecial, isTab, isWordDelete } from '../tools/key-checks';
import { renderCMDLine, resetHelpCMDs } from '../tools/tools';
import { checkArrowKeys } from './arrowFunc';
import { OnCommandSubmit } from './command-submit';
import { keepPrefix } from './prefix';
import { stylizeTerminal } from './terminal-color';

/**
 * Gets all elements within the console
 * @returns The command lien form
 */
export function getCommandElements() {
  const form = setForm();

  setCMDLine(form);
  setHistory();

  process.stdin.on("keypress", (_raw: string, key: RLKey) => {
    let { input } = UserInput;

    if (isTab(key))
      return processTabComplete()

    if (isAbort(key))
      process.exit(0)

    if (isReturn(key)) {
      if (!Global.currCommand) {
        OnCommandSubmit()
        return;
      }

      Global.currCommand.on_input(UserInput.input);
      return;
    }

    checkArrowKeys(key);
    if (isAlphanumericKey(key))
      input += key.sequence

    if (!isTab(key) && isSpecial(key))
      resetHelpCMDs()


    /**
     * Checking if control and back is pressed
     */
    if (isWordDelete(key)) {
      const phrases = input.split(" ");
      phrases.pop();

      input = phrases.join(" ")
    }

    if (isBackspace(key))
      input = input.substr(0, input.length - 1)


    UserInput.input = input;
    if (stylizeTerminal() || keepPrefix())
      renderCMDLine();
  })

  return form
}

function setHistory() {
  const { screen } = Global;
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
}

function setCMDLine(form: blessed.Widgets.FormElement<unknown>) {
  const prefix = UserInput.prefix;

  Global.cmdLine = blessed.textbox({
    parent: form,
    inputOnFocus: true,
    tags: true,
    name: "command",
    style: {
      fg: "yellow"
    },
    value: prefix
  })

  Global.cmdLine.focus();
}

function setForm() {
  const { screen } = Global;

  return blessed.form({
    keys: true,
    parent: screen,
    bg: "red",
    height: "shrink",
    align: 'center',
    width: "100%",
    top: "99%",
  })
}
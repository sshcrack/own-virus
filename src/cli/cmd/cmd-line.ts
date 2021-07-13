
import blessed from "blessed";
import chalk from 'chalk';
import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';
import { RLKey } from '../interfaces/readline';
import { processTabComplete } from '../processor/tabcomplete';
import { isAbort, isAlphanumericKey, isBackspace, isReturn, isSpecial, isTab, isWordDelete } from '../tools/key-checks';
import { renderCMDLine, resetHelpCMDs } from '../tools/tools';
import { checkArrowKeys } from './arrowFunc';
import { OnCommandSubmit, resetCommandLine } from './command-submit';
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

  process.stdin.on("keypress", (raw: string, key: RLKey) => {
    let { input } = UserInput;

    if (!key || !key?.name) {
      let i = UserInput.input;
      i += raw

      UserInput.input = i;
      return;
    }
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
      resetCommandLine();
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

  Global.historyEvent.subscribe(info => {
    const { historyElement: history, } = Global;

    /**
     * Updates the history
     */
    const newHistory = info.map(e => {
      if (e.command)
        return e.prefix + chalk.green(e.text)

      return e.text;
    }).join("\n");

    history.setContent(newHistory)
    screen.render();
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

  UserInput.inputEvent.subscribe(input => {
    const prefix = UserInput.prefix;
    const { cmdLine, screen } = Global;

    /**
   * Updates command line values to show the right input
   */
    const newLine = prefix + input

    cmdLine.setValue(newLine)
    screen.render();
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
import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';
import { RLKey } from '../interfaces/readline';

/**
 * Checks if any arrow keys are pressed
 * If arrow up is pressed, shows previous command
 * If arrow down is pressed, shows next command
 * @param input The key that should be analyzed
 */
export function checkArrowKeys(input: RLKey) {
  const { history } = Global;
  const filteredHistory = history.filter(e => e.command);

  if (filteredHistory.length === 0)
    return;


  switch (input.name) {
    case "up":
      Global.arrowOffset++;
      break;

    case "down":
      Global.arrowOffset--;
      if (Global.arrowOffset < 0)
        Global.arrowOffset = -1;
      break;

    default:
      Global.arrowOffset = -1;
      return;
  }


  let arrowOffset = Global.arrowOffset;

  if (arrowOffset === -1) {
    UserInput.input = ""
    return
  }

  if (arrowOffset > filteredHistory.length - 1) {
    Global.arrowOffset = filteredHistory.length - 1;
    arrowOffset = Global.arrowOffset;
  }

  const historyIndex = filteredHistory.length - 1 - arrowOffset;

  UserInput.input = filteredHistory[historyIndex].text
}
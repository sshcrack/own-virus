import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';

/**
 * Checks if any arrow keys are pressed
 * If arrow up is pressed, shows previous command
 * If arrow down is pressed, shows next command
 * @param input The key that should be analyzed
 */
export function checkArrowKeys(input: Buffer): boolean {
  const hex = input.toString("hex")
  const { history } = Global;
  const filteredHistory = history.filter(e => e.command);

  const cond = hex === Global.keys.up || hex === Global.keys.down;

  if (filteredHistory.length === 0)
    return false;


  switch (hex) {
    case Global.keys.up:
      Global.arrowOffset++;
      break;

    case Global.keys.down:
      Global.arrowOffset--;
      if (Global.arrowOffset < 0)
        Global.arrowOffset = -1;
      break;

    default:
      break;
  }


  if (cond) {
    let arrowOffset = Global.arrowOffset;

    if (arrowOffset === -1) {
      UserInput.input = ""
      return true;
    }

    if (arrowOffset > filteredHistory.length - 1) {
      Global.arrowOffset = filteredHistory.length - 1;
      arrowOffset = Global.arrowOffset;
    }

    const historyIndex = filteredHistory.length - 1 - arrowOffset;

    UserInput.input = filteredHistory[historyIndex].text
    return true;
  }

  Global.arrowOffset = -1;
  return false;
}
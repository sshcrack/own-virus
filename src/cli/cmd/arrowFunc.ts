import { Global } from '../Global/Global';
import { debug } from '../tools';

/**
 * Checks if any arrow keys are pressed
 * If arrow up is pressed, shows previous command
 * If arrow down is pressed, shows next command
 * @param input The key that should be analyzed
 */
export function checkArrowKeys(input: Buffer): boolean {
  const hex = input.toString("hex")
  const { history, screen } = Global;
  const filteredHistory = history.filter(e => e.command);

  const cond = hex === Global.keys.up || hex === Global.keys.down;

  if (filteredHistory.length === 0)
    return false;


  switch (hex) {
    case Global.keys.up:
      Global.helpOffset++;
      break;

    case Global.keys.down:
      debug("Before subtract", Global.helpOffset)
      Global.helpOffset--;
      if (Global.helpOffset < 0)
        Global.helpOffset = -1;
      break;

    default:
      break;
  }


  if (cond) {
    let helpOffset = Global.helpOffset;

    if (helpOffset === -1) {
      Global.userInput.input = ""
      screen.render();
      return true;
    }

    if (helpOffset > filteredHistory.length - 1) {
      Global.helpOffset = filteredHistory.length - 1;
      helpOffset = Global.helpOffset;
    }

    const historyIndex = filteredHistory.length - 1 - helpOffset;

    Global.userInput.input = filteredHistory[historyIndex].text
    screen.render();
    return true;
  }

  Global.helpOffset = -1;
  return false;
}
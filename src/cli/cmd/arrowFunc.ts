import { Global } from '../Global/Global';
import { debug } from '../tools';

export function checkArrowFunc(input: Buffer): boolean {
  const hex = input.toString("hex")
  const { prefix, history, cmdLine, screen } = Global;
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
      cmdLine.setValue(prefix);
      screen.render();
      return true;
    }

    if (helpOffset > filteredHistory.length - 1) {
      Global.helpOffset = filteredHistory.length - 1;
      helpOffset = Global.helpOffset;
    }

    const historyIndex = filteredHistory.length - 1 - helpOffset;

    cmdLine.setValue(prefix + filteredHistory[historyIndex].text);

    screen.render();
    return true;
  }

  Global.helpOffset = -1;
  return false;
}
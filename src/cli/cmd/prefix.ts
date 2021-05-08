import { Global } from '../Global/Global';

export function keepPrefix() {
  const prefix = Global.prefix;
  const cmdLine = Global.cmdLine;
  const screen = Global.screen;
  const value = cmdLine.getValue();

  if (value.length < prefix.length) {
    cmdLine.setValue(prefix);
    screen.render();
  }
}
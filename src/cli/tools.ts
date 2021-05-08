import blessed from "blessed";
import fs from "fs";
import { Subscriber } from 'rxjs';
import { Global } from './Global/Global';

export function appendAll(toAppend: blessed.Widgets.Node[], append: (node: blessed.Widgets.Node) => void) {
  toAppend.forEach((e => append(e)));
}

export function joinArray<T, S>(arr: T[], func: (curr: S, el: T, i: number) => S, initial = undefined): S {
  let res: S = initial;
  arr.forEach((e, i) => {
    res = func(res, e, i);
  })

  return res
}

export function debug(str: string, ...args: any[]) {
  fs.appendFileSync("debug.txt", str + " " + args.map(e => e.toString()).join(" ") + "\n");
}

export function addQuit(node: blessed.Widgets.NodeWithEvents) {
  node.key(['escape', 'q', 'C-c'], () => {
    const { prefix, cmdLine, screen } = Global;
    const val = cmdLine.getValue();
    if (val.length === prefix.length) {
      process.exit(0);
    }
    else {
      cmdLine.setValue(prefix);
      screen.render();
    }
  });
}

export function concatArrays<T>(arrays: T[][]): T[] {
  return [].concat(...arrays);
}

export function center(str: string) {
  return `{center}${str}{/center}`
}

export function getCMDLine() {
  const value = Global.cmdLine.getValue();
  const prefix = Global.prefix;

  return value.substring(prefix.length);
}

export function resetHelpCMDs() {
  Global.tabOffset = 0;
  Global.helpOffset = -1;
  Global.beforeTabComplete = undefined;
}

export function finishObservable<T>(msg: T, observer: Subscriber<T>) {
  observer.next(msg)
  observer.complete();
}
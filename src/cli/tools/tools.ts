import fs from "fs";
import { Subscriber } from 'rxjs';
import { Global } from '../Global/Global';

/**
 * Joins an array to a single variable and returns it
 * @param arr The array the function that the function should go through
 * @param func The function that is run for joining the array
 * @param initial The initial value for the result
 */
export function joinArray<T, S>(arr: T[], func: (curr: S, el: T, i: number) => S, initial = undefined): S {
  let res: S = initial;
  arr.forEach((e, i) => {
    res = func(res, e, i);
  })

  return res
}

/**
 * Gets string input and appends it to debug.txt
 * @param str What should be debugged
 * @param args More information
 */
export function debug(str: any, ...args: any[]) {
  fs.appendFileSync("debug.txt", str?.toString() + " " + args.map(e => e?.toString()).join(" ") + "\n");
}


/**
 * Concats arrays to one single array
 * @param arrays The arrays that should be concated
 */
export function concatArrays<T>(arrays: T[][]): T[] {
  return [].concat(...arrays);
}

/**
 * Centers the given string
 * @param str The string that should be centered
 */
export function center(str: string) {
  return `{center}${str}{/center}`
}

/**
 * Aligns the string to the right
 * @param str The string that should be oriented to the right
 */
export function right(str: string) {
  return `{right}${str}{/right}`
}

/**
 * Aligns the string to the left
 * @param str The string that should be aligned left
 */
export function left(str: string) {
  return `{left}${str}{/left}`
}
/**
 * Middles the string
 * @param left Left string that should be aligned
 * @param right Right string that should be aligned
 */
export function middle(left: string, right: string) {
  return `${left}{|}${right}`
}

/**
 * Resets the tab completion and help Offset
 */
export function resetHelpCMDs() {
  Global.tabOffset = 0;
  Global.arrowOffset = -1;
  Global.beforeTabComplete = undefined;
}

/**
 * Completes a observable with the given message
 * @param msg The message the observable should be finished with
 * @param observer The observer that should be completeed
 */
export function finishObservable<T>(msg: T, observer: Subscriber<T>) {
  observer.next(msg)
  observer.complete();
}

/**
 * Render cmd Line
 */
export function renderCMDLine() {
  Global.screen.render();
}
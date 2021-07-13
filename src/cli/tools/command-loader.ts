import { glob } from 'glob';
import path, { sep } from "path";
import { Global } from '../Global/Global';
import { debug, getDirToUse, getExtensionToUse } from './tools';

export function loadCommands(): Promise<void> {
  return new Promise(async resolve => {
    const cmdFiles = glob.sync(replaceToNative(`./${getDirToUse()}/cli/commands/**/*${getExtensionToUse()}`))

    const allCmds = await Promise.all(cmdFiles.map(e => {
      const importPath = path.resolve(replaceToNative(e))
      return import(importPath)
    }));

    allCmds.forEach(e => {
      const dClass = e.default
      if (!dClass) {
        debug("Couldn't find default class")
        return;
      }

      const constructed = new dClass();
      const names = Object.keys(constructed);
      const neededKeys = ["name", "help"]

      let hasKeys = true;
      neededKeys.forEach(e => {
        if (!names.includes(e))
          hasKeys = false;
      })

      if (!hasKeys) {
        debug("Needed keys not found")
        return;
      }

      Global.commands.push(constructed)
    })

    debug("Loaded", Global.commands.length, "commands")
    resolve();
  });
}

export function replaceToNative(p: string) {
  return p.split("/").join(sep).split("\\").join(sep)
}
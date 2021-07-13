import { Command, ForegroundCommand } from '../interfaces/basic-command';
import { Global } from '../Global/Global';
import { Notifier } from '../Notifier/Notifier';

/**
 * Runs commands and gives their result trough an observable
 * @param fullCmd The command that should be run
 * @returns The command output through an observable
 */
export function processCommand(fullCmd: string) {
  return new Notifier<string>(observer => {
    const args = fullCmd.split(" ")
    const command = args.shift();
    const commands = Global.commands;

    const found: Command = commands.find(e => e.name.toLowerCase() === command.toLowerCase());

    const res = found?.execute(args);
    if (!res) {
      observer.finish(Global.notFoundMSG())
      return;
    }

    if (res instanceof Notifier) {
      const isForeground = typeof found["on_input"] === "function"
      if (isForeground)
        Global.currCommand = found as ForegroundCommand;

      res.subscribe(data => {
        observer.update(data.join("\n"));
      })

      res.listenFinish(() => {
        if (isForeground)
          Global.currCommand = undefined;

        observer.finish();
      })
      return;
    }

    observer.finish(res?.join("\n"))
    return
  });



}

export function validateCommand(str: string): boolean {
  const args = str.split(" ")
  const command = args.shift();
  const commands = Global.commands;

  return commands.some(e => e.name.toLowerCase() === command.toLowerCase());
}


import { Observable } from 'rxjs';
import { Command } from '../commands/basic-command';
import { Global } from '../Global/Global';
import { finishObservable } from '../tools';

export function processCommand(str: string) {
  return new Observable<string>(observer => {
    const args = str.split(" ")
    const command = args.shift();
    const commands = Global.commands;

    const found: Command = commands.find(e => e.name.toLowerCase() === command.toLowerCase());
    const res = found?.execute(args);

    if (res instanceof Observable) {
      res.subscribe(data => {
        observer.next(data.join("\n"));
      })

      res.toPromise().then(_e => {
        observer.complete();
      })
      return;
    }

    finishObservable(res.join("\n"), observer);
    return
  });



}

export function validateCommand(str: string): boolean {
  const args = str.split(" ")
  const command = args.shift();
  const commands = Global.commands;

  return commands.some(e => e.name.toLowerCase() === command.toLowerCase());
}


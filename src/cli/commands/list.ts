import chalk from 'chalk';
import { Observable } from 'rxjs';
import { Global } from '../Global/Global';
import { listDevices } from '../socket-master';
import { center, finishObservable, middle } from '../tools/tools';
import { BackgroundCommand } from './basic-command';

export class ListCommand implements BackgroundCommand {
  name = "list"
  help = "Get a list of all devices connected"
  public execute(_args: string[]) {
    return new Observable<string[]>(observer => {
      const run = async () => {
        const title = center(chalk`{cyan Known devices}`)

        const deviceProm = listDevices();
        deviceProm.then(devices => {
          Global.fetchedClients = devices;
          finishObservable([
            title,
            ...devices.map(e => {
              return middle(`    ${e.id}`, `${e.connected ? chalk.green("Online") : chalk.red("Offline")}    `)
            })
          ], observer)
        })

        observer.next([
          title,
          center(chalk`{yellow Getting active devices...}`)
        ])
      }

      run();
    });
  }

  public tab_complete(_str) {
    return ["one", "two", "three"]
  }
}
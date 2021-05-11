import chalk from 'chalk';
import { Global } from '../Global/Global';
import { Notifier } from '../Notifier/Notifier';
import { listDevices } from '../socket-master';
import { center, middle } from '../tools/tools';
import { BackgroundCommand } from './basic-command';

export class ListCommand implements BackgroundCommand {
  name = "list"
  help = "Get a list of all devices connected"
  public execute(_args: string[]) {
    return new Notifier<string[]>(observer => {
      const run = async () => {
        const title = center(chalk`{cyan Known devices}`)

        const deviceProm = listDevices();
        deviceProm.then(devices => {
          Global.fetchedClients = devices;
          observer.finish([
            title,
            ...devices.map(e => {
              return middle(`    ${e.id}`, `${e.connected ? chalk.green("Online") : chalk.red("Offline")}    `)
            })
          ])
        })

        observer.update([
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
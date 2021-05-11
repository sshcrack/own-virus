import chalk from 'chalk';
import { SingleClient } from '../../server/interfaces/user_managing/clients';
import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';
import { Notifier } from '../Notifier/Notifier';
import { listDevices } from '../socket-master';
import { center } from '../tools/tools';
import { BackgroundCommand } from "./basic-command";

export class LoginCommand implements BackgroundCommand {
  name = "login"
  help = "Log into a device connected to this network"
  public execute(args: string[]) {
    return new Notifier<string[]>(observer => {
      const run = async () => {
        const deviceID = args.shift();
        if (!deviceID) {
          observer.finish([
            center(chalk`{yellow Invalid arguments.}`),
            center(chalk`{red Make sure you provide a device id}`)
          ])
          return
        }

        observer.update([center(chalk`{yellow Getting devices...}`)])
        const found = await this.findDevice(deviceID);

        if (!found) {
          observer.finish([
            center(chalk`{yellow Device could not be found.}`)
          ])
          return;
        }

        if (!found.connected) {
          observer.finish([
            center(chalk`{red Device is not connected}`)
          ])
          return;
        }

        UserInput.prefix = chalk`{gray ${found.id}} ${Global.standardPrefix}`
        observer.finish([center(`green{Logged in.}`)]);
      }

      run();
    });
  }

  /**
   * Finds a device which is connected to this network
   * @param id The device id
   * @retuns The device
   */
  private findDevice(id: string): Promise<SingleClient> {
    return new Promise(resolve => {
      listDevices().then(devices => {
        resolve(devices.find(e => e.id === id));
      });
    });
  }

  public tab_complete(_str) {
    return Global.fetchedClients.map(e => e.id) ?? []
  }
}
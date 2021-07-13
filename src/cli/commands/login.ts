import chalk from 'chalk';
import { SingleClient } from '../../server/interfaces/user_managing/clients';
import { Global } from '../Global/Global';
import { User } from '../Global/User';
import { UserInput } from '../Global/UserInput';
import { BackgroundCommand } from "../interfaces/basic-command";
import { Notifier } from '../Notifier/Notifier';
import { listDevices } from '../socket-master';
import { center } from '../tools/tools';

export default class LoginCommand implements BackgroundCommand {
  name = "login"
  help = "Log into a device connected to this network"
  public execute(args: string[]) {
    return new Notifier<string[]>(observer => {
      const run = async () => {
        const deviceIndex = args.shift();
        if (!deviceIndex) {
          observer.finish([
            center(chalk`{yellow Invalid arguments.}`),
            center(chalk`{red Make sure you provide a device id}`)
          ])
          return
        }

        observer.update([center(chalk`{yellow Getting devices...}`)])
        const found = await this.findDeviceIndex(deviceIndex);

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

        User.currentClient = {
          index: parseInt(deviceIndex),
          ...found
        }
        UserInput.prefix = chalk`{gray $${deviceIndex}} ${Global.standardPrefix}`
        observer.finish([center(chalk`{green Logged in.}`)]);
      }

      run();
    });
  }

  /**
 * Finds a device by index which is connected to this network
 * @param id The device id
 * @retuns The device
 */
  private findDeviceIndex(index: string): Promise<SingleClient> {
    return new Promise(resolve => {
      listDevices().then(devices => {
        resolve(devices.find((_e, i) => i.toString() === index));
      });
    });
  }

  public tab_complete(_str) {
    return Global.fetchedClients.map((e, i) => { return { connected: e.connected, index: i } }).filter(e => e.connected).map(e => e.index.toString()) ?? []
  }
}
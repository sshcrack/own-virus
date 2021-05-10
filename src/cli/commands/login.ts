import chalk from 'chalk';
import { Observable } from 'rxjs';
import { SingleClient } from '../../server/interfaces/user_managing/clients';
import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';
import { listDevices } from '../socket-master';
import { center, finishObservable } from '../tools';
import { Command } from "./basic-command";

export class LoginCommand implements Command {
  name = "login"
  help = "Log into a device connected to this network"
  public execute(args: string[]) {
    return new Observable<string[]>(observer => {
      const run = async () => {
        const deviceID = args.shift();
        if (!deviceID) {
          finishObservable([
            center(chalk`{yellow Invalid arguments.}`),
            center(chalk`{red Make sure you provide a device id}`)
          ], observer)
          return
        }

        observer.next([center(chalk`{yellow Getting devices...}`)])
        const found = await this.findDevice(deviceID);

        if (!found) {
          finishObservable([
            center(chalk`{yellow Device could not be found.}`)
          ], observer)
          return;
        }

        if (!found.connected) {
          finishObservable([
            center(chalk`{red Device is not connected}`)
          ], observer)
          return;
        }

        UserInput.prefix = chalk`{gray ${found.id}} ${Global.standardPrefix}`
        observer.next([center(`green{Logged in.}`)]);
        observer.complete();
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
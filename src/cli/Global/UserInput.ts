import { Notifier } from '../Notifier/Notifier';
import { Updater } from '../Notifier/Updater';
import { Global } from './Global';

export class UserInput {
  /**
   * This is the manager. `next` is called when a new input is received
   */
  static inputEvent = new Notifier<string>(e => {
    UserInput._subscriberInput = e
  });

  /**
   * This notifies all subscribed functions
   */
  private static _subscriberInput: Updater<string>;

  /**
   * Check if current input is already initialized
   */
  private static _initialized = false;
  /**
   * Represents the current input
   */
  private static _currInput = ""

  private static _currPrefix: string;

  /**
   * Gets the current prefix or falls back to standard prefix
   */
  static get prefix() {
    return this._currPrefix ?? Global.standardPrefix;
  }

  /**
   * Sets the current prefix
   */
  static set prefix(str: string) {
    this._currPrefix = str;
    this._subscriberInput.update(this._currInput)
  }


  /**
   * Just getting the current value
   */
  static get input() {
    return this._currInput;
  }

  /**
   * Subscribing if the to observer if not already
   */
  static set input(str: string) {
    if (!this._initialized) {
      this.inputEvent.subscribe(e => {
        this._currInput = e
      })
      this._initialized = true
    }

    this._subscriberInput.update(str)
  }
}
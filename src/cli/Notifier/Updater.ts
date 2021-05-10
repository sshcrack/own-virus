
import { Notifier } from "./Notifier"

export class Updater<T> {
  subscriber: Notifier<T>;

  constructor(subscriber: Notifier<T>) {
    this.subscriber = subscriber
  }

  /**
   * Sends a update to all subscribers
   * @param toUpdate The valueto update
   */
  public update(toUpdate: T) {
    this.subscriber._updateEverything(toUpdate);
  }
}
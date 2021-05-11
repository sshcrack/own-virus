
import { Notifier } from "./Notifier"

export class Updater<T> {
  subscriber: Notifier<T>;
  currVal: T;

  constructor(subscriber: Notifier<T>) {
    this.subscriber = subscriber
  }

  /**
   * Sends a update to all subscribers
   * @param toUpdate The valueto update
   */
  public update(toUpdate: T) {
    this.currVal = toUpdate;
    this.subscriber._updateEverything(toUpdate);
  }

  public finish(finish?: T) {
    this.subscriber._finishEverything(finish ?? this.currVal)
  }
}
import { Updater } from './Updater';

export class Notifier<T> {
  private subscribed: subscribeFunc<T>[] = []

  constructor(func: ((e: Updater<T>) => void)) {
    const update = new Updater<T>(this)

    func(update);
  }

  public subscribe(func: subscribeFunc<T>) {
    return this.subscribed.push(func) - 1;
  }

  public _updateEverything(newVal: T) {
    this.subscribed.forEach(func => {
      func(newVal);
    })
  }
}

type subscribeFunc<T> = (newVal: T) => void
import { Updater } from './Updater';

export class Notifier<T> {
  private subscribed: subscribeFunc<T>[] = []
  private onFinish: finishFunc[] = []

  private currUpdates: T[] = [];
  private alreadyFinished = false;

  constructor(func: ((e: Updater<T>) => void)) {
    const update = new Updater<T>(this)

    func(update);
  }

  public subscribe(func: subscribeFunc<T>) {
    if (this.currUpdates.length !== 0)
      this.currUpdates.forEach(e => func(e))
    return this.subscribed.push(func) - 1;
  }

  public listenFinish(func: finishFunc) {
    if (this.alreadyFinished)
      func();

    return this.onFinish.push(func);
  }

  public _updateEverything(newVal: T) {
    this.currUpdates.push(newVal);
    this.subscribed.forEach(func => {
      func(newVal);
    })
  }

  public _finishEverything(newVal: T) {
    if (this.alreadyFinished) return;

    this.alreadyFinished = true;
    this._updateEverything(newVal)
    this.onFinish.forEach(func => {
      func();
    })
  }
}

type subscribeFunc<T> = (newVal: T) => void
type finishFunc = () => void
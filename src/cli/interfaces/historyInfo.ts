export type HistoryInfo = CommandHistoryInterface | NormalHistoryInterface;

export interface CommandHistoryInterface {
  command: true,
  completed: boolean,
  text: string,
}

export interface NormalHistoryInterface {
  command: false,
  text: string
}
export type Direction = "from_client" | "to_client"

export interface ShellDataCore {
  direction: Direction,
  text: string,
  client?: string,
  pid: number
}

export interface ShellDataInterface {
  name: "shell",
  data: ShellDataCore;
}
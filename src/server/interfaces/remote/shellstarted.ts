export interface ShellStartedData {
  client?: string,
  pid: number
}

export interface ShellStarted {
  name: "shellstarted",
  data: ShellStartedData;
}
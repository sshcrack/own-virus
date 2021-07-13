export interface TerminatedSub {
  client: string,
  pid: number
}

export interface TerminatedInterface {
  name: "terminated",
  data: TerminatedSub
}
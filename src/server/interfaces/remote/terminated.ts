export interface TerminatedSub {
  client: string
}

export interface TerminatedInterface {
  name: "terminated",
  data: TerminatedSub;
}
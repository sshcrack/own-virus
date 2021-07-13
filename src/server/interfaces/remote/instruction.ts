export type ExecInfo = LoggingInterface | LaunchInterface | LaunchShellInterface
export type LogTypes = "mouse" | "keyboard"
export type LaunchTypes = "logging" | "launch" | "shell"

export interface InstructionInterface {
  name: "instruction",
  data: ExecInfo
}

export interface LoggingInterface {
  exec_type: "logging",
  client: string,
  to_log: LogTypes
}

export interface LaunchInterface {
  exec_type: "launch",
  client: string,
  path: string
}

export interface LaunchShellInterface {
  exec_type: "shell"
  client: string
}
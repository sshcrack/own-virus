export interface BasicInfo {
  type: InstructionType,
  client: string
}

export type InstructionType = "shell" | "launch" | "logging"
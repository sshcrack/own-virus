import ws from "ws"
import { InstructionInterface } from '../remote/instruction'
import { KillInterface } from '../remote/killproc'
import { ShellDataInterface } from '../remote/shell'
import { ShellStarted } from '../remote/shellstarted'
import { TerminatedInterface } from '../remote/terminated'
import { ClientsInterfaceResponse, GetClientsInterface } from '../user_managing/clients'
import { IDInterface } from '../user_managing/id'
import { PingInterface } from '../user_managing/ping'
import { VerifiedInterface, VerifyInterface } from '../user_managing/verify'
import { StatusInterface } from './status'

export type WSEvent = VerifyInterface |
  VerifiedInterface |
  GetClientsInterface |
  ClientsInterfaceResponse |
  PingInterface |
  InstructionInterface |
  IDInterface |
  StatusInterface |
  ShellDataInterface |
  TerminatedInterface |
  KillInterface |
  ShellStarted

export interface ClientsInterface {
  [key: string]: ws
}
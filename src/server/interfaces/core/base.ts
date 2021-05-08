import ws from "ws"
import { ClientsInterfaceResponse, GetClientsInterface } from '../user_managing/clients'
import { IDInterface } from '../user_managing/id'
import { InstructionInterface } from '../remote/instruction'
import { PingInterface } from '../user_managing/ping'
import { ShellDataInterface } from '../remote/shell'
import { StatusInterface } from './status'
import { VerifiedInterface, VerifyInterface } from '../user_managing/verify'
import { TerminatedInterface } from '../remote/terminated'

export type WSEvent = VerifyInterface |
  VerifiedInterface |
  GetClientsInterface |
  ClientsInterfaceResponse |
  PingInterface |
  InstructionInterface |
  IDInterface |
  StatusInterface |
  ShellDataInterface |
  TerminatedInterface

export interface ClientsInterface {
  [key: string]: ws
}
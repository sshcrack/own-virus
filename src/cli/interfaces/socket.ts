import ws from "ws"

export interface SocketEvent {
  data: any;
  type: string;
  target: ws
}
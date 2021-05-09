import ws from "ws"

/**
 * Websocket input event, just a typing extracted from the "ws" library
 */
export interface SocketEvent {
  data: any;
  type: string;
  target: ws
}
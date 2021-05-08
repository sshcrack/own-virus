export interface GetClientsInterface {
  name: "get_clients"
}

export interface ClientsInterfaceResponse {
  name: "clients",
  data: SingleClient[]
}

export interface SingleClient {
  id: string,
  connected: boolean
}
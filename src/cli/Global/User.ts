import { SingleClient } from '../../server/interfaces/user_managing/clients';

export class User {
  static currentClient: ClientWithIndex;
}

export interface ClientWithIndex extends SingleClient {
  index: number
}
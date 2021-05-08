import { Observable } from 'rxjs';

export interface Command {
  name: string,
  help: string,
  execute(args: string[]): Observable<string[]> | string[]
  tab_complete(str: string, offset: number): string | void
}
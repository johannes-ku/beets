import { Observable } from 'rxjs';

export interface PlayerServiceView {

  events$: Observable<any>;
  commandHandler: (command: any) => void;

}

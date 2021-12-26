import { Observable } from 'rxjs';
import { PlayerCommand } from './command';

export interface PlayerServiceView {

  events$: Observable<any>;
  commandHandler: (command: PlayerCommand) => void;

}

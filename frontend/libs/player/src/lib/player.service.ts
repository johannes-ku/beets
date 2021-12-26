import { Injectable } from '@angular/core';
import { PlayerServiceView } from './player-service-view';
import { Subject, Subscription } from 'rxjs';
import {
  createPlayerCommandPause,
  createPlayerCommandPlay,
  createPlayerCommandSetTrackYoutube,
  PlayerCommand
} from './command';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private view: PlayerServiceView;
  private viewEventSubscription: Subscription;
  private command$ = new Subject<PlayerCommand>();

  constructor() { }

  setYtTrack(code: string) {
    this.command$.next(createPlayerCommandSetTrackYoutube(code));
  }

  play() {
    this.command$.next(createPlayerCommandPlay());
  }

  pause() {
    this.command$.next(createPlayerCommandPause());
  }

  registerView(view: PlayerServiceView) {
    if (this.view != null) {
      throw new Error('View already registered');
    }
    this.view = view;
    this.viewEventSubscription = view.events$.subscribe((event: any) => this.handleEvent(event));
    this.command$.subscribe((command: any) => view.commandHandler(command));
  }

  unregisterView(view: PlayerServiceView) {
    if (this.view == null || this.view !== view) {
      throw new Error('View not registered');
    }
    this.view = null;
    this.viewEventSubscription.unsubscribe();
    this.viewEventSubscription = null;
    this.command$.complete();
    this.command$ = new Subject<any>();
  }

  private handleEvent(event: any) {
    // TODO
  }

}

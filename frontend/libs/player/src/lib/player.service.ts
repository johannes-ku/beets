import { Injectable } from '@angular/core';
import { PlayerServiceView } from './player-service-view';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  createPlayerCommandPause,
  createPlayerCommandPlay,
  createPlayerCommandSetTrackYoutube,
  PlayerCommand
} from './command';
import { PlayerEvent } from './event';

@Injectable({
  providedIn: 'root'
})
export class PlayerService extends Observable<PlayerEvent> {

  private view: PlayerServiceView;
  private viewEventSubscription: Subscription;
  private commands$ = new Subject<PlayerCommand>();
  private events$ = new Subject<PlayerEvent>();

  constructor() {
    super(subscriber => {
      const subscription = this.events$.subscribe(subscriber);
      return () => subscription.unsubscribe();
    });
  }
  setYtTrack(code: string) {
    this.commands$.next(createPlayerCommandSetTrackYoutube(code));
  }

  play() {
    this.commands$.next(createPlayerCommandPlay());
  }

  pause() {
    this.commands$.next(createPlayerCommandPause());
  }

  registerView(view: PlayerServiceView) {
    if (this.view != null) {
      throw new Error('View already registered');
    }
    this.view = view;
    this.viewEventSubscription = view.events$.subscribe((event: any) => this.handleEvent(event));
    this.commands$.subscribe((command: any) => view.commandHandler(command));
  }

  unregisterView(view: PlayerServiceView) {
    if (this.view == null || this.view !== view) {
      throw new Error('View not registered');
    }
    this.view = null;
    this.viewEventSubscription.unsubscribe();
    this.viewEventSubscription = null;
    this.commands$.complete();
    this.commands$ = new Subject<any>();
  }

  handleEvent(event: PlayerEvent) {
    this.events$.next(event);
  }

}

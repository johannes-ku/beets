import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import {
  createPlayerEventBuffering,
  createPlayerEventEnded,
  createPlayerEventPaused,
  createPlayerEventStarted,
  PlayerEvent
} from '../event';
import { BufferedSubject } from '../../../../../src/app/util/buffered-subject';

@Injectable({
  providedIn: 'root'
})
export class YoutubePlayerService extends Observable<PlayerEvent> {

  private readonly events$ = new Subject<PlayerEvent>();
  private trackPlaybackCommands$ = new BufferedSubject<TrackPlaybackCommand>();
  private player: YT.Player;
  private playerStateChangeListener?: any;
  private playerSubject = new ReplaySubject<YT.Player>(1);

  constructor() {
    super(subscriber => {
      const subscription: Subscription = this.events$.subscribe(subscriber);
      return () => subscription.unsubscribe();
    });
  }

  setTrack(code: string, startTime: number) {
    this.playerSubject.subscribe({
      next: (player: YT.Player) => player.loadVideoById({
        videoId: code,
        startSeconds: startTime
      })
    });
    this.trackPlaybackCommands$.unsubscribe();
    this.trackPlaybackCommands$ = new BufferedSubject<TrackPlaybackCommand>();
  }

  play() {
    this.trackPlaybackCommands$.next((player: YT.Player) => player.playVideo());
  }

  pause() {
    this.trackPlaybackCommands$.next((player: YT.Player) => player.pauseVideo());
  }

  registerPlayer(player: YT.Player) {
    if (this.player != null) {
      throw new Error('Player already registered');
    }
    this.player = player;
    this.playerSubject.next(player);
    this.playerStateChangeListener = (event: YT.OnStateChangeEvent) => this.playerEvent(event);
    this.player.addEventListener('onStateChange', this.playerStateChangeListener);
  }

  unregisterPlayer(player: YT.Player) {
    if (this.player == null || this.player !== player) {
      throw new Error('Player not registered');
    }
    this.player.removeEventListener('onStateChange', this.playerStateChangeListener);
    this.playerSubject = new ReplaySubject<YT.Player>(1);
    this.player = null;
    this.playerStateChangeListener = null;
  }

  playerEvent(event: YT.OnStateChangeEvent) {
    this.logPlayerEvent(event);
    switch (event.data) {
      case YT.PlayerState.UNSTARTED:
        if (this.trackPlaybackCommands$.hasSubscription()) {
          break;
        }
        this.trackPlaybackCommands$.subscribe({
          next: (command: TrackPlaybackCommand) => {
            console.log('Running command', command);
            command(event.target);
          }
        });
        break;
      case YT.PlayerState.PLAYING:
        this.events$.next(createPlayerEventStarted());
        break;
      case YT.PlayerState.PAUSED:
        this.events$.next(createPlayerEventPaused(this.getTime()));
        break;
      case YT.PlayerState.ENDED:
        this.events$.next(createPlayerEventEnded());
        break;
      case YT.PlayerState.BUFFERING:
        this.events$.next(createPlayerEventBuffering(this.getTime()));
        break;
    }
  }

  // noinspection JSMethodCanBeStatic
  private logPlayerEvent(event: YT.OnStateChangeEvent) {
    const stateString = {
      '-1': 'Unstarted',
      0: 'Ended',
      1: 'Playing',
      2: 'Paused',
      3: 'Buffering',
      5: 'Cued'
    };
    console.log(`Youtube player event: ${stateString[event.data]}`);
  }

  private getTime(): number {
    return Math.floor(this.player.getCurrentTime());
  }

}

type TrackPlaybackCommand = (player: YT.Player) => void;

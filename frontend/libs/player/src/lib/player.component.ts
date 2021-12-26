import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerServiceView } from './player-service-view';
import { Subject } from 'rxjs';
import { PlayerService } from './player.service';
import { PlayerCommand, PlayerCommandType } from './command';
import {
  createPlayerEventBuffering,
  createPlayerEventEnded,
  createPlayerEventPaused,
  createPlayerEventStarted
} from './event';

@Component({
  selector: 'beets-player',
  template: `
    <p>
      <youtube-player [videoId]="dummyVideoId"
                      (ready)="youtubePlayerReady($event)"
                      (change)="youtubePlayerEvent($event)">
      </youtube-player>
    </p>
  `,
  styles: []
})
export class PlayerComponent implements OnInit, OnDestroy, PlayerServiceView {

  readonly dummyVideoId = 'Ar-IEE_DIEo';

  events$ = new Subject<any>();
  youtubePlayer: YT.Player;

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.playerService.registerView(this);
  }

  ngOnDestroy(): void {
    this.playerService.unregisterView(this);
  }

  commandHandler(command: PlayerCommand): void {
    switch (command.type) {
      case PlayerCommandType.Play:
        this.youtubePlayer.playVideo();
        break;
      case PlayerCommandType.Pause:
        this.youtubePlayer.pauseVideo();
        break;
      case PlayerCommandType.SetTrackYoutube:
        this.youtubePlayer.loadVideoById(command.code);
        break;
    }
  }

  youtubePlayerReady(player: YT.Player) {
    this.youtubePlayer = player;
  }

  youtubePlayerEvent(event: YT.OnStateChangeEvent) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.playerService.handleEvent(createPlayerEventStarted());
        break;
      case YT.PlayerState.PAUSED:
        this.playerService.handleEvent(createPlayerEventPaused(this.youtubePlayer.getCurrentTime()));
        break;
      case YT.PlayerState.ENDED:
        this.playerService.handleEvent(createPlayerEventEnded());
        break;
      case YT.PlayerState.BUFFERING:
        this.playerService.handleEvent(createPlayerEventBuffering(this.youtubePlayer.getCurrentTime()));
        break;
    }
  }

}

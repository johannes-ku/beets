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
import { BufferedSubject } from '../../../../src/app/util/buffered-subject';

@Component({
  selector: 'beets-player',
  template: `
    <youtube-player [videoId]="dummyVideoId"
                    (ready)="youtubePlayerReady($event)"
                    (change)="youtubePlayerEvent($event)">
    </youtube-player>
  `,
  styles: []
})
export class PlayerComponent implements OnInit, OnDestroy, PlayerServiceView {

  readonly dummyVideoId = 'Ar-IEE_DIEo';

  events$ = new Subject<any>();
  youtubePlayerCommands$ = new BufferedSubject<YoutubePlayerCommand>();

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
        this.youtubePlayerCommands$.next((player: YT.Player) => player.playVideo());
        break;
      case PlayerCommandType.Pause:
        this.youtubePlayerCommands$.next((player: YT.Player) => player.pauseVideo());
        break;
      case PlayerCommandType.SetTrackYoutube:
        this.youtubePlayerCommands$.next((player: YT.Player) => player.loadVideoById(command.code));
        break;
    }
  }

  youtubePlayerReady(player: YT.Player) {
    // TODO takeUntil
    this.youtubePlayerCommands$
        .subscribe({
          next: (command: YoutubePlayerCommand) => command(player)
        });
  }

  youtubePlayerEvent(event: YT.OnStateChangeEvent) {

    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.playerService.handleEvent(createPlayerEventStarted());
        break;
      case YT.PlayerState.PAUSED:
        this.playerService.handleEvent(createPlayerEventPaused(this.getYoutubePlayerTime(event.target)));
        break;
      case YT.PlayerState.ENDED:
        this.playerService.handleEvent(createPlayerEventEnded());
        break;
      case YT.PlayerState.BUFFERING:
        this.playerService.handleEvent(createPlayerEventBuffering(this.getYoutubePlayerTime(event.target)));
        break;
    }
  }
  private getYoutubePlayerTime(player: YT.Player): number {
    return Math.floor(player.getCurrentTime());
  }

}

type YoutubePlayerCommand = (player: YT.Player) => void;

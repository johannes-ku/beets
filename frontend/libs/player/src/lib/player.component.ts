import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerServiceView } from './player-service-view';
import { Subject } from 'rxjs';
import { PlayerService } from './player.service';
import { PlayerCommand, PlayerCommandType } from './command';

@Component({
  selector: 'beets-player',
  template: `
    <p>
      player works!
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

  youtubePlayerEvent(event: YT.PlayerEvent) {
    console.log(event);
  }

}

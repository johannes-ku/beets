import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerServiceView } from './player-service-view';
import { Subject } from 'rxjs';
import { PlayerService } from './player.service';

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

  commandHandler(command: any): void {
    this.youtubePlayer.loadVideoById(command);
  }

  youtubePlayerReady(player: YT.Player) {
    this.youtubePlayer = player;
  }

  youtubePlayerEvent(event: YT.PlayerEvent) {
    console.log(event);
  }

}

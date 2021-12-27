import { Component, OnDestroy } from '@angular/core';
import { YoutubePlayerService } from './youtube-player.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'beets-youtube-player',
  template: `
    <youtube-player [videoId]="dummyVideoId"
                    (ready)="playerReady($event)">
    </youtube-player>
  `
})
export class YoutubePlayerComponent implements OnDestroy {

  private readonly componentDestroyed$ = new Subject();

  readonly dummyVideoId = 'Ar-IEE_DIEo';
  private player?: YT.Player;

  constructor(private youtubePlayerService: YoutubePlayerService) { }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
    if (this.player != null) {
      this.youtubePlayerService.unregisterPlayer(this.player);
    }
  }

  playerReady(player: YT.Player) {
    this.player = player;
    this.youtubePlayerService.registerPlayer(this.player);
  }


}

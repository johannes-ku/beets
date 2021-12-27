import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PlayerEvent } from './event';
import { YoutubePlayerService } from './youtube-player/youtube-player.service';
import { TrackSource } from 'beets-shared';

@Injectable({
  providedIn: 'root'
})
export class PlayerService extends Observable<PlayerEvent> {

  private events$ = new Subject<PlayerEvent>();
  private activeSource?: TrackSource;
  private shouldBePlaying = true;

  constructor(private youtubePlayerService: YoutubePlayerService) {
    super(subscriber => {
      const subscription = this.events$.subscribe(subscriber);
      return () => subscription.unsubscribe();
    });
    this.youtubePlayerService.subscribe({
      next: playerEvent => {
        if (this.activeSource !== TrackSource.Youtube) {
          return;
        }
        this.events$.next(playerEvent);
      }
    });
  }

  setTrack(source: TrackSource, code: string, startTime: number) {
    switch (this.activeSource) {
      case TrackSource.Youtube:
        this.youtubePlayerService.pause();
        break;
    }
    switch (source) {
      case TrackSource.Youtube:
        this.youtubePlayerService.setTrack(code, startTime);
        if (this.shouldBePlaying) {
          this.youtubePlayerService.play();
        } else {
          this.youtubePlayerService.pause();
        }
        break;
    }
    this.activeSource = source;
  }

  play() {
    this.shouldBePlaying = true;
    switch (this.activeSource) {
      case TrackSource.Youtube:
        this.youtubePlayerService.play();
        break;
    }
  }

  pause() {
    this.shouldBePlaying = false;
    switch (this.activeSource) {
      case TrackSource.Youtube:
        this.youtubePlayerService.pause();
        break;
    }
  }

  stop() {
    this.shouldBePlaying = false;
    switch (this.activeSource) {
      case TrackSource.Youtube:
        this.youtubePlayerService.pause();
        break;
    }
    this.activeSource = null;
  }

}

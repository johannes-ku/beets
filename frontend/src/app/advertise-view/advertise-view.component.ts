import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CommunicationService } from '../communication/communication.service';
import { takeUntil } from 'rxjs/operators';
import {
  CommunicationMessage,
  CommunicationMessageType,
  createCommunicationMessageAddTrack,
  createCommunicationMessageNext,
  createCommunicationMessagePause,
  createCommunicationMessagePlay,
  PlayerState,
  PlayingStateType,
  TrackSource
} from 'beets-shared';
import { faForward, faPause, faPlay, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'beets-advertise-view',
  templateUrl: './advertise-view.component.html',
  styleUrls: ['./advertise-view.component.scss']
})
export class AdvertiseViewComponent implements OnInit, OnDestroy {

  private readonly componentDestroyed$ = new Subject();
  private playerTimeUpdatingIntervalId: any;
  readonly PlayingStateType = PlayingStateType;

  readonly faPlay = faPlay;
  readonly faPause = faPause;
  readonly faForward = faForward;
  readonly faYoutube = faYoutube;

  state: PlayerState;
  name: string;

  constructor(private communicationService: CommunicationService) { }

  ngOnInit() {
    this.name = '<advertise>';
    this.communicationService.setIdentityAsUser(this.name);
    this.communicationService
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (message: CommunicationMessage) => {
          switch (message.type) {
            case CommunicationMessageType.PlayerState:
              this.handlePlayerStateUpdate(message.state);
              break;
          }
        }
      });
  }

  private handlePlayerStateUpdate(newState: PlayerState) {
    if (newState.playingStateType === PlayingStateType.Playing) {
      if (this.playerTimeUpdatingIntervalId == null) {
        this.playerTimeUpdatingIntervalId = setInterval(
          () => this.state = {
            ...this.state,
            playingTime: this.state.playingTime + 1
          },
          1000
        );
      }
    } else {
      if (this.playerTimeUpdatingIntervalId != null) {
        clearInterval(this.playerTimeUpdatingIntervalId);
        this.playerTimeUpdatingIntervalId = null;
      }
    }
    this.state = newState;
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  play() {
    this.communicationService.send(createCommunicationMessagePlay());
  }

  pause() {
    this.communicationService.send(createCommunicationMessagePause());
  }

  next() {
    this.communicationService.send(createCommunicationMessageNext());
  }

  getUrl() {
    return window.location.href.split('/') [2]; // HAX
  }

}

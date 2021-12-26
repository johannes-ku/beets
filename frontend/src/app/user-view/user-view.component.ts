import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '../communication/communication.service';
import {
  CommunicationMessage,
  CommunicationMessageType,
  createCommunicationMessageAddTrack,
  createCommunicationMessageNext,
  createCommunicationMessagePause,
  createCommunicationMessagePlay,
  createTrack,
  PlayerState,
  TrackSource,
  PlayingStateType
} from 'beets-shared';
import { faForward, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'beets-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit, OnDestroy {

  readonly faPlay = faPlay;
  readonly faPause = faPause;
  readonly faForward = faForward;
  readonly PlayingStateType = PlayingStateType;

  private readonly componentDestroyed$ = new Subject();
  private playerTimeUpdatingIntervalId: any;

  state: PlayerState;

  constructor(private communicationService: CommunicationService) { }

  ngOnInit() {
    let name = localStorage.getItem('name');
    if (name == null) {
      name = 'Dr. Krieger';
      localStorage.setItem('name', name);
    }
    this.communicationService.setIdentityAsUser(name);
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

  addSong() {
    const codes = [
      'S4vFO8W18gM',
      'fT3wwNaEr4g',
      'ZOhnPIHGxNM'
    ];
    const code = codes[Math.floor(Math.random() * codes.length)];
    this.communicationService.send(createCommunicationMessageAddTrack(TrackSource.YouTube, code));
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CommunicationMessage,
  CommunicationMessageType,
  createCommunicationMessagePlaying,
  createCommunicationMessagePaused,
  createCommunicationMessageNext,
} from 'beets-shared';
import { PlayerService } from '../../../libs/player/src/lib/player.service';
import { CommunicationService } from '../communication/communication.service';
import { PlayerEvent, PlayerEventType } from '../../../libs/player/src/lib/event';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'beets-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent implements OnInit, OnDestroy {

  private readonly componentDestroyed$ = new Subject();

  constructor(private communicationService: CommunicationService,
              private playerService: PlayerService) { }

  ngOnInit() {
    this.communicationService.setIdentityAsPlayer();
    this.communicationService
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (message: CommunicationMessage) => {
            switch (message.type) {
              case CommunicationMessageType.Play:
                this.playerService.play();
                break;
              case CommunicationMessageType.Pause:
                this.playerService.pause();
                break;
              case CommunicationMessageType.SetPlayerTrack:
                this.playerService.setYtTrack(message.code);
                break;
              default:
                console.log(`Unexpected message ${message.type}`);
            }
          }
        });
    this.playerService
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (event: PlayerEvent) => {
            switch (event.type) {
              case PlayerEventType.Started:
                this.communicationService.send(createCommunicationMessagePlaying());
                break;
              case PlayerEventType.Paused:
                this.communicationService.send(createCommunicationMessagePaused(event.time));
                break;
              case PlayerEventType.Ended:
                this.communicationService.send(createCommunicationMessageNext());
                break;
              case PlayerEventType.Buffering:
                // TODO: Do nothing for now, shouldn't happen too often
                break;
            }
          }
        });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}

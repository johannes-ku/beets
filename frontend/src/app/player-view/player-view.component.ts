import { Component, OnInit } from '@angular/core';
import {
  CommunicationMessage,
  CommunicationMessageType,
} from 'beets-shared';
import { PlayerService } from '../../../libs/player/src/lib/player.service';
import { CommunicationService } from '../communication/communication.service';

@Component({
  selector: 'beets-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent implements OnInit {


  constructor(private communicationService: CommunicationService,
              private playerService: PlayerService) { }

  ngOnInit() {
    this.communicationService.setIdentityAsPlayer();
    // this.playerService.setYtTrack('sFHui_gTx-w');
    // TODO: Unsibscribe
    this.communicationService.subscribe({
      next: (message: CommunicationMessage) => {
        switch (message.type) {
          case CommunicationMessageType.Play:
            this.playerService.play();
            break;
          case CommunicationMessageType.Pause:
            this.playerService.pause();
            break;
          default:
            console.log(`Unexpected message ${message.type}`);
        }
      }
    });
  }

}

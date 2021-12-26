import { Component, OnInit } from '@angular/core';
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
    // this.playerService.setYtTrack('sFHui_gTx-w');
  }

}

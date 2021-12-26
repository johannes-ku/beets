import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication/communication.service';
import { createCommunicationMessagePause, createCommunicationMessagePlay } from 'beets-shared';

@Component({
  selector: 'beets-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {

  constructor(private communicationService: CommunicationService) { }

  ngOnInit() {
    this.communicationService.setIdentityAsUser('Dr. Krieger');
  }

  play() {
    this.communicationService.send(createCommunicationMessagePlay());
  }

  pause() {
    this.communicationService.send(createCommunicationMessagePause());
  }

}

import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication/communication.service';
import { createCommunicationMessagePause, createCommunicationMessagePlay, createTrack, TrackSource } from 'beets-shared';
import { faPlay, faPause, faForward } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'beets-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {

  faPlay = faPlay;
  faPause = faPause;
  faForward = faForward;
  exampleTrack = createTrack('ad', 'Moomin FINNISH SUBS (BASS BOOSTED)', 235, TrackSource.Youtube, 'asd');

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

import { Component, Input, OnInit } from '@angular/core';
import { Track } from 'beets-shared';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'beets-queue-item',
  templateUrl: './queue-item.component.html',
  styleUrls: ['./queue-item.component.css']
})
export class QueueItemComponent implements OnInit {

  @Input()
  track: Track;

  faTrash = faTrash;
  faYoutube = faYoutube;

  constructor() { }

  ngOnInit() {
  }

  getTrackLengthPretty() {
    const minutes = Math.floor(this.track.length / 60);
    const seconds = this.track.length - (minutes * 60);
    return seconds < 10 ? minutes + ':0' + seconds : minutes + ':' + seconds;
  }

}

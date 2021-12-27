import { Component, Input, OnInit } from '@angular/core';
import { Track } from 'beets-shared';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'beets-queue-item',
  templateUrl: './queue-item.component.html',
  styleUrls: ['./queue-item.component.css']
})
export class QueueItemComponent {

  @Input()
  track: Track;

  faTrash = faTrash;
  faYoutube = faYoutube;

  constructor() { }

}

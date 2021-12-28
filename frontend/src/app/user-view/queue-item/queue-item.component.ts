import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Track } from 'beets-shared';
import { faCircleNotch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'beets-queue-item',
  templateUrl: './queue-item.component.html',
  styleUrls: ['./queue-item.component.css']
})
export class QueueItemComponent {

  @Input()
  track: Track;

  @Output()
  remove = new EventEmitter<Track>();

  isRemoved = false;
  faTrash = faTrash;
  faCircleNotch = faCircleNotch;
  faYoutube = faYoutube;

  constructor() { }

  doRemove() {
    this.isRemoved = true;
    this.remove.emit(this.track);
  }

}

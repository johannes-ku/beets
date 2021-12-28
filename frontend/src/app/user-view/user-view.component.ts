import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '../communication/communication.service';
import {
  CommunicationMessage,
  CommunicationMessageType,
  createCommunicationMessageNext,
  createCommunicationMessagePause,
  createCommunicationMessagePlay,
  PlayerState,
  PlayingStateType,
  TrackSource
} from 'beets-shared';
import { faForward, faPause, faPlay, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
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
  readonly faPlus = faPlus;
  readonly faYoutube = faYoutube;
  readonly PlayingStateType = PlayingStateType;

  private readonly componentDestroyed$ = new Subject();
  private playerTimeUpdatingIntervalId: any;

  searchOpen = false;

  state: PlayerState;
  name: string;

  constructor(private communicationService: CommunicationService) { }

  ngOnInit() {
    this.name = localStorage.getItem('name');
    if (this.name == null) {
      this.name = this.getRandomName();
      localStorage.setItem('name', this.name);
    }
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

  getName() {
    const name = localStorage.getItem('name');
    return name == null ? 'N/A' : name;
  }

  getRandomFromList(list) {
    return list[Math.floor((Math.random() * list.length))];
  }

  getRandomName() {
    const adj = ['White', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Cyan', 'Violet', 'Brown', 'Black', 'Gray',
      'Grey', 'Fierce', 'Angry', 'Depressed', 'Annoying', 'Large', 'Lorge', 'Small', 'Smol', 'Big', 'Thicc', 'Thick',
      'Alarming', 'Yelling', 'Medium', 'Medium-rare', 'Rare', 'Common', 'Uncommon', 'Shaky', 'Bouncy', 'Quick', 'Swift',
      'Slow', 'Dark', 'Light', 'Superb', 'Digital', 'Analog', 'Weird', 'Tight', 'Western', 'Eastern', 'Northern',
      'Southern', 'British', 'Polish', 'Finnish', 'Swedish', 'Latvian', 'Lithuanian', 'Italian', 'Stunning', 'Wobbly',
      'Flashy', 'Disorderly', 'Orderly', 'Quirky', 'Snappy', 'Knobby', 'Cool', 'Uncool', 'Strong', 'Weak', 'Stronk',
      'Arid', 'Temperate', 'Snowy', 'Sunny', 'Rainy', 'Watery', 'Moist', 'Wet', 'Dry'
    ];
    const noun = ['Joonas', 'Rasmus', 'Morris', 'Maq', 'Maku', 'Maku220', 'Hint', 'Soone', 'Oss', 'Ossu', 'Oskar',
      'BBQ', 'Barbeque', 'Boy', 'Boi', 'Grill', 'Bol', 'Ball', 'Dog', 'Doggo', 'Husky', 'Maliraptor', 'Retriever',
      'Whippet', 'Hound', 'Malamute', 'Terrier', 'Spaniel', 'Beagle', 'Collie', 'Boxer', 'Puppy', 'Pupper', 'Pupperino',
      'Cat', 'Catto', 'Avocato', 'Avocado', 'Penguin', 'Bird', 'Birb', 'Drone', 'Fish', 'Dolphin', 'Shark', 'Shrek',
      'Donkey', 'Dragon', 'Mr. Burns', 'Homer', 'Marge', 'Lisa', 'Bart', 'Maggie', 'Moe', 'Peter', 'Louis', 'Meg',
      'Stewie', 'Brian', 'Dude', 'Rapper', 'Wrapper', 'Orange', 'Steve', 'Rock', 'Stone', 'Brick', 'Toad', 'Frog',
      'Tiger', 'Tigger', 'Pooh', 'Tigr', 'Blackhawk', 'Warthog', 'Bear', 'Beer', 'Redditor', 'Apache', 'Huey',
      'Predator', 'Reaper', 'Puma', 'Karen'
    ];
    return this.getRandomFromList(adj) + ' ' + this.getRandomFromList(noun);
  }

  openSearch() {
    this.searchOpen = true;
  }

  closeSearch() {
    this.searchOpen = false;
  }

}

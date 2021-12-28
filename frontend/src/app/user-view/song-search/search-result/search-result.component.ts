import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { SearchResult } from './search-result';

@Component({
  selector: 'beets-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {

  readonly faPlus = faPlus;
  readonly faYoutube = faYoutube;

  @Input()
  searchResult: SearchResult;

  @Output()
  addTrack = new EventEmitter<SearchResult>();

  // TODO icon in html

}

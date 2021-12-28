import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EMPTY, from, Subscription, timer } from 'rxjs';
import { debounce, map, tap } from 'rxjs/operators';
import { SearchResult } from './search-result/search-result';
import { createCommunicationMessageAddTrack, TrackSource } from 'beets-shared';
import { CommunicationService } from '../../communication/communication.service';
import { FormControl } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { YoutubeSearchService } from '../../youtube/youtube-search.service';

@Component({
  selector: 'beets-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.scss']
})
export class SongSearchComponent implements OnInit {

  @Output()
  closeModal = new EventEmitter<void>();

  private readonly searchDebounceTime = 500;

  readonly faTimes = faTimes;
  readonly ViewState = ViewState;

  readonly searchPhrase = new FormControl('');

  activeViewState = ViewState.NoSearch;
  searchResults?: SearchResults;

  private searchResultsSubscription?: Subscription;

  constructor(private communicationService: CommunicationService,
              private youtubeSearchService: YoutubeSearchService) {}

  ngOnInit() {
    this.searchPhrase.valueChanges
        .pipe(tap(() => {
          this.searchResults = null;
          this.activeViewState = ViewState.Searching;
          if (this.searchResultsSubscription != null) {
            this.searchResultsSubscription.unsubscribe();
            this.searchResultsSubscription = null;
          }
        }))
        .pipe(debounce(value => this.isBlank(value) ? EMPTY : timer(this.searchDebounceTime)))
        .pipe(map(value => this.performSearch(value)))
        .subscribe({
          next: (searchResultsPromise: Promise<SearchResults>) => {
            this.searchResultsSubscription = from(searchResultsPromise).subscribe({
              next: (searchResults: SearchResults) => {
                if (searchResults.results == null) {
                  this.activeViewState = ViewState.NoSearch;
                  return;
                }
                this.activeViewState = ViewState.ShowResults;
                this.searchResults = searchResults;
              }
            });
          }
        });
  }

  // noinspection JSMethodCanBeStatic
  private isBlank(str: string) {
    return str == null || /^\s*$/.test(str);
  }

  private async performSearch(searchPhrase: string): Promise<SearchResults> {
    if (this.isBlank(searchPhrase)) {
      return {
        searchPhrase: ''
      };
    }
    const youtubeTracks = await this.youtubeSearchService.search(searchPhrase);
    return {
      searchPhrase,
      results: youtubeTracks.map(track => ({
        name: track.name,
        code: track.code,
        length: track.length,
        source: TrackSource.Youtube
      }))
    };
  }

  addTrack(searchResult: SearchResult) {
    this.communicationService.send(createCommunicationMessageAddTrack(
        searchResult.source,
        searchResult.code
    ));
    this.closeModal.emit();
  }

}

interface SearchResults {
  searchPhrase: string;
  results?: SearchResult[];
}

enum ViewState {
  NoSearch = 'NoSearch',
  Searching = 'Searching',
  ShowResults = 'ShowResults',
  Error = 'Error' // TODO As if we handle errors, lol
}

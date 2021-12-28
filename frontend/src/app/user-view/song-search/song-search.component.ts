import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EMPTY, from, Subscription, timer } from 'rxjs';
import { debounce, map, tap } from 'rxjs/operators';
import { SearchResult } from './search-result/search-result';
import { createCommunicationMessageAddTrack, TrackSource } from 'beets-shared';
import { duration } from 'moment';
import { CommunicationService } from '../../communication/communication.service';
import { FormControl } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'beets-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.scss']
})
export class SongSearchComponent implements OnInit {

  @Output()
  closeModal = new EventEmitter<void>();

  private readonly searchDebounceTime = 1000;
  private readonly youtubeApiKey = 'AIzaSyATchqdMwCq_oqoUVjo_05iu5HaEH5f-hA'; // TODO config

  readonly faTimes = faTimes;
  readonly ViewState = ViewState;

  readonly searchPhrase = new FormControl('');

  activeViewState = ViewState.NoSearch;
  searchResults?: SearchResults;

  private searchResultsSubscription?: Subscription;

  constructor(private communicationService: CommunicationService) {}

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

    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('key', this.youtubeApiKey);
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('q', searchPhrase);
    searchUrl.searchParams.append('maxResults', '5');
    searchUrl.searchParams.append('part', 'id');
    const searchResponse = await fetch(searchUrl.toString());
    const searchResponseBody = await searchResponse.json();

    const codes: string[] = searchResponseBody.items.map(item => item.id.videoId);

    const videoInfoUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videoInfoUrl.searchParams.append('key', this.youtubeApiKey);
    videoInfoUrl.searchParams.append('id', codes.join(','));
    videoInfoUrl.searchParams.append('part', ['id', 'snippet', 'contentDetails'].join(','));
    const videoInfoResponse = await fetch(videoInfoUrl.toString());
    const videoInfoResponseBody = await videoInfoResponse.json();

    const items = videoInfoResponseBody.items;
    return {
      searchPhrase,
      results: items.map(item => ({
        code: item.id,
        name: item.snippet.title,
        source: TrackSource.Youtube,
        length: duration(item.contentDetails.duration).asSeconds()
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

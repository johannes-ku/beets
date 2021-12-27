import { Component, OnInit } from '@angular/core';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'beets-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.scss']
})
export class SongSearchComponent implements OnInit {

  readonly faYoutube = faYoutube;
  readonly faSearch = faSearch;
  searchPhrase: string;


  constructor() { }

  ngOnInit() {
  }

  async search() {
    /*if (this.searchPhrase !== '') {
      this.lastResults = null;
    } else {
      this.lastResults = null;
    }*/
  }
}

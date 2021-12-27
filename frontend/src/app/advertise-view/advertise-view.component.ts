import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'beets-advertise-view',
  templateUrl: './advertise-view.component.html',
  styleUrls: ['./advertise-view.component.scss']
})
export class AdvertiseViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getUrl() {
    return window.location.href.split('/') [2]; // HAX
  }

}

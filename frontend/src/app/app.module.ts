import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayerViewComponent } from './player-view/player-view.component';
import { AppRoutingModule } from './app-routing.module';
import { PlayerModule } from '../../libs/player/src/lib/player.module';
import { UserViewComponent } from './user-view/user-view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QueueItemComponent } from './user-view/queue-item/queue-item.component';
import { FormatSecondsPipe } from './format-seconds/format-seconds.pipe';
import { SongSearchComponent } from './user-view/song-search/song-search.component';
import { SearchResultComponent } from './user-view/song-search/search-result/search-result.component';
import { FormsModule } from '@angular/forms';
import { AdvertiseViewComponent } from './advertise-view/advertise-view.component';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    PlayerViewComponent,
    UserViewComponent,
    QueueItemComponent,
    FormatSecondsPipe,
    SongSearchComponent,
    SearchResultComponent,
    AdvertiseViewComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        PlayerModule,
        FontAwesomeModule,
        FormsModule,
        QRCodeModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

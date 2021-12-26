import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayerViewComponent } from './player-view/player-view.component';
import { AppRoutingModule } from './app-routing.module';
import { PlayerModule } from '../../libs/player/src/lib/player.module';
import { UserViewComponent } from './user-view/user-view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QueueItemComponent } from './user-view/queue-item/queue-item.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerViewComponent,
    UserViewComponent,
    QueueItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PlayerModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

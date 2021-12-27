import { NgModule } from '@angular/core';
import { PlayerComponent } from './player.component';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { PlayerService } from './player.service';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';


@NgModule({
  declarations: [
    PlayerComponent,
    YoutubePlayerComponent
  ],
  providers: [
    PlayerService
  ],
  imports: [
    NgxYoutubePlayerModule
  ],
  exports: [
    PlayerComponent
  ]
})
export class PlayerModule {}

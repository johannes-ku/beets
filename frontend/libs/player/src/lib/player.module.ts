import { NgModule } from '@angular/core';
import { PlayerComponent } from './player.component';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { PlayerService } from './player.service';


@NgModule({
  declarations: [
    PlayerComponent
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

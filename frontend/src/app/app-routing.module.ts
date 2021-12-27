import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PlayerViewComponent } from './player-view/player-view.component';
import { UserViewComponent } from './user-view/user-view.component';
import { AdvertiseViewComponent } from './advertise-view/advertise-view.component';

const routes: Routes = [
  {
    path: 'player',
    component: PlayerViewComponent
  },
  {
    path: 'advertise',
    component: AdvertiseViewComponent
  },
  {
    path: '',
    component: UserViewComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

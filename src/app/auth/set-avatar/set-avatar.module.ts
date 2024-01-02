import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetAvatarComponent } from './set-avatar.component';
import { RouterModule, Routes } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: '',
    component: SetAvatarComponent
  }
]

@NgModule({
  declarations: [
    SetAvatarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule
  ]
})
export class SetAvatarModule { }

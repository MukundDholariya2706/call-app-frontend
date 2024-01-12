import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    VideoComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    VideoComponent
  ]
})
export class VideoModule { }

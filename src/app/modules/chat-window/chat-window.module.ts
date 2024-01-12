import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWindowComponent } from './chat-window.component';
import { FormsModule } from '@angular/forms';
import { VideoModule } from '../video/video.module';



@NgModule({
  declarations: [
    ChatWindowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    VideoModule
  ],
  exports: [
    ChatWindowComponent
  ]
})
export class ChatWindowModule { }

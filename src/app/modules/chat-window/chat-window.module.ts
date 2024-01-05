import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWindowComponent } from './chat-window.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChatWindowComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ChatWindowComponent
  ]
})
export class ChatWindowModule { }

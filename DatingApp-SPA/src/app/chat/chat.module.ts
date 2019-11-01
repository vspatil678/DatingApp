import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';
import { ChatService } from './chat.service';
import { RouterModule } from '@angular/router';
import { chatRoutes } from './chat-routes';



@NgModule({
  declarations: [ChatDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(chatRoutes),
  ],
  exports: [
    ChatDialogComponent
  ],
  providers: [
    ChatService
  ]
})
export class ChatModule { }

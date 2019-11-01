import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from '../chat.service';
import { ChatBotMessage } from '../_models/chat-bot-message';
import { scan } from 'rxjs/operators';
@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit, AfterViewInit {

 public messages: Observable<ChatBotMessage[]>;
 public formValue: string;

 constructor(private chatService: ChatService,
             private elementRef: ElementRef) { }

  ngOnInit() {
    this.formValue = '';
    this.messages = this.chatService.conversation.asObservable().pipe(
        scan((acc, val) => acc.concat(val) ));
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#f2edaa';
  }

  sendMessage() {
    this.chatService.converse(this.formValue);
    this.formValue = '';
  }
}

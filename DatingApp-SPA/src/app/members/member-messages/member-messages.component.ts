import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/Message';
import { AuthService } from 'src/app/_services/auth.service';
import { tap } from 'rxjs/operators';
import { SpeechRecognizationService } from 'src/app/_services/speech-recognization.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit, OnDestroy {

 @Input() public recipientId: number;
  public messages: Message[] = [];
  public newMessage: any = {};
  public speechData = '';
  public showSpeechButton = true;
  constructor(private usersService: UserService,
              private alertify: AlertifyService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private speechRecognizationService: SpeechRecognizationService) { }

  ngOnInit() {
    this.loadMessages();
  }

  public loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.usersService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId).pipe(
      tap(messages => {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < messages.length; i++) {
            if (messages[i].IsRead === false && messages[i].RecipientId === currentUserId) {
              this.usersService.markMessageAsRead(currentUserId, messages[i].Id);
            }
        }
      })
    )
    .subscribe((messages) => { this.messages = messages; }, error => { this.alertify.error(error); } );
  }

  public sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.usersService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe(
      (message: Message) => { this.messages.unshift(message);  this.newMessage.content = ''; },
      (error) => {
        this.alertify.error(error);
      }
    );
  }
 public activateSpeechToText(): void {
    this.showSpeechButton = false;

    this.speechRecognizationService.record().subscribe(
        // listener
        (value) => {
            this.speechData = value;
            this.newMessage.content = this.newMessage.content + value;
            console.log(value);
        },
        // errror
        (err) => {
            console.log(err);
            if (err.error === 'no-speech') {
                console.log('--restatring service--');
                this.activateSpeechToText();
            }
        },
        // completion
        () => {
            this.showSpeechButton = true;
            console.log('--complete--');
            this.activateSpeechToText();
        });
}

public stopSpeechToText(e: any) {
  // nothing worked to stop listening
  this.showSpeechButton = true;
  e.stopPropagation();
  e.cancelBubble = true;
  window.event.cancelBubble = true;
  window.stop();
}
  ngOnDestroy(): void {
    this.speechRecognizationService.DestroySpeechObject();
  }
}

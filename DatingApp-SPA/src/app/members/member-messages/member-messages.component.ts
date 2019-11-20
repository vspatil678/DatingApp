import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/Message';
import { AuthService } from 'src/app/_services/auth.service';
import { tap } from 'rxjs/operators';
import { SpeechRecognizationService } from 'src/app/_services/speech-recognization.service';
import Speech from 'speak-tts';
import { MatDialog } from '@angular/material/dialog';
import { CallComponent } from '../call/call.component';

const speech = new Speech();
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
  public showSpeakerButton = true;
  public selectedId = 0;
  constructor(private usersService: UserService,
              private alertify: AlertifyService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private speechRecognizationService: SpeechRecognizationService,
              private dialog: MatDialog) { }

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
          if (value) {
            this.speechData = value;
            this.newMessage.content = '';
            this.newMessage.content = this.newMessage.content + value;
          }
        },
        // errror
        (err) => {
            // console.log(err);
            if (err.error === 'no-speech') {
              //  console.log('--restatring service--');
                this.activateSpeechToText();
            }
        },
        // completion
        () => {
            this.showSpeechButton = true;
           // console.log('--complete--');
            this.stopSpeechToText(event);
        });
}

public stopSpeechToText(e: any) {
  this.showSpeechButton = true;
  e.preventDefault();
  e.stopPropagation();
  this.speechRecognizationService.DestroySpeechObject();
}
  ngOnDestroy(): void {
    this.speechRecognizationService.DestroySpeechObject();
  }

  public onTextToSpeech(textData: any, id: number) {
    this.showSpeakerButton = false;
    this.selectedId = id;
    if (speech.hasBrowserSupport()) {
     // speech.setVoice('Fiona');
      speech.speak({
        text: textData,
        listeners: {
          onend: () => {
            this.onStopTextToSpeech();
        }
        }
      });
    } else {
      this.alertify.error('your browser dosent support speech synthesis.');
    }
  }

  public onStopTextToSpeech() {
    this.selectedId = 0;
    this.showSpeakerButton = true;
    speech.cancel();
  }

  public onVideoeCall() {
    this.dialog.open(CallComponent);
    // App ID: 108057f777585ac
    // Api key 0e5171496721e1effca01b053938752e2c4196af
  }

  public onVoiceCall() {
    this.dialog.open(CallComponent);
    // App ID: 108057f777585ac
    // Api key 0e5171496721e1effca01b053938752e2c4196af
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/Message';
import { AuthService } from 'src/app/_services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

 @Input() public recipientId: number;
  public messages: Message[] = [];
  public newMessage: any = {};
  constructor(private usersService: UserService,
              private alertify: AlertifyService,
              private authService: AuthService,
              private route: ActivatedRoute) { }

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
}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Message } from '../models/Message';
import { Pagination, PaginatedResult } from '../models/Pagination';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  public pagination: Pagination;
  public messages: Message[];
  public messageContainer = 'Unread';
  constructor(private usersService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.messages = data.messages.result;
      this.pagination = data.messages.pagination;
    });
  }

  public loadMessages() {
    this.usersService.getMessages(this.authService.decodedToken.nameid,
       this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer).subscribe(
       (res: PaginatedResult<Message[]>) => {
      this.messages = res.result ;
      this.pagination = res.pagination;
    }, error => { this.alertify.error(error); } );
  }

  public pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
  public deleteMessage(id: number) {
    this.alertify.confirm('Are you sure you want to delete this message', () => {
      this.usersService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe( () => {
        this.messages.splice(this.messages.findIndex(m => m.Id === id), 1);
        this.alertify.success('Message has been deleted');
      }, (error) => { this.alertify.error(error); });
    });
  }
}

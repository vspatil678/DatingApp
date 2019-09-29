import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../models/User';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  public users: User[];
  constructor(private usersService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data.users;
    });
    // if you dont want to use resolver use bellow method
    //  this.loadUsers();
  }

  public loadUsers() {
    this.usersService.getUsers().subscribe( (users: User[]) => {
      this.users = users ; }, error => { this.alertify.error(error); } );
  }

}

import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Pagination, PaginatedResult } from '../models/Pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  public users: User[];
  pagination: Pagination;
  likesParam: string;
  constructor(private usersService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log(data);
      this.users = data.users.result;
      this.pagination = data.users.pagination;
      this.likesParam = 'Likers';
    });
  }
  public loadUsers() {
    this.usersService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam).subscribe(
       (res: PaginatedResult<User[]>) => {
      this.users = res.result ;
      this.pagination = res.pagination;
    }, error => { this.alertify.error(error); } );
  }

  public pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
}

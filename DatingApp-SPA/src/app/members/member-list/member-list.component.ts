import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../models/User';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  public users: User[];
  public user: User = JSON.parse(localStorage.getItem('user'));
  public genderList = [{value: 'male', display: 'Males'}, { value: 'female', display: 'Females'}];
  userParams: any = {};
  public pagination: Pagination;
  constructor(private usersService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
    });
    this.userParams.gender = this.user.Gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 90;
    this.userParams.orderBy = 'lastActive';
    // if you dont want to use resolver use bellow method
    //  this.loadUsers();
  }

  public onPageChange(event: any) {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
  public loadUsers() {
    this.usersService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe(
       (res: PaginatedResult<User[]>) => {
      this.users = res.result ;
      this.pagination = res.pagination;
    }, error => { this.alertify.error(error); } );
  }
  public resetFilters() {
    this.userParams.gender = this.user.Gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 90;
    this.userParams.orderBy = 'lastActive';
    this.loadUsers();
  }
}

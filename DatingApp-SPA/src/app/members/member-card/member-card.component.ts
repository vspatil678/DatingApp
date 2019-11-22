import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() user: User;
  constructor(private usersService: UserService,
              private alertify: AlertifyService,
              private authService: AuthService) { }

  ngOnInit() {
  }

  public onSendLike(id: number) {
    this.usersService.sendLike(this.authService.decodedToken.nameid, id).subscribe(
      (data) => { this.alertify.success('you have liked:' + this.user.knownAs); },
      (error) => { this.alertify.error(error); }
    );
  }

}

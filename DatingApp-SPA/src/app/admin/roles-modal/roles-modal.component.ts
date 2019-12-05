import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {

  @Output() public updateSelectedRoles = new EventEmitter();
  public user: User;
  public roles: string[];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

  public updateRoles() {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }

}

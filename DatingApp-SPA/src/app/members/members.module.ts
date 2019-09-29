import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members.component';
import { MemberCardComponent } from './member-card/member-card.component';

@NgModule({
  imports: [
    CommonModule,
    MemberCardComponent,
  ],
  declarations: [MembersComponent]
})
export class MembersModule { }

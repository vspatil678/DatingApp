import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin-routes';
import { UserManagementComponent } from './user-management/user-management.component';
import { PhotoManagementComponent } from './photo-management/photo-management.component';
import { TabsModule } from 'ngx-bootstrap';



@NgModule({
  declarations: [AdminPanelComponent, UserManagementComponent, PhotoManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(adminRoutes),
    TabsModule.forRoot()
  ]
})
export class AdminModule { }

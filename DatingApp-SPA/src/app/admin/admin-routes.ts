import { Routes} from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AuthGuard } from '../_guards/auth.guard';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

export const adminRoutes: Routes = [
{
   // path: '', component: HomeComponent
},
{
    // to handle all routes with guard insted of handling one by one
   // path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
          path: 'admin', component: AdminPanelComponent, data: {roles: ['Admin', 'Moderator']}
      }
    ]
},
{
   // path: '**', redirectTo: '',  pathMatch: 'full'
},

];

// protect each route with guard

// {
//     path: 'members', component: MemberListComponent, canActivate: [AuthGuard]
// },

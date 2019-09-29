import { Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
export const appRoutes: Routes = [
{
    path: '', component: HomeComponent
},
{
    // to handle all routes with guard insted of handling one by one
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
        {
            path: 'members', component: MemberListComponent, resolve: { users: MemberListResolver}
        },
        {
            path: 'members/:Id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}
        },
        {
            path: 'messages', component: MessagesComponent
        },
        {
            path: 'lists', component: ListsComponent
        },
    ]
},
{
    path: '**', redirectTo: '',  pathMatch: 'full'
},

];

// protect each route with guard

// {
//     path: 'members', component: MemberListComponent, canActivate: [AuthGuard]
// },

import { Routes} from '@angular/router';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';
import { AuthGuard } from '../_guards/auth.guard';

export const chatRoutes: Routes = [
{
    // path: 'chat/chatbot', component: ChatDialogComponent, canActivate: [AuthGuard]
    path: 'chat/chatbot', component: ChatDialogComponent
}
];

// {
//     path: 'members', component: MemberListComponent, canActivate: [AuthGuard]
// },

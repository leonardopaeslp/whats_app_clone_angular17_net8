import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '../../../../users/user.service';
import { ConversationListComponent } from '../../ui/conversation-list/conversation-list.component';
import { ConversationMessagesPageComponent } from '../conversation-messages-page/conversation-messages-page.component';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [JsonPipe, ConversationListComponent,ConversationMessagesPageComponent, RouterOutlet],
  template: `
  <div class="container">
    <app-conversation-list/>
    <div class="chat">
    <router-outlet></router-outlet>
    </div>
  
  </div>
  `,
  styleUrl: './conversation-page.component.scss'
})
export default class ConversationPageComponent {
  private userService = inject(UserService)
  protected userInfo = this.userService.getUserInfoSignal();

/*   logoutClick(){
    this.userService.logout();
  } */

 }

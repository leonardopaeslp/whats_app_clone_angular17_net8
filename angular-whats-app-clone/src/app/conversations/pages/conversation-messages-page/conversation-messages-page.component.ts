import { Component } from '@angular/core';
import { ConversationMessagesHeaderComponent } from '../../ui/conversation-messages-header/conversation-messages-header.component';
import { ConversationMessagesBodyComponent } from '../../ui/conversation-messages-body/conversation-messages-body.component';

@Component({
  selector: 'app-conversation-messages-page',
  standalone: true,
  imports: [ConversationMessagesHeaderComponent, ConversationMessagesBodyComponent],
  templateUrl: './conversation-messages-page.component.html',
  styleUrl: './conversation-messages-page.component.scss'
})
export class ConversationMessagesPageComponent {

}

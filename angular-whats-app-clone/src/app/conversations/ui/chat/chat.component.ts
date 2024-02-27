import { Component, Input } from '@angular/core';
import { ConversationMessage } from '../../../local-db/conversation-message.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @Input({required: true})
  message!: ConversationMessage

}

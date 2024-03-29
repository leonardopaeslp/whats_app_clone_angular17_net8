import { Component, Input } from '@angular/core';
import { Conversations } from '../conversation.model';

@Component({
  selector: 'app-conversation-contact',
  standalone: true,
  imports: [],
  templateUrl: './conversation-contact.component.html',
  styleUrl: './conversation-contact.component.scss'
})
export class ConversationContactComponent {

  @Input({required: true})
  public conversations!: Conversations;
  
}

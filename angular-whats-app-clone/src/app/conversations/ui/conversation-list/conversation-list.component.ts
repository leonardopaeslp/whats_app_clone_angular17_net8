import { Component, inject } from '@angular/core';
import { ConversationHeaderComponent } from '../conversation-header/conversation-header.component';
import { ConversationContactComponent } from '../../conversation-contact/conversation-contact.component';
import { ConversationService } from '../../conversation.service';
import { Conversations } from '../../conversation.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [ConversationHeaderComponent, ConversationContactComponent],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss'
})
export class ConversationListComponent {
  private conversationService = inject(ConversationService);
  public conversations: Conversations[] = [];
  private router = inject(Router);
  constructor(){
    this.conversationService.listenConversations().subscribe(item => {
      this.conversations = item
      console.log(this.conversations);
    });
  }

  protected goToUser(userId: string){
    this.router.navigate(['conversations', userId]);
  }

}

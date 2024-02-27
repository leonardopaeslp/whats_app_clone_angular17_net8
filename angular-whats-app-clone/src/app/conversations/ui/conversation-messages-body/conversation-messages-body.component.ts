import { Component, OnDestroy, inject } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../conversation.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, filter, map, takeUntil } from 'rxjs';
import {ConversationMessage } from '../../../local-db/conversation-message.model'

@Component({
  selector: 'app-conversation-messages-body',
  standalone: true,
  imports: [ChatComponent, FormsModule],
  templateUrl: './conversation-messages-body.component.html',
  styleUrl: './conversation-messages-body.component.scss'
})
export class ConversationMessagesBodyComponent implements OnDestroy {
  protected inputMessage = '';
  protected messages: ConversationMessage[] = [
    {
     message: 'Olá!',
     conversationUserId: '',
     mine: true,
     time: new Date() 
    },
    {
      message: 'Olá!',
      conversationUserId: '',
      mine: false,
      time: new Date() 
     }
  ];
  private conversationService = inject(ConversationService);
  private unsub$ = new Subject<boolean>();
  private conversationsUserId = '';

  constructor(actRouter: ActivatedRoute) {
    actRouter.paramMap.pipe(
      map(itens => itens.get('userId')),
      //o filter é usado como método de segurança. Caso userId seja invalido, ele não passara no filtro e, automaticamente,
      //não irá continuar com o processo, não caindo no subscribe. 
      filter(userId => !!userId),
      //takeUntil: Olha, essa inscrição ela irá durar, até que este Observable (this.unsub$), dispare alguma coisa.
      //Irá lançar alguma coisa no OnDestroy.
      takeUntil(this.unsub$)
    ).subscribe((userId => this.conversationsUserId = userId || ''))
  }



  sendMessage() {
    if (!this.inputMessage) return;

    this.messages.push({
      time: new Date(),
      conversationUserId: this.conversationsUserId,
      message: this.inputMessage,
      mine: true
    })

    this.conversationService.publishMessage(this.conversationsUserId, this.inputMessage)
    this.inputMessage = '';
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }
}

import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UserService } from '../../../../users/user.service';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { ConversationService } from '../../conversation.service';
import { User } from '../../../../users/user.model';

@Component({
  selector: 'app-new-conversation-modal',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './new-conversation-modal.component.html',
  styleUrl: './new-conversation-modal.component.scss'
})
export class NewConversationModalComponent {

  protected userService = inject(UserService);
  private conversationService = inject(ConversationService);
  private currentUser = this.userService.getUserInfoSignal();
  //filter Rxjs: o filter coloca uma condição para que o subscribe seja disparado. Pois precisamos alterar o valor do objeto recebido novamente, para que o usuário logado não apareça para poder conversar com ele mesmo.
  protected users$ = this.userService.getLocalUsers().pipe(
    map(item => item.filter(user => user.user.id != this.currentUser()!.id)));

  @Input()
  showModal: boolean = false;
  @Output()
  showModalChange = new EventEmitter<boolean>();

  creatNewConversation(user: User){
    this.conversationService.createConversation(user.id, user.name).subscribe(() => {
      this.showModalChange.emit(false);
    });
  }
  

}

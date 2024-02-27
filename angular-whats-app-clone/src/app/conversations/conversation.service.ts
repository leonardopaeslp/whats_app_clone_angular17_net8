import { Injectable } from "@angular/core";
import { localDb } from "../local-db/local-db";
import { forkJoin, map, switchMap } from "rxjs";
import { Conversations } from "./conversation.model";

@Injectable({
    providedIn: 'root'
})
export class ConversationService{
    private localDb = new localDb();

    createConversation(id: string, userName: string){
        return this.localDb.addConversation(id, userName);
    }

    listenConversations(){
        //Ficará escutando as conversas geradas na tabela de conversa
        //Vou converter essa função para ela já me entregar a imagemURL da tabela Users
        return this.localDb.getLiveConversations().pipe(
            //Vou executar outra requisição: Buscar as imagens do usuário.
            //Quando executo uma requisição e logo depois preciso executar outra: switchMap
            //O primeiro argumento é a resposta do anterior.
            switchMap(conversations => {
            //Criando várias requisições (array) para cada user
            const userImagemBlob = conversations.map(conversation => 
            //crio uma requisição de imamgem pelo user.id    
            this.localDb.getUserImage(conversation.id).pipe(
                map(itemgetUserimage => ({
                    id: conversation.id,
                    userId: conversation.id,
                    userName: conversation.userName,
                    userImageUrl: !!itemgetUserimage ? URL.createObjectURL(itemgetUserimage) : null
                }) as Conversations)
            ))
            //irá executar os arrays
            return forkJoin(userImagemBlob)
            })
        );
    }

    publishMessage(conversationUserId: string, message: string){

    }
}
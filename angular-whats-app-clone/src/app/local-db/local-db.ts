import Dexie, { liveQuery } from "dexie";
import { LocalUserImage } from "./local-user-image";
import { defer, from, map, of, retry } from "rxjs";
import { LocalConversation } from "./local-conversation.model";
import { ConversationMessage } from "./conversation-message.model";

export class localDb {
    private localDb = new Dexie('whats-local-live');
    private get userTable() {
        return this.localDb.table<LocalUserImage>('users');
    }

    constructor() {
        this.localDb.version(3).stores(
            {
                users: '&id, name, imageBlob',
                conversations: '&id, userName',
                conversationMessages: '++id, conversationUserId, message, mine, time'
            });
    }

    private get ConversationTable() {
        return this.localDb.table<LocalConversation>('conversations')
    }

    private get ConversationMessages(){
        return this.localDb.table<ConversationMessage>('conversationMessages')
    }

    addConversation(id: string, userName: string) {
        return defer(() => this.ConversationTable.put({ id, userName }))
    }

    public addUsers(users: LocalUserImage[]) {
        return from(this.userTable.bulkPut(users));
    }

    public getUserImage(userId: string) {
        //defer a função abaixo quando getUserImage usar .subscribe
        //from a função abaixo é executada quando a função getUserImage é chamada
        return from(this.userTable.get(userId)).pipe(map(item => item?.imageBlob));
    }

    public getUsers() {
        ////transformando a função a baixo em Observable
        return defer(() => this.userTable.toArray());
    }


    public getLiveConversations() {
        //Método de escutar alterações em uma tabela
        //Utilização do from para transformar o Obs do liveQuery em um Obs do Angular
        return from(liveQuery(() => this.ConversationTable.toArray()));
         
    }

    public getUserById(userId: string){
        return defer(() => this.userTable.get(userId.toLocaleLowerCase()));
    }
}
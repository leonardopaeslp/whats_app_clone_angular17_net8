import Dexie from "dexie";
import { LocalUserImage } from "./local-user-image";
import { from } from "rxjs";

export class localDb {
    private localDb = new Dexie('whats-local-live');
    private get userTable(){
        return this.localDb.table<LocalUserImage>('users');
    }

    constructor(){
        this.localDb.version(1).stores({users: '&id, name, imageBlob'});
    }

    public addUsers(users: LocalUserImage[]){
        return from(this.userTable.bulkPut(users));
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable, effect, inject, signal } from "@angular/core";
import { environment } from "../environments/environment";
import { User } from "./user.model";
import { catchError, forkJoin, map, of, switchMap, tap } from "rxjs";
import { localDb } from "../app/local-db/local-db";
import { UserStorageInfo } from "./user-storage-info.model";
import { AuthLoginRequest } from "./auth-login-response.models";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private urlApi = `${environment.urlApi}User`
    private authUrlApi = `${environment.urlApi}Auth`
    private userInfo = signal<UserStorageInfo | null>(null)

    constructor() {
        effect(() => this.syncUserInfoLocalStorage());
    }

    syncUserInfoLocalStorage(){
        localStorage.setItem('UserData', JSON.stringify(this.userInfo()));
    }
    getUsers() {
        return this.http.get<User[]>(`${this.urlApi}`)
            .pipe(
                switchMap(user => {
                    const userImageRequest = user
                        .map(user => this.getUserImage(user.id)
                            .pipe(
                                catchError(_ => of(null)),
                                map(imagem => ({
                                    user, imagem
                                }))))
                    return forkJoin(userImageRequest);
                }),
                tap(userImages => {
                    new localDb().addUsers(userImages.map(userImage => ({
                        id: userImage.user.id,
                        name: userImage.user.name,
                        imageBlob: userImage.imagem
                    })))
                }),
                map(userImages => userImages.map(userImageBlob => {
                    return {
                        user: userImageBlob.user,
                        imageUrl: userImageBlob.imagem && URL.createObjectURL(userImageBlob.imagem)
                    }
                }))
            )
    }

    uploadUserImage(userId: string, image: ArrayBuffer) {
        const blobImage = new Blob([image]);
        const formData = new FormData();
        formData.append('file', blobImage);
        const urlApiImage = `${this.urlApi}/${userId}/image`;
        return this.http.put(urlApiImage, formData);
    }

    getUserImage(userId: string) {
        const urlApiImage = `${this.urlApi}/${userId}/image`;
        return this.http.get(urlApiImage, { responseType: 'blob' });
    }

    login(userId: string){
        return this.http.post<AuthLoginRequest>(this.authUrlApi, {userId});
    }

    setCurrentUser(user: UserStorageInfo){
        this.userInfo.set(user);
    }

    getUserInfoSignal(){
        return this.userInfo.asReadonly();
    }

    isUserLogged(){
        return !!this.userInfo();
    }
}
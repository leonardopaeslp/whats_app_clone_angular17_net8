import { HttpClient } from "@angular/common/http";
import { Injectable, effect, inject, signal } from "@angular/core";
import { environment } from "../environments/environment";
import { User } from "./user.model";
import { catchError, forkJoin, map, of, switchMap, tap } from "rxjs";
import { localDb } from "../app/local-db/local-db";
import { UserStorageInfo } from "./user-storage-info.model";
import { AuthLoginRequest } from "./auth-login-response.models";
import { Router } from "@angular/router";
import { userImage } from "./user.image.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private urlApi = `${environment.urlApi}User`
    private authUrlApi = `${environment.urlApi}Auth`
    private userInfo = signal<UserStorageInfo | null>(null)
    private router = inject(Router);

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
        console.log(this.userInfo);
        return this.userInfo.asReadonly();
        
    }

    isUserLogged(){
        return !!this.userInfo();
    }

    trySyncLocalStorage(){
        const localStorageData = localStorage.getItem('UserData');

        if(!localStorageData){
            return
        }

        const userData: UserStorageInfo = JSON.parse(localStorageData);
        this.userInfo.set(userData);
    }

    logout(){
        this.userInfo.set(null);
        this.router.navigate(['login']);
    }

    getCurrentUserImage(){
        let test = new localDb().getUserImage(this.userInfo()!.id).pipe(map(item => !!item ? URL.createObjectURL(item) : ''));
        return test;
    }

    getLocalUsers(){
        //função usada no modal de conversação
        // para todos os itens, eu vou transformar todos eles em outro objeto. Para isso, utilizo o map do javascript em localUser. Para cada usuário dentro do array trazido, irei retornar um objeto do tipo userImage. 
        let data = new localDb().getUsers().pipe(map(localUser => localUser.map(item => ({
            user: {
                id: item.id,
                name: item.name
            },
            imageUrl: item.imageBlob && URL.createObjectURL(item.imageBlob)
        }) as userImage)));
        return data
    }

    getUserById(userId: string){
        let retorno = new localDb().getUserById(userId).pipe(
            map(item => ({
                user: {
                    id: item?.id,
                    name: item?.name
                },
                imageUrl: !!item?.imageBlob ? URL.createObjectURL(item.imageBlob) : null
            }) as userImage)
        )

        return retorno;
    }

}
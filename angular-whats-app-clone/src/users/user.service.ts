import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../environments/environment";
import { User } from "./user.model";
import { catchError, forkJoin, map, of, switchMap, tap } from "rxjs";
import { localDb } from "../app/local-db/local-db";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private urlApi = `${environment.urlApi}User`


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
}
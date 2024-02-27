import { User } from "./user.model";

export interface userImage extends User{
    user: User,
    imageUrl: string | null
}
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { UserService } from '../../user.service';
import { catchError, of, take, tap } from 'rxjs';
import { User } from '../../user.model';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

  @ViewChild('inputFile', {static: true, read: ElementRef}) inputFile!: ElementRef;
  private userService = inject(UserService);
  protected users$ = this.userService.getUsers();
  protected users: {user: User, imageUrl: string  | null}[] = [];
  private router = inject(Router);
  private lastUserIdClicked = '';

  constructor() {
    this.returnUsers();

  }
  ngOnInit(): void {

  }

  public returnUsers(){
    this.users$.pipe(take(1)).subscribe(u => {
      this.users = u;
      console.log(this.users);
      catchError(err => {
        console.log('Error:', err);
        return of([])
      })
    });


  }

  public onFileSelected(event: any){
    const selectedFiles = event.target.files as FileList;

    if(selectedFiles.length === 0) return

    const file = selectedFiles[0];

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      const fileInBytes = reader.result as ArrayBuffer;
      this.userService.uploadUserImage(this.lastUserIdClicked, fileInBytes).subscribe(() => this.returnUsers())
      this.users = [...this.users];
    }
    
  }

  public onImageButtonClicked(event: Event, userId: string){
    event.stopPropagation();
    this.lastUserIdClicked = userId;
    this.inputFile.nativeElement.click();
  }

  public login (user: User){
   this.userService.login(user.id).subscribe(res => {
    this.userService.setCurrentUser({...user, token: res.token})

    this.router.navigate(['conversations']);
   })
  }

}

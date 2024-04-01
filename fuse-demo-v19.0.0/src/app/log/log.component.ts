import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../user-service.service';
import { FormsModule} from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [FormsModule,NgIf],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent {

  @ViewChild('flip', { static: true })
  flipCheckbox!: ElementRef;

  @ViewChild('container', { static: true })
  container!: ElementRef;

  showLoginLink: boolean = false;


  togglePanel(isSignUp: boolean): void {
    if (this.container) {
      if (isSignUp) {
        this.container.nativeElement.classList.add("right-panel-active");
      } else {
        this.container.nativeElement.classList.remove("right-panel-active");
      }
    }
  }

  onFlipChange(): void {
    const isChecked = this.flipCheckbox.nativeElement.checked;
    console.log('Flip checkbox is ' + (isChecked ? 'checked' : 'unchecked'));
  }

  userData: { email: string, password: string} = {email: "", password:""}
  userDataRegistration = {
    username: '',
    email: '',
    password: ''
  };
  constructor(private user: UserServiceService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    console.log(this.userData)
    this.user.currentUserData.subscribe((userData: any) => (this.userData = userData));
  }

  changeData(event: { target: { value: any; }; }) {
    var msg = event.target.value;
    this.user.changeData(msg);
  }

  login(data: any) {
    this.user.changeData(data);
  }

  onLogin(userData: { email: string, password: string}) {
    console.log(userData)
    this.http.post('http://localhost:8080/api/auth/signin', userData)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          console.log("id " + res.id);
          localStorage.setItem('userId', res.id);
          localStorage.setItem('email', res.email);
          this.router.navigate(['/otp-verification']);
          localStorage.setItem('isLoggedIn', "true");

        },
        error: (error: any) => {
          console.log(error);
        }
      });
  }

  onSignUp(userDataRegistration: { username: string, email: string, password: string }) {
    console.log(userDataRegistration)

    this.http.post('http://localhost:8080/api/auth/signup', userDataRegistration)
      .subscribe((res) => {
        console.log(res);
      });
  }

}

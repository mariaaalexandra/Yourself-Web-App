import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../user-service.service';
import { FormsModule} from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [FormsModule,NgIf],
  templateUrl: './log.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './log.component.css'
})
export class LogComponent {

  errorMessage: string = ''; // Hold the error message
  successMessage: string = '';
  isSubmitted: boolean = false;

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
    console.log('Attempting sign up with userDataRegistration:', userDataRegistration);
    this.http.post('http://localhost:8080/api/auth/signup', userDataRegistration)
      .subscribe(
        (res: any) => {
          console.log('Sign up response:', res);
          if (res && res.message === "User registered successfully!") {
            console.log('Sign up successful!');
            this.openSuccessModal(res.message); // Open the modal with the success message
            this.clearRegistrationForm(); // Clear the registration form field
          } else {
            console.log('Sign up failed. Response:', res);
            this.openModal(res.message); // Open the modal with the error message
          }
        },
        (error) => {
          console.error('Error during sign up:', error.error);
          this.openModal(error.error.message); // Open the modal with the error message
        }
      );
  }

  // Method to open the modal
  openModal(message: string): void {
    this.errorMessage = message;
    const modal = document.getElementById('errorModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  // Method to close the modal
  closeModal(): void {
    this.errorMessage = '';
    const modal = document.getElementById('errorModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Method to open the success modal
openSuccessModal(message: string): void {
  this.successMessage = message;
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.style.display = 'block';
  }
}

// Method to close the success modal
closeSuccessModal(): void {
  this.successMessage = '';
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Method to clear the registration form fields
clearRegistrationForm(): void {
  this.userDataRegistration = {
    username: '',
    email: '',
    password: ''
  };
}
}

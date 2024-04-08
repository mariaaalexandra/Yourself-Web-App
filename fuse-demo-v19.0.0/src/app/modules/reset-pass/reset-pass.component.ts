import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserServiceService } from '../../user-service.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-pass',
  standalone: true,
  imports: [FormsModule,NgIf],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.css'
})
export class ResetPassComponent {
  otp: string[] = ['', '', '', '', '', ''];
  email!: any;
  userId: any = 0;
  user!: User;
  isOtpInvalid: boolean = false;
  baseUrl: string = 'http://localhost:8080/api/auth/forgot-password';


  constructor(private userService: UserServiceService, private router: Router, private http: HttpClient // Inject HttpClient here
) {}

  mail: string = '';


  loadUser() {
    this.userService.getCurrentUser(this.userId).subscribe(
      userData => {
        this.user = userData; // userData is of type User
        console.log(userData);
      },
      error => {
        // Handle error scenario
      }
    );
  }

  verifyOtp() {
    const fullOtp = this.otp.join('');
    this.userId = localStorage.getItem('userId');
    this.loadUser;
    console.log(this.user + " " + this.userId);
    this.email = localStorage.getItem('email');
    console.log(this.email + " " + fullOtp);
    this.userService.verifyOtp(this.email, fullOtp).subscribe({
      next: () => {
        // Handle successful verification
        this.router.navigate(['/start']);
        this.isOtpInvalid = false; // Reset on success
      },
      error: () => {
        // Handle error
        this.isOtpInvalid = true; // Set to true on error
      }
    });
  }

  processForgotPassword(email: string): void {
    console.log(email)
    localStorage.setItem("resetPassEmail", email);
    const params = { email }; // Construct the request parameters object

    this.http.post(this.baseUrl, null, { params }).subscribe(
      (response: any) => {
        console.log(response); // Handle success response here
        // Optionally, you can show a success message to the user
      },
      (error: any) => {
        console.error(error); // Handle error response here
        // Optionally, you can show an error message to the user
      }
    );

  }
}

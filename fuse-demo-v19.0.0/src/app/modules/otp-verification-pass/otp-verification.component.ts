import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserServiceService } from '../../user-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css'
})
export class OtpVerificationPassComponent {
  otp: string[] = ['', '', '', '', '', ''];
  email!: any;
  userId: any = 0;
  user!: User;
  isOtpInvalid: boolean = false;


  constructor(private userService: UserServiceService, private router: Router) {}


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
        this.router.navigate(['/create-new-pass']);
        this.isOtpInvalid = false; // Reset on success
      },
      error: () => {
        // Handle error
        this.isOtpInvalid = true; // Set to true on error
      }
    });
  }

}

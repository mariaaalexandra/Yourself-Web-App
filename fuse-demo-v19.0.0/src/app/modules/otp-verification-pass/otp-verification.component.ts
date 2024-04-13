import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../../user-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css'
})
export class OtpVerificationPassComponent implements OnInit {
  otp: string[] = ['', '', '', '', '', ''];
  email: string = '';
  isOtpInvalid: boolean = false;

  constructor(private userService: UserServiceService, private router: Router) {}

  ngOnInit() {
    this.loadInitialData();
    console.log('Email from storage:', localStorage.getItem('emailForReset'));
  }

  loadInitialData() {
    this.email = localStorage.getItem('emailForReset') || ''; // Retrieve email, fallback to empty if not found

    if (!this.email) {
      console.error('User ID or email not available from storage');
      // Consider redirecting the user to an error page or display a message
    }
  }

  verifyOtp() {
    const fullOtp = this.otp.join('');
    if (!fullOtp) {
      console.error('OTP is empty');
      this.isOtpInvalid = true; // Set flag for invalid OTP
      return;
    }

    console.log('Verifying OTP for email:', this.email);
    console.log('OTP to verify:', fullOtp);

    this.userService.verifyOtp(this.email, fullOtp).subscribe({
      next: () => {
        console.log('OTP Verification Success');
        this.router.navigate(['/create-new-pass']);
        this.isOtpInvalid = false; // Reset flag on success
      },
      error: error => {
        console.error('OTP Verification Failed:', error);
        this.isOtpInvalid = true; // Set flag for invalid OTP
      }
    });
  }
}

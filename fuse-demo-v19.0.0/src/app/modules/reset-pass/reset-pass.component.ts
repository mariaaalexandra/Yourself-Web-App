import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserServiceService } from '../../user-service.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-reset-pass',
  standalone: true,
  imports: [FormsModule,NgIf],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ResetPassComponent {
  otp: string[] = ['', '', '', '', '', ''];
  email!: any;
  user!: User;
  isOtpInvalid: boolean = false;
  baseUrl: string = 'http://localhost:8080/api/auth/forgot-password';


  constructor(private userService: UserServiceService, private router: Router, private http: HttpClient // Inject HttpClient here
) {}

mail: string = '';

// Add a boolean variable to control the modal visibility
showThankYouModal: boolean = false;
// Add a boolean variable to control the error modal visibility
showErrorModal: boolean = false;
errorMessage: string = '';

verifyOtp() {
  const fullOtp = this.otp.join('');
  if (!this.email || !fullOtp) {
    console.error('Email or OTP is missing or empty');
    return;
  }

  console.log('Attempting to verify OTP:', fullOtp, 'for email:', this.email);

  this.userService.verifyOtp(this.email, fullOtp).subscribe({
    next: () => {
      console.log('OTP Verification Success');
      this.router.navigate(['/start']);
      this.isOtpInvalid = false;
    },
    error: (error) => {
      console.error('OTP Verification Failed:', error);
      this.isOtpInvalid = true;
    }
  });
}

processForgotPassword(email: string) {
  localStorage.setItem("emailForReset",email);
  console.log("emailForReset " + email);
  if (!email) {
    console.error('Email is missing for forgot password process');
    return;
  }
  const params = new HttpParams().set('email', email);
  this.http.post(this.baseUrl, null, { params }).subscribe(
    response => {
      console.log('Forgot password response:', response);
      this.openThankYouModal();
    },
    error => {
      console.error('Error occurred while processing forgot password request:', error);
      this.openErrorModal(error.message || 'Error occurred while processing your request.');
    }
  );
}

// Method to open the error modal
openErrorModal(message: string) {
  this.errorMessage = message;
  this.showErrorModal = true;
}

// Method to close the error modal
closeErrorModal() {
  this.showErrorModal = false;
}

// Method to open the modal
openThankYouModal() {
  this.showThankYouModal = true;
}

// Method to close the modal
closeThankYouModal() {
  this.showThankYouModal = false;
  this.router.navigate(['/reset-pass-verification'])
}
}
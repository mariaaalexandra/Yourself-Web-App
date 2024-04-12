import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConstructiveFeedbackService } from './constructivefeedback.component.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'constructivefeedback',
  templateUrl: './constructivefeedback.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule]
})
export class ConstructiveFeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  showThankYouModal = false;  // Control visibility of the thank you modal
  constructor(private fb: FormBuilder, private feedbackService: ConstructiveFeedbackService) {}

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      liked: ['', Validators.required],
      disliked: ['', Validators.required],
      suggestions: ['', Validators.required],
      rating: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      this.feedbackService.submitFeedback(this.feedbackForm.value).subscribe({
        next: (response) => {
          console.log('Feedback submitted', response);
          this.showThankYouModal = true;  // Show the modal on successful submission
          this.feedbackForm.reset();  // Clear the form
        },
        error: (error) => console.error('Error:', error)
      });
    }
  }

  closeThankYouModal(): void {
    this.showThankYouModal = false;  // Hide the modal
  }
}
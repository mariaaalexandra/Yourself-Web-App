import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { FormControl, FormGroup,FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { TransactionService } from './wallet-service.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-wallet-details',
  standalone: true,
  providers: [DatePipe],
  imports: [CommonModule,FormsModule,NgIf,MatButtonModule,MatIconModule,MatDialogModule,MatFormFieldModule,ReactiveFormsModule,MatDatepickerModule, MatInputModule,MatSelectModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class DetailsComponent {
    categories: string[] = [
        'Investments',
        'House expenses',
        'Credit loan',
        'Income',
        'Business',
        'Free Time',
        'Presents',
        'Holidays'
      ];

    paymentTypes: string[] = [
        'Credit Card',
        'Debit Card',
        'Cash',
        'Meal Vouchers',
        'Present Vouchers',
        'Holiday Vouchers'
    ]

    transactionForm: FormGroup;

  ngOnInit(): void {
    this.transactionForm = new FormGroup({
      date: new FormControl(''),
      time: new FormControl(''),
      description: new FormControl(''),
      category: new FormControl(''),
      paymentType: new FormControl(''),
      balance: new FormControl('')
    });
  }

  constructor(private transactionService: TransactionService,
    private datePipe: DatePipe,
    public dialog: MatDialog

  ) {}

  submit(): void {
    if (this.transactionForm.valid) {

      const formattedData = {
        ...this.transactionForm.value,
        date: this.datePipe.transform(this.transactionForm.value.date, 'yyyy-MM-dd'),
      };

      this.transactionService.createTransaction(formattedData).subscribe({
        next: (response) => {
          console.log('Transaction created:', response);
          this.dialog.open(TransactionDialogComponent, {
            data: {
              message: 'Transaction created successfully!'
            }
          });
        },
        error: (error) => console.error('Error:', error)
      });
    }
  }


}

@Component({
    selector: 'app-transaction-dialog',
    template: `
      <div class="dialog-container">
        <h1 class="dialog-title">Transaction Status</h1>
        <p class="dialog-content">{{ data.message }}</p>
        <button mat-raised-button color="primary" (click)="closeAllDialogs()">OK</button>
      </div>
    `,
    styles: [`
      .dialog-container {
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
      }
      .dialog-title {
        margin-bottom: 20px;
        color: #333;
        font-size: 24px;
      }
      .dialog-content {
        margin-bottom: 20px;
        color: #666;
        font-size: 16px;
      }
      button {
        min-width: 100px;
        transition: background-color 0.3s, color 0.3s;
      }
      button:hover {
        background-color: #0056b3;
        color: white;
      }
    `]
  })
  export class TransactionDialogComponent {
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: { message: string },
      private dialog: MatDialog // Inject MatDialog to manage dialogs
    ) {}

    closeAllDialogs() {
      this.dialog.closeAll(); // This method closes all currently open dialogs
    }
  }

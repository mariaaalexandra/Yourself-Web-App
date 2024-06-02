import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetailsComponent } from './details.component';

import { TransactionService } from './wallet-service.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [FormsModule,NgIf,MatButtonModule,MatIconModule,MatDialogModule,NgFor],
  templateUrl: './wallet.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class WalletComponent implements OnInit{

    private apiUrl = 'http://localhost:8080/api/transactions'; // Adjust the URL based on your backend setup
    transactions: Transaction[] = [];

    constructor(

        private _matDialog: MatDialog,
        private transactionService: TransactionService

    )
    {
    }

    ngOnInit() {
        this.transactionService.getAllTransactions().subscribe({
          next: (data) => this.transactions = data,
          error: (err) => console.error(err),
          complete: () => console.log('Transaction fetch complete')
        });
        console.log(this.transactions)
      }

    addNewTransaction(): void
    {
        this._matDialog.open(DetailsComponent, {
            autoFocus: false,
            data     : {
                note: {},
            },
        });
    }

}
export class Transaction {
    id?: number; // Optional because it might not be set when creating a new transaction
    date: string;
    time: string;
    description: string;
    category: string;
    paymentType: string;
    balance: number;

    constructor(
      date: string,
      time: string,
      description: string,
      category: string,
      paymentType: string,
      balance: number,
      id?: number
    ) {
      this.date = date;
      this.time = time;
      this.description = description;
      this.category = category;
      this.paymentType = paymentType;
      this.balance = balance;
      this.id = id;
    }
  }

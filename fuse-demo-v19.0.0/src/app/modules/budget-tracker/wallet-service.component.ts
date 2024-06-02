// transaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Transaction } from './transaction.model'; // Adjust the path as necessary
import { Budget } from './budget.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/transactions'; // Adjust the URL based on your backend setu

  private url = 'http://localhost:8080/api/transactions/category-stats'; // Replace with your actual API URL

  private bUrl = 'http://localhost:8080/api/transactions/monthly';

  constructor(private http: HttpClient) { }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }



  createTransaction(transactionData: Transaction): Observable<any> {
    return this.http.post(this.apiUrl, transactionData);
  }

  getCategoryStats(): Observable<number[]> {
    return this.http.get<number[]>(`${this.url}`);
  }

  getMonthlyCategoryStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.bUrl}`).pipe(
      map(response => {
        const categories = ['Investments', 'House expenses', 'Credit loan', 'Income',
                            'Business', 'Free Time', 'Presents', 'Holidays']; // Match these with backend response order
        return response.map((data, index) => ({
          name: categories[index],
          data: data
        }));
      })
    );
  }

  private api = 'http://localhost:8080/api/transactions/budgets/totalIncome'; // Update to match your API URL

  getTotalIncomeByUserId(userId: number): Observable<number> {
    return this.http.get<number>(`${this.api}?userId=${userId}`);
  }

  private aUrl = 'http://localhost:8080/api/transactions/budgets'; // URL to web API

  addBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.aUrl, budget);
  }

  private apUrl = 'http://localhost:8080/api/transactions/transactions/last5';  // Update to match your API URL


  getLastFiveTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apUrl);
  }
}

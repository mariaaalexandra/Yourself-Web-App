// transaction.model.ts
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

export class Budget {
    userId?: number;
    creditCard: number;
    debitCard: number;
    mealVouchers: number;
    holidayVouchers: number;
    totalIncome?: number;

    constructor({
      creditCard = 0,
      debitCard = 0,
      mealVouchers = 0,
      holidayVouchers = 0,
      userId,
      totalIncome
    }) {
      this.userId = userId;
      this.creditCard = creditCard;
      this.debitCard = debitCard;
      this.mealVouchers = mealVouchers;
      this.holidayVouchers = holidayVouchers;
      this.totalIncome = totalIncome;
    }
  }

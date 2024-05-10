import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import Chart, { ChartData, ChartOptions } from 'chart.js/auto';

@Component({
  selector: 'app-investmentgrowth',
  templateUrl: './investmentgrowth.component.html',
  styleUrls: ['./investmentgrowth.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})

export class investmentgrowthComponent implements AfterViewInit {
  @ViewChild('myChart') myChartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  initialDeposit = 0;
  contributionAmount = 0.00;
  estimatedReturn = 0.00; // In percentage
  investmentTimespan = 1; // In years
  contributionPeriod = "4"; // Default to monthly contributions
  currency = "2"; // Default to monthly contributions
  currencyResult = 'USD';
  investedMoney = 0.00;
  accruedInterest = 0.00;
  investmentYearly: number[] = []; // Array to store yearly investment principal
  interestYearly: number[] = []; // Array to store yearly accrued interest
  movingSum = 0.00;
  textPlaceholder = "";

  ngAfterViewInit(): void {
    this.initChart();
  }
  
  initChart(): void {
    const ctx = this.myChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: this.getChartData(),
        options: this.getChartOptions()
      });
      console.log('Chart initialized');
    }
  }
  
  updateChart(): void {
    if (this.chart) {
      this.chart.data = this.getChartData();
      this.chart.update();
      console.log('Chart updated');

      this.updateTextPlaceholder();
    }
  }

  onInputChange(): void {
    this.calculateAnnualInvestment();
    this.updateChart();
  }
  
  getChartData(): ChartData {
    console.log('Generating chart data');
    const labels = Array.from({ length: this.investmentTimespan }, (_, i) => `${new Date().getFullYear() + i}`);
    console.log('Chart Labels (Years):', labels);
    console.log('Investment Yearly:', this.investmentYearly);
    console.log('Interest Yearly:', this.interestYearly);
  
    return {
      labels: labels,
      datasets: [
        {
          label: 'Principal',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          data: this.investmentYearly,
          stack: 'Stack 0',
        },
        {
          label: 'Interest',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          data: this.interestYearly,
          stack: 'Stack 0',
        }
      ]
    };
  }
  
  getChartOptions(): ChartOptions {
    return {
      maintainAspectRatio: false,
      aspectRatio: 0.5, // Adjust the aspect ratio as needed
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `$${value}`
          }
        }
      },
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    };
  }
  
  calculateAnnualInvestment() {
    console.log('Calculating annual investments');
    let contributionFrequency = +this.contributionPeriod === 3 ? 12 : 1;
    let annualRate = +this.estimatedReturn / 100;
    let currentPrincipal = +this.initialDeposit;
    let currentInterest = 0;
  
    this.investmentYearly = [];
    this.interestYearly = [];
    this.movingSum = +this.initialDeposit/100*100+this.contributionAmount/100*100 * contributionFrequency/100*100;
  
    for (let year = 1; year <= this.investmentTimespan/100*100; year++) {
      const annualContribution = this.contributionAmount/100*100 * contributionFrequency;
      let annualInvested = currentPrincipal + annualContribution;
      console.log("MOVING SUM" + this.movingSum);
      let annualInterest = +(+this.movingSum/100*100)* +annualRate/100*100;

      currentPrincipal = +parseFloat((currentPrincipal + annualContribution).toFixed(2));
      currentInterest += +parseFloat(annualInterest.toFixed(2));
      this.movingSum += +annualContribution/100*100+annualInterest/100*100;
  
      this.investmentYearly.push(parseFloat(annualInvested.toFixed(2)));
      this.interestYearly.push(parseFloat(currentInterest.toFixed(2)));
      console.log(`Year ${year}: Invested - ${annualInvested.toFixed(2)}, Interest - ${currentInterest.toFixed(2)}`);
    }
  }

  updateValue(field: string, operation: string, step: number): void {
    const currentValue = parseFloat(this[field]);
    if (operation === 'sub' && currentValue - step >= 0) {
      this[field] = (currentValue - step).toFixed(2); // Limit to 2 decimal places
    } else if (operation === 'add') {
      this[field] = (currentValue + step).toFixed(2); // Limit to 2 decimal places
    }
    // Invoke this method in your existing update and initialization methods
    this.calculateAnnualInvestment();
    this.updateChart();
  }

  onTimeSpanChange(): void {
    console.log('Investment Time Span Changed:', this.investmentTimespan);
    this.calculateAnnualInvestment();
    this.updateChart();
  }

  updateTextPlaceholder(): void {
    const lastInvestmentIndex = this.investmentYearly.length - 1;
    const totalInvested = this.investmentYearly[lastInvestmentIndex];
    const totalInterest = this.interestYearly[lastInvestmentIndex];
    const finalBalance = totalInvested + totalInterest;
  
    this.textPlaceholder = `Over the course of ${this.investmentTimespan} years, you invested a total of $${this.currencyResult}${totalInvested.toFixed(2)}, and earned $${this.currencyResult}${totalInterest.toFixed(2)} in interest, bringing your total balance to $${this.currencyResult}${finalBalance.toFixed(2)}`;
  }
  
  calculateFutureValue(years: number = this.investmentTimespan): number {
    // Currency
    this.currencyResult = this.currency === "1" ? 'EUR' : 'USD';
    
    // Contribution Rate
    let contributionRate = 0.00;
    contributionRate = this.contributionAmount/100*100;
    
    // Anual rate
    const annualRate = this.estimatedReturn/100*100;

    // Total months
    const totalMonths = years * 12;

    // Start calc

    // Future value
    let futureValue = this.initialDeposit/100*100;

    // Contribution Frequency
    const contributionFrequency = this.contributionPeriod === "3" ? 12 : 1; // Monthly or Annually

    // Yearly compound
    if (this.contributionPeriod === "3") {
      // Monthly rate
      let accumulatedAmount = this.initialDeposit;

      for (let i = 0; i < years; i++) {
        
          accumulatedAmount = (accumulatedAmount/100*100 + contributionRate*12/100*100)/100*100;
          accumulatedAmount = (accumulatedAmount/100*100 * (1+annualRate/10000*100))/100*100;
        }

      futureValue = accumulatedAmount/100*100;
    } else {
      // Annual rate
      let accumulatedAmount = this.initialDeposit;

      for (let i = 0; i < years; i++) {
          accumulatedAmount = (accumulatedAmount/100*100 + contributionRate/100*100)/100*100;
          accumulatedAmount = (accumulatedAmount/100*100 * (1+annualRate/10000*100))/100*100;
        }

      futureValue = accumulatedAmount/100*100;
    }

    return futureValue/100*100;
  }
}
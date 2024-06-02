import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexTitleSubtitle,
    ApexStroke,
    ApexDataLabels,
    ApexTooltip,
    ApexPlotOptions,
    ApexFill,
    ApexYAxis
  } from 'ng-apexcharts';
import { TransactionService } from './wallet-service.component';
import { Budget } from './budget.model';
import { Transaction } from './transaction.model';

  export type ChartOptions2 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis | ApexYAxis[];
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    title: ApexTitleSubtitle;
    colors?: string[];

  };

@Component({
  selector: 'app-budget-tracker',
  standalone: true,
  imports: [FormsModule,NgIf,NgApexchartsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './index.html',
  styleUrls: [
  ],
  changeDetection: ChangeDetectionStrategy.Default,
})

export class BudgetTrackerComponent {
    form: FormGroup;
    showModal: boolean = false;
    totalIncome: number | undefined;
    transactions: Transaction[] = [];



    constructor(private transactionService: TransactionService, private fb: FormBuilder) {
        this.createForm();
        this.fetchLastFiveTransactions();

    }
    chartData: any[] = [];
    public chartOptions: Partial<ChartOptions2>

    createForm() {
        this.form = this.fb.group({
          creditCard: [''],
          debitCard: [''],
          mealVouchers: [''],
          holidayVouchers: ['']
        });
    }

    fetchLastFiveTransactions(): void {
        this.transactionService.getLastFiveTransactions().subscribe({
          next: (data) => this.transactions = data,
          error: (err) => console.error('Failed to get transactions:', err),
          complete: () => console.log('Transaction fetch completed' + JSON.stringify(this.transactions))
        });
      }

    onSubmit() {
        if (this.form.valid) {
          const newBudget: Budget = new Budget(this.form.value);
          newBudget.userId=Number(localStorage.getItem("userId"))
          this.transactionService.addBudget(newBudget).subscribe({
            next: (budget) => {
              this.totalIncome = budget.totalIncome;
            },
            error: (error) => console.error('Failed to add budget', error)
          });
        }
        this.closeModal();

      }


      openModal() {
        this.showModal = true;
      }

      closeModal() {
        this.showModal = false;
      }

      closeModalAndSave() {
        console.log('Saving data:', this.form.value);
        this.closeModal();
    }

    loadTotalIncome(userId: number): void {
        this.transactionService.getTotalIncomeByUserId(userId).subscribe({
          next: (income) => {
            this.totalIncome = income;
            console.log('Total Income:', this.totalIncome);
          },
          error: (error) => console.error('Error fetching total income:', error),
          complete: () => console.log('Fetch total income complete')
        });
      }

    ngOnInit(): void {
        console.log(localStorage.getItem("userId"));
        this.loadTotalIncome(Number(localStorage.getItem("userId")));  // example user ID

        this.getTransactionCounts();
        this.transactionService.getMonthlyCategoryStats().subscribe(data => {
            this.chartData = data;
            console.log(this.chartData);
            this.setupChartOptions();

          });
      }

      getTransactionCounts(): void {
        this.transactionService.getCategoryStats().subscribe(
            stats => {
            this.chartOptions1.series = stats;
            console.log('Transaction counts:', stats);
          });
      }

      chartOptions1: any = {
        chart: {
          type: 'pie',
          height: 380
        },
        labels: [
          "Investments",
          "House expenses",
          "Credit loan",
          "Income",
          "Business",
          "Free Time",
          "Presents",
          "Holidays"
        ],
        colors: ['#E3C8ED', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#008000'], // Set custom colors here
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };

    setupChartOptions(): void {
        this.chartOptions = {
          series: this.chartData,
          chart: {
            type: 'bar',
            height: 350
          },
          colors: ['#E3C8ED', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#008000'], // Custom colors for each series
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          },
          yaxis: {
            title: {
              text: '$ (thousands)'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return "$ " + val + " thousands";
              }
            }
          }
        };
      }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-finance-gadget',
  template: `
    <div class="gadget finance">
      <h4>Finance Overview</h4>
      <p>Content specific to finance data...</p>
    </div>
  `,
  styles: [`
    .finance {
      border: 1px solid #dee2e6;
      border-radius: 8px;
      background-color: #f8f9fa;
      padding: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,.1);
    }

    h4 {
      margin-top: 0;
    }
  `],
  standalone: true,
})
export class FinanceGadgetComponent {}

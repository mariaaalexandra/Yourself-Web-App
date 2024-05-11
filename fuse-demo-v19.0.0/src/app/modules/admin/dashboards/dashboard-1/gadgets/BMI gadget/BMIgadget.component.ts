import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';

@Component({
  selector: 'BMIgadget',
  templateUrl: './BMIgadget.component.html',
  styleUrls: ['./BMIgadget.component.scss'],
  standalone: true
})

export class BMIComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.addInputListeners();
    this.setDefaultSystem();
  }

  private setDefaultSystem() {
    const metricSystem = document.querySelector('.stats') as HTMLElement;
    const imperialSystem = document.querySelector('.stats_imperial') as HTMLElement;
    metricSystem.style.display = 'flex';
    imperialSystem.style.display = 'none';
  }

  private addInputListeners() {
    document.getElementById('metric')?.addEventListener('change', () => {
      this.toggleSystem(true);
    });

    document.getElementById('imperial')?.addEventListener('change', () => {
      this.toggleSystem(false);
    });

    ['height', 'weight', 'height_ft', 'height_in', 'weight_st', 'weight_lbs', 'age', 'gender', 'age2', 'gender2'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        this.calculateBMI();
      });
    });
  }

  private toggleSystem(isMetric: boolean) {
    const metricSystem = document.querySelector('.stats') as HTMLElement;
    const imperialSystem = document.querySelector('.stats_imperial') as HTMLElement;
    metricSystem.style.display = isMetric ? 'flex' : 'none';
    imperialSystem.style.display = isMetric ? 'none' : 'grid';
    this.resetInputs();
  }

  private resetInputs() {
    const resultElement = document.getElementById('result');
    const idealBMI = document.getElementById('ideal_bmi_info');
    const topBMI = document.getElementById('top_bmi');
  
    resultElement.innerText = '';
    idealBMI.innerText = '';
    topBMI.innerText = `Your BMI is...`;
  
    const welcome = document.getElementById('welcome');
    const welcomeMore = document.getElementById('welcome_more');
  
    welcome.innerText = 'Welcome!';
    welcomeMore.innerText = 'Enter your height and weight to see your BMI result here.';
  }

  private calculateBMI() {
    const metricRadio = document.getElementById('metric') as HTMLInputElement;
    if (metricRadio.checked) {
      this.calculateBMI_Metric();
    } else {
      this.calculateBMI_Imperial();
    }
  }

  private calculateBMI_Metric() {
    const heightInput = document.getElementById('height') as HTMLInputElement;
    const weightInput = document.getElementById('weight') as HTMLInputElement;
    const resultElement = document.getElementById('result');
    const idealBMI = document.getElementById('ideal_bmi_info');
    const welcome = document.getElementById('welcome') as HTMLElement;
    const welcomeMore = document.getElementById('welcome_more') as HTMLElement;

    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (!isNaN(height) && !isNaN(weight)) {
      const meters = height / 100;
      const bmi = weight / (meters * meters);

      const minIdealWeight = 18.5 * (meters * meters);
      const maxIdealWeight = 24.9 * (meters * meters);
      idealBMI.innerText = `Recommended weight range: ${minIdealWeight.toFixed(1)} kg - ${maxIdealWeight.toFixed(1)} kg based on your height.`;

      const ageInput = document.getElementById('age') as HTMLInputElement;
      const genderSelect = document.getElementById('gender') as HTMLSelectElement;
      this.adjustBMIForAgeAndGender(bmi, ageInput, genderSelect);
      welcome.style.display = "none";
      welcomeMore.style.display = "none";
      this.cdr.detectChanges();
    }
  }

  private calculateBMI_Imperial() {
    const heightFtInput = document.getElementById('height_ft') as HTMLInputElement;
    const heightInInput = document.getElementById('height_in') as HTMLInputElement;
    const weightStInput = document.getElementById('weight_st') as HTMLInputElement;
    const weightLbsInput = document.getElementById('weight_lbs') as HTMLInputElement;
    const resultElement = document.getElementById('result');
    const idealBMI = document.getElementById('ideal_bmi_info');
    const welcome = document.getElementById('welcome') as HTMLElement;
    const welcomeMore = document.getElementById('welcome_more') as HTMLElement;

    const heightFt = parseFloat(heightFtInput.value);
    const heightIn = parseFloat(heightInInput.value);
    const weightSt = parseFloat(weightStInput.value);
    const weightLbs = parseFloat(weightLbsInput.value);

    if (!isNaN(heightFt) && !isNaN(heightIn) && !isNaN(weightSt) && !isNaN(weightLbs)) {
      const heightInMeters = ((heightFt * 12) + heightIn) / 39.37;
      const weightInKg = (weightSt * 6.35029) + (weightLbs * 0.453592);
      const bmi = weightInKg / (heightInMeters * heightInMeters);

      const minIdealWeight = 18.5 * (heightInMeters * heightInMeters) / 0.453592; // Convert kg back to lbs for user understanding
      const maxIdealWeight = 24.9 * (heightInMeters * heightInMeters) / 0.453592;
      idealBMI.innerText = `Recommended weight range: ${minIdealWeight.toFixed(1)} lbs - ${maxIdealWeight.toFixed(1)} lbs based on your height.`;

      const ageInput = document.getElementById('age2') as HTMLInputElement;
      const genderSelect = document.getElementById('gender2') as HTMLSelectElement;
      this.adjustBMIForAgeAndGender(bmi, ageInput, genderSelect);
      welcome.style.display = "none";
      welcomeMore.style.display = "none";
      this.cdr.detectChanges();
    }
  }

  private adjustBMIForAgeAndGender(bmi: number, ageInput, genderSelect) {
    const age = parseInt(ageInput.value);
    const gender = genderSelect.value;
    const idealBMI = document.getElementById('ideal_bmi_info');
    const topBMI = document.getElementById('top_bmi') as HTMLElement;
    const welcome = document.getElementById('welcome');
    const welcomeMore = document.getElementById('welcome_more');

    let healthMessage = '';
    let specificAdvice = '';

    // General health status based on BMI
    if (bmi < 18.5) {
      healthMessage = 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      healthMessage = 'Healthy weight';
    } else {
      healthMessage = 'Overweight or Obese';
    }

    // Additional specific advice based on age and gender
    if (gender === 'Female' && age >= 50) {
      specificAdvice = 'Be mindful of bone density and muscle mass.';
    } else if (gender === 'Male' && age >= 50) {
      specificAdvice = 'Consider monitoring testosterone levels and cardiovascular health.';
    }

    if (age < 20) {
      specificAdvice += ' Growing children and teenagers may have different BMI standards.';
    } else if (age >= 65) {
      specificAdvice += ' Older adults may have different muscle and fat compositions affecting BMI interpretation.';
    } else {
      specificAdvice += ' Your age and gender aren`t affected by extra factors.';
    }

    // Update the display with detailed advice
    idealBMI.innerHTML = `
      <strong>Your BMI: ${bmi.toFixed(1)}</strong><br>
      Status: ${healthMessage}<br>
      Advice: ${specificAdvice}<br>
      Gender: ${gender}, Age: ${age}
    `;
    topBMI.style.display = "block";
    welcome.style.display = "none";
    welcomeMore.style.display = "none";

    this.cdr.detectChanges();
  }
}
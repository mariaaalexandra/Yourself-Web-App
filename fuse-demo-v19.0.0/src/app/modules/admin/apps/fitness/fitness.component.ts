import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fitness',
  templateUrl: './fitness.component.html',
  styleUrls: ['./fitness.component.scss'],
  standalone: true
})

export class FitnessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const heightInput = document.getElementById('height') as HTMLInputElement;
    const weightInput = document.getElementById('weight') as HTMLInputElement;

    const heightFtInput = document.getElementById('height_ft') as HTMLInputElement;
    const heightInInput = document.getElementById('height_in') as HTMLInputElement;
    const weightStInput = document.getElementById('weight_st') as HTMLInputElement;
    const weightLbsInput = document.getElementById('weight_lbs') as HTMLInputElement;

    const metricRadio = document.getElementById('metric') as HTMLInputElement;
    const imperialRadio = document.getElementById('imperial') as HTMLInputElement;

    const metricSystem = document.querySelector('.stats') as HTMLElement;
    const imperialSystem = document.querySelector('.stats_imperial') as HTMLElement;

    const topBMI = document.getElementById('top_bmi') as HTMLElement;
    const resultElement = document.getElementById('result');
    const idealBMI = document.getElementById('ideal_bmi_info');

    const welcome = document.getElementById('welcome');
    const welcomeMore = document.getElementById('welcome_more');

    heightInput.addEventListener('input', this.calculateBMI_Metric.bind(this));
    weightInput.addEventListener('input', this.calculateBMI_Metric.bind(this));

    heightFtInput.addEventListener('input', this.calculateBMI_Imperial.bind(this));
    heightInInput.addEventListener('input', this.calculateBMI_Imperial.bind(this));

    weightStInput.addEventListener('input', this.calculateBMI_Imperial.bind(this));
    weightLbsInput.addEventListener('input', this.calculateBMI_Imperial.bind(this));

    metricRadio.addEventListener('change', () => {
      if (metricRadio.checked) {
        metricSystem.style.display = 'flex';
        imperialSystem.style.display = 'none';
        welcome.style.display = "block";
        welcomeMore.style.display = "block";
        resultElement.innerText = "";
        topBMI.style.display = "none";
        idealBMI.style.display = "none";
      }
    });

    imperialRadio.addEventListener('change', () => {
      if (imperialRadio.checked) {
        imperialSystem.style.display = 'grid';
        metricSystem.style.display = 'none';
        welcome.style.display = "block";
        welcomeMore.style.display = "block";
        resultElement.innerText = "";
        topBMI.style.display = "none";
        idealBMI.style.display = "none";
      }
    });
  }

  calculateBMI_Metric() {
    const heightInput = document.getElementById('height') as HTMLInputElement;
    const weightInput = document.getElementById('weight') as HTMLInputElement;
    const resultElement = document.getElementById('result');
    const idealBMI = document.getElementById('ideal_bmi_info');
  
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
  
    const topBMI = document.getElementById('top_bmi') as HTMLElement;
    const welcome = document.getElementById('welcome');
    const welcomeMore = document.getElementById('welcome_more');
  
    if (!isNaN(height) && !isNaN(weight)) {
      const meters = height / 100;
      const bmi = weight / (meters * meters);
      const minBMI = 18.5 * (meters * meters);
      const maxBMI = 24.9 * (meters * meters);
      resultElement.innerText = bmi.toFixed(1);
      if (bmi >= 18.5 && bmi <= 24.9) {
        const idealM = 'Your BMI suggests you’re a healthy weight.';
        idealBMI.innerText = `${idealM} Your ideal weight is between ${minBMI.toFixed(1)}kgs. - ${maxBMI.toFixed(1)}kgs.`;
      } else {
        const idealMNot = 'Your BMI suggests you’re not a healthy weight.';
        idealBMI.innerText = `${idealMNot} Your ideal weight is between ${minBMI.toFixed(1)}kgs. - ${maxBMI.toFixed(1)}kgs.`;
      }
      topBMI.style.display = "block";
      idealBMI.style.display = "block";
      welcome.style.display = "none";
      welcomeMore.style.display = "none";
    } else {
      resultElement.innerText = "";
      idealBMI.innerText = "";
      welcome.style.display = "block";
      welcomeMore.style.display = "block";
    }
  }

  calculateBMI_Imperial() {
    const heightFtInput = document.getElementById('height_ft') as HTMLInputElement;
    const heightInInput = document.getElementById('height_in') as HTMLInputElement;
    const weightStInput = document.getElementById('weight_st') as HTMLInputElement;
    const weightLbsInput = document.getElementById('weight_lbs') as HTMLInputElement;
    const resultElement = document.getElementById('result');
    const idealBMI = document.getElementById('ideal_bmi_info');
  
    const heightFt = parseFloat(heightFtInput.value);
    const heightIn = parseFloat(heightInInput.value);
    const weightSt = parseFloat(weightStInput.value);
    const weightLbs = parseFloat(weightLbsInput.value);
  
    const topBMI = document.getElementById('top_bmi') as HTMLElement;
    const welcome = document.getElementById('welcome');
    const welcomeMore = document.getElementById('welcome_more');
  
    if (!isNaN(heightFt) && !isNaN(weightSt) && !isNaN(heightIn) && !isNaN(weightLbs)) {
      const imperFt = (heightFt * 30.48) / 100;
      const imperIn = (heightIn * 2.54) / 100;
      const imperSt = weightSt * 6.35;
      const imperLbs = weightLbs * 0.43;
      const imperW = imperSt + imperLbs;
      const imeprH = imperFt + imperIn;
      const bmi = imperW / (imeprH * imeprH);
      const minBMI = 18.5 * (imeprH * imeprH) / 6.35;
      const maxBMI = 24.9 * (imeprH * imeprH) / 6.35;
      resultElement.innerText = bmi.toFixed(1);
      if (bmi >= 18.5 && bmi <= 24.9) {
        const idealM = 'Your BMI suggests you’re a healthy weight.';
        idealBMI.innerText = `${idealM} Your ideal weight is between ${minBMI.toFixed(1)}st. - ${maxBMI.toFixed(1)}st.`;
      } else {
        const idealMNot = 'Your BMI suggests you’re not a healthy weight.';
        idealBMI.innerText = `${idealMNot} Your ideal weight is between ${minBMI.toFixed(1)}st. - ${maxBMI.toFixed(1)}st.`;
      }
      topBMI.style.display = "block";
      idealBMI.style.display = "block";
      welcome.style.display = "none";
      welcomeMore.style.display = "none";
    } else {
      resultElement.innerText = "";
      welcome.style.display = "block";
      welcomeMore.style.display = "block";
    }
  }
}

import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { BMIComponent } from './BMI.component';
import { BMIService } from './BMI.component.service';

export default [
    {
        path     : '',
        component: BMIComponent,
        resolve  : {
            data: () => inject(BMIService).getData(),
        },
    },
] as Routes;

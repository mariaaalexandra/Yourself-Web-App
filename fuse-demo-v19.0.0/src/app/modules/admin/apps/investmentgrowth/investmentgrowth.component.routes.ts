import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { investmentgrowthComponent } from './investmentgrowth.component';
import { investmentgrowthService } from './investmentgrowth.component.service';

export default [
    {
        path     : '',
        component: investmentgrowthComponent,
        resolve  : {
            data: () => inject(investmentgrowthService).getData(),
        },
    },
] as Routes;

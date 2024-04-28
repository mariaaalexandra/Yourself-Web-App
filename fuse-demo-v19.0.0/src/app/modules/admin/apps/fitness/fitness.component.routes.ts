import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { FitnessComponent } from 'app/modules/admin/apps/fitness/fitness.component';
import { FitnessService } from './fitness.component.service';

export default [
    {
        path     : '',
        component: FitnessComponent,
        resolve  : {
            data: () => inject(FitnessService).getData(),
        },
    },
] as Routes;

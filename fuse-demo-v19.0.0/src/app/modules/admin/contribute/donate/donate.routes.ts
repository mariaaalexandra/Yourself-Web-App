import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { donateComponent } from 'app/modules/admin/contribute/donate/donate.component';
import { DonateService } from 'app/modules/admin/contribute/donate/donate.service';

export default [
    {
        path     : '',
        component: donateComponent,
        resolve  : {
            data: () => inject(DonateService).getData(),
        },
    },
] as Routes;

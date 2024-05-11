import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { opensourcecontributionsComponent } from 'app/modules/admin/contribute/opensourcecontributions/opensourcecontributions.component';
import { opensourcecontributionsService } from 'app/modules/admin/contribute/opensourcecontributions/opensourcecontributions.service';

export default [
    {
        path     : '',
        component: opensourcecontributionsComponent,
        resolve  : {
            data: () => inject(opensourcecontributionsService).getData(),
        },
    },
] as Routes;

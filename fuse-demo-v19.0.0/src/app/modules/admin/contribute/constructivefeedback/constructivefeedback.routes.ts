import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { constructivefeedbackComponent } from 'app/modules/admin/contribute/constructivefeedback/constructivefeedback.component';
import { constructivefeedbackService } from 'app/modules/admin/contribute/constructivefeedback/constructivefeedback.service';

export default [
    {
        path     : '',
        component: constructivefeedbackComponent,
        resolve  : {
            data: () => inject(constructivefeedbackService).getData(),
        },
    },
] as Routes;

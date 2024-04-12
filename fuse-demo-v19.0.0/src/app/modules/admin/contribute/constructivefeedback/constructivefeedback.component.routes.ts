import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ConstructiveFeedbackComponent } from 'app/modules/admin/contribute/constructivefeedback/constructivefeedback.component';
import { ConstructiveFeedbackService } from './constructivefeedback.component.service';

export default [
    {
        path     : '',
        component: ConstructiveFeedbackComponent,
        resolve  : {
            data: () => inject(ConstructiveFeedbackService).getData(),
        },
    },
] as Routes;

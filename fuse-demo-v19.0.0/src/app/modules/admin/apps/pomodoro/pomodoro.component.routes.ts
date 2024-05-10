import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { pomodoroComponent } from './pomodoro.component';
import { pomodoroService } from './pomodoro.component.service';

export default [
    {
        path     : '',
        component: pomodoroComponent,
        resolve  : {
            data: () => inject(pomodoroService).getData(),
        },
    },
] as Routes;

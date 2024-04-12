import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProjectComponent } from 'app/modules/admin/apps/project/project.component';
import { ProjectService } from 'app/modules/admin/apps/project/project.service';
import { Dashboard1Component } from './dashboard-1.component';

export default [
    {
        path     : '',
        component: Dashboard1Component,
    },
] as Routes;

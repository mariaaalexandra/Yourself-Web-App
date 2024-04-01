import { Routes } from '@angular/router';
import { NotesListComponent } from 'app/modules/admin/apps/memos/list/list.component';
import { NotesComponent } from 'app/modules/admin/apps/memos/notes.component';

export default [
    {
        path     : '',
        component: NotesComponent,
        children : [
            {
                path     : '',
                component: NotesListComponent,
            },
        ],
    },
] as Routes;

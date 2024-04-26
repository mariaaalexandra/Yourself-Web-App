import { Routes } from '@angular/router';
import { NotificationsComponent } from 'app/modules/admin/ui/other-components/common/notifications/notifications.component';
import { OverviewComponent } from 'app/modules/admin/ui/other-components/common/overview/overview.component';
import { SearchComponent } from 'app/modules/admin/ui/other-components/common/search/search.component';
import { ShortcutsComponent } from 'app/modules/admin/ui/other-components/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/modules/admin/ui/other-components/common/user/user.component';
import { OtherComponentsComponent } from 'app/modules/admin/ui/other-components/other-components.component';
import { ApexChartsComponent } from 'app/modules/admin/ui/other-components/third-party/apex-charts/apex-charts.component';
import { QuillEditorComponent } from 'app/modules/admin/ui/other-components/third-party/quill-editor/quill-editor.component';

export default [
    {
        path     : '',
        component: OtherComponentsComponent,
        children : [
            {
                path      : '',
                pathMatch : 'full',
                redirectTo: 'common/overview',
            },
            {
                path    : 'common',
                children: [
                    {
                        path      : '',
                        pathMatch : 'full',
                        redirectTo: 'overview',
                    },
                    {
                        path     : 'overview',
                        component: OverviewComponent,
                    },
                    {
                        path     : 'search',
                        component: SearchComponent,
                    },
                    {
                        path     : 'shortcuts',
                        component: ShortcutsComponent,
                    },
                    {
                        path     : 'user',
                        component: UserComponent,
                    },
                ],
            },
            {
                path    : 'third-party',
                children: [
                    {
                        path      : '',
                        pathMatch : 'full',
                        redirectTo: 'apex-charts',
                    },
                    {
                        path     : 'apex-charts',
                        component: ApexChartsComponent,
                    },
                    {
                        path     : 'quill-editor',
                        component: QuillEditorComponent,
                    },
                ],
            },
        ],
    },
] as Routes;

import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { LayoutComponent } from 'app/layout/layout.component';
import { LogComponent } from './log/log.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { StartPageComponent } from './start-page/start-page.component';
import { ResetPassComponent } from './modules/reset-pass/reset-pass.component';
import { OtpVerificationPassComponent } from './modules/otp-verification-pass/otp-verification.component';
import { CreateNewPassComponent } from './modules/create-new-pass/reset-pass.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    { path: 'log', component: LogComponent},
    { path: 'otp-verification', component: OtpVerificationComponent},
    { path: '', pathMatch : 'full', redirectTo: 'log'},
    { path: 'start', component: StartPageComponent},
    { path: 'reset-pass', component: ResetPassComponent},
    { path: 'reset-pass-verification', component: OtpVerificationPassComponent},
    { path: 'create-new-pass', component: CreateNewPassComponent},

    // Redirect empty path to '/apps/project'
    {path: '', pathMatch : 'full', redirectTo: 'apps/project'},

    // Redirect signed-in user to the '/apps/project'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'apps/project'},

    // Auth routes for guests
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [

            // Dashboards
            {path: 'dashboards', children: [
                {path: 'dashboard-1', loadChildren: () => import('app/modules/admin/dashboards/dashboard-1/dashboard-1.component.routes')},
            ]},

            // Apps
            {path: 'apps', children: [
                {path: 'project', loadChildren: () => import('app/modules/admin/apps/project/project.routes')},
                {path: 'analytics', loadChildren: () => import('app/modules/admin/apps/analytics/analytics.routes')},
                {path: 'finance', loadChildren: () => import('app/modules/admin/apps/finance/finance.routes')},
                {path: 'crypto', loadChildren: () => import('app/modules/admin/apps/crypto/crypto.routes')},
                {path: 'academy', loadChildren: () => import('app/modules/admin/apps/academy/academy.routes')},
                {path: 'ebook', loadChildren: () => import('app/modules/admin/apps/ebook/academy.routes')},
                {path: 'chat', loadChildren: () => import('app/modules/admin/apps/chat/chat.routes')},
                {path: 'contacts', loadChildren: () => import('app/modules/admin/apps/contacts/contacts.routes')},
                {path: 'ecommerce', loadChildren: () => import('app/modules/admin/apps/ecommerce/ecommerce.routes')},
                {path: 'file-manager', loadChildren: () => import('app/modules/admin/apps/file-manager/file-manager.routes')},
                {path: 'help-center', loadChildren: () => import('app/modules/admin/apps/help-center/help-center.routes')},
                {path: 'mailbox', loadChildren: () => import('app/modules/admin/apps/mailbox/mailbox.routes')},
                {path: 'notes', loadChildren: () => import('app/modules/admin/apps/notes/notes.routes')},
                {path: 'memos', loadChildren: () => import('app/modules/admin/apps/memos/notes.routes')},
                {path: 'shopping-list', loadChildren: () => import('app/modules/admin/apps/shopping-list/ecommerce.routes')},
                {path: 'scrumboard', loadChildren: () => import('app/modules/admin/apps/scrumboard/scrumboard.routes')},
                {path: 'boards', loadChildren: () => import('app/modules/admin/apps/board/scrumboard.routes')},
                {path: 'tasks', loadChildren: () => import('app/modules/admin/apps/tasks/tasks.routes')},
                {path: 'task-management', loadChildren: () => import('app/modules/admin/apps/task-management/tasks.routes')},
                {path: 'navigation', loadChildren: () => import('app/modules/admin/apps/bucharest-map/buchares-map.routes')},
                {path: 'fitness', loadChildren: () => import('app/modules/admin/apps/fitness/fitness.component.routes')},
            ]},

            // Contribute
            {path: 'contribute', children: [
                {path: 'donate', loadChildren: () => import('app/modules/admin/contribute/donate/donate.routes')},
                {path: 'opensourcecontributions', loadChildren: () => import('app/modules/admin/contribute/opensourcecontributions/opensourcecontributions.routes')},
                {path: 'constructivefeedback', loadChildren: () => import('app/modules/admin/contribute/constructivefeedback/constructivefeedback.component.routes')},
            ]},

            // Pages
            {path: 'pages', children: [

                // Activities
                {path: 'activities', loadChildren: () => import('app/modules/admin/pages/activities/activities.routes')},

                // Error
                {path: 'error', children: [
                    {path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.routes')},
                    {path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.routes')}
                ]},

                // Invoice
                {path: 'invoice', children: [
                    {path: 'printable', children: [
                        {path: 'compact', loadChildren: () => import('app/modules/admin/pages/invoice/printable/compact/compact.routes')},
                        {path: 'modern', loadChildren: () => import('app/modules/admin/pages/invoice/printable/modern/modern.routes')}
                    ]}
                ]},

                // Maintenance
                {path: 'maintenance', loadChildren: () => import('app/modules/admin/pages/maintenance/maintenance.routes')},

                // Pricing
                {path: 'pricing', children: [
                    {path: 'modern', loadChildren: () => import('app/modules/admin/pages/pricing/modern/modern.routes')},
                    {path: 'simple', loadChildren: () => import('app/modules/admin/pages/pricing/simple/simple.routes')},
                    {path: 'single', loadChildren: () => import('app/modules/admin/pages/pricing/single/single.routes')},
                    {path: 'table', loadChildren: () => import('app/modules/admin/pages/pricing/table/table.routes')}
                ]},

                // Profile
                {path: 'profile', loadChildren: () => import('app/modules/admin/pages/profile/profile.routes')},

                // Settings
                {path: 'settings', loadChildren: () => import('app/modules/admin/pages/settings/settings.routes')},
            ]},

            // User Interface
            {path: 'ui', children: [

                // Material Components
                {path: 'material-components', loadChildren: () => import('app/modules/admin/ui/material-components/material-components.routes')},

                // Fuse Components
                {path: 'fuse-components', loadChildren: () => import('app/modules/admin/ui/fuse-components/fuse-components.routes')},

                // Other Components
                {path: 'other-components', loadChildren: () => import('app/modules/admin/ui/other-components/other-components.routes')},

                // TailwindCSS
                {path: 'tailwindcss', loadChildren: () => import('app/modules/admin/ui/tailwindcss/tailwindcss.routes')},

                // Advanced Search
                {path: 'advanced-search', loadChildren: () => import('app/modules/admin/ui/advanced-search/advanced-search.routes')},

                // Animations
                {path: 'animations', loadChildren: () => import('app/modules/admin/ui/animations/animations.routes')},

                 // Cards
                {path: 'cards', loadChildren: () => import('app/modules/admin/ui/cards/cards.routes')},

                // Colors
                {path: 'colors', loadChildren: () => import('app/modules/admin/ui/colors/colors.routes')},

                // Confirmation Dialog
                {path: 'confirmation-dialog', loadChildren: () => import('app/modules/admin/ui/confirmation-dialog/confirmation-dialog.routes')},

                // Datatable
                {path: 'datatable', loadChildren: () => import('app/modules/admin/ui/datatable/datatable.routes')},

                // Forms
                {path: 'forms', loadChildren: () => import('app/modules/admin/ui/forms/forms.routes')},

                // Icons
                {path: 'icons', loadChildren: () => import('app/modules/admin/ui/icons/icons.routes')},

                // Page Layouts
                {path: 'page-layouts', loadChildren: () => import('app/modules/admin/ui/page-layouts/page-layouts.routes')},

                // Typography
                {path: 'typography', loadChildren: () => import('app/modules/admin/ui/typography/typography.routes')}
            ]},

            // Documentation
            {path: 'docs', children: [

                // Changelog
                {path: 'changelog', loadChildren: () => import('app/modules/admin/docs/changelog/changelog.routes')},

                // Guides
                {path: 'guides', loadChildren: () => import('app/modules/admin/docs/guides/guides.routes')}
            ]},

            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.routes')},
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];

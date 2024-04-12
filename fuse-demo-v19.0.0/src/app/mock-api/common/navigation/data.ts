/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        subtitle: 'Unique dashboard designs',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.dashboard1',
                title: 'Dashboard 1',
                type : 'basic',
                icon : 'heroicons_outline:queue-list',
                link : '/dashboards/dashboard-1',
            },
            
        ],
    },
    {
        id      : 'apps',
        title   : 'Applications',
        subtitle: 'Custom made application designs',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.analytics',
                title: 'Analytics',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/analytics',
            },
            {
                id   : 'dashboards.finance',
                title: 'Finance',
                type : 'basic',
                icon : 'heroicons_outline:banknotes',
                link : '/apps/finance',
            },
            {
                id   : 'dashboards.crypto',
                title: 'Crypto',
                type : 'basic',
                icon : 'heroicons_outline:currency-dollar',
                link : '/apps/crypto',
            },
            // {
            //     id   : 'apps.academy',
            //     title: 'Academy',
            //     type : 'basic',
            //     icon : 'heroicons_outline:academic-cap',
            //     link : '/apps/academy',
            // },
            {
                id   : 'apps.ebook',
                title: 'Ebook',
                type : 'basic',
                icon : 'heroicons_outline:book-open',
                link : '/apps/ebook',
            },
            // {
            //     id   : 'apps.chat',
            //     title: 'Chat',
            //     type : 'basic',
            //     icon : 'heroicons_outline:chat-bubble-bottom-center-text',
            //     link : '/apps/chat',
            // },
            // {
            //     id   : 'apps.contacts',
            //     title: 'Contacts',
            //     type : 'basic',
            //     icon : 'heroicons_outline:user-group',
            //     link : '/apps/contacts',
            // },
            // {
            //     id      : 'apps.ecommerce',
            //     title   : 'ECommerce',
            //     type    : 'collapsable',
            //     icon    : 'heroicons_outline:shopping-cart',
            //     children: [
            //         {
            //             id   : 'apps.ecommerce.inventory',
            //             title: 'Inventory',
            //             type : 'basic',
            //             link : '/apps/ecommerce/inventory',
            //         },
            //     ],
            // },
            {
                id      : 'apps.shopping-list',
                title   : 'ShoppingList',
                type    : 'collapsable',
                icon    : 'heroicons_outline:shopping-cart',
                children: [
                    {
                        id   : 'apps.shopping-list.inventory',
                        title: 'Inventory',
                        type : 'basic',
                        link : '/apps/shopping-list/inventory',
                    },
                ],
            },
            {
                id   : 'apps.file-manager',
                title: 'File Manager',
                type : 'basic',
                icon : 'heroicons_outline:cloud',
                link : '/apps/file-manager',
            },
            {
                id      : 'apps.help-center',
                title   : 'Help Center',
                type    : 'collapsable',
                icon    : 'heroicons_outline:information-circle',
                link    : '/apps/help-center',
                children: [
                    {
                        id        : 'apps.help-center.home',
                        title     : 'Home',
                        type      : 'basic',
                        link      : '/apps/help-center',
                        exactMatch: true,
                    },
                    {
                        id   : 'apps.help-center.faqs',
                        title: 'FAQs',
                        type : 'basic',
                        link : '/apps/help-center/faqs',
                    },
                    {
                        id   : 'apps.help-center.guides',
                        title: 'Guides',
                        type : 'basic',
                        link : '/apps/help-center/guides',
                    },
                    {
                        id   : 'apps.help-center.support',
                        title: 'Support',
                        type : 'basic',
                        link : '/apps/help-center/support',
                    },
                ],
            },
            // {
            //     id   : 'apps.mailbox',
            //     title: 'Mailbox',
            //     type : 'basic',
            //     icon : 'heroicons_outline:envelope',
            //     link : '/apps/mailbox',
            //     badge: {
            //         title  : '27',
            //         classes: 'px-2 bg-pink-600 text-white rounded-full',
            //     },
            // },
            // {
            //     id   : 'apps.notes',
            //     title: 'Notes',
            //     type : 'basic',
            //     icon : 'heroicons_outline:pencil-square',
            //     link : '/apps/notes',
            // },
            {
                id   : 'apps.memos',
                title: 'Memos',
                type : 'basic',
                icon : 'heroicons_outline:pencil-square',
                link : '/apps/memos',
            },
            {
                id   : 'apps.navigation',
                title: 'Map-Navigation',
                type : 'basic',
                icon : 'heroicons_outline:map',
                link : '/apps/navigation',
            },
            // {
            //     id   : 'apps.scrumboard',
            //     title: 'Scrumboard',
            //     type : 'basic',
            //     icon : 'heroicons_outline:view-columns',
            //     link : '/apps/scrumboard',
            // },
            {
                id   : 'apps.scrumboard',
                title: 'Board',
                type : 'basic',
                icon : 'heroicons_outline:table-cells',
                link : '/apps/boards',
            },
            // {
            //     id   : 'apps.tasks',
            //     title: 'Tasks',
            //     type : 'basic',
            //     icon : 'heroicons_outline:check-circle',
            //     link : '/apps/tasks',
            // },
            {
                id   : 'apps.tasks',
                title: 'Task-Management',
                type : 'basic',
                icon : 'heroicons_outline:list-bullet',
                link : '/apps/task-management',
            },
        ],
    },
    {
        id      : 'contribute',
        title   : 'Contribute',
        subtitle: 'Support us',
        type    : 'group',
        icon    : 'heroicons_outline:check-badge',
        children: [
            {
                id   : 'contribute.donate',
                title: 'Donate',
                type : 'basic',
                icon : 'heroicons_outline:banknotes',
                link : '/contribute/donate',
            },
            {
                id   : 'contribute.opensourcecontributions',
                title: 'Open Source Contributions',
                type : 'basic',
                icon : 'heroicons_outline:command-line',
                link : '/contribute/opensourcecontributions',
            },
            {
                id   : 'contribute.feedback',
                title: 'Constructive Feedback',
                type : 'basic',
                icon : 'heroicons_outline:chat-bubble-left',
                link : '/contribute/constructivefeedback',
            },
        ],
    },
];

export const compactNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        tooltip : 'Dashboards',
        type    : 'aside',
        icon    : 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        tooltip : 'Apps',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'contribute',
        title   : 'Contribute',
        tooltip : 'Contribute',
        type    : 'aside',
        icon    : 'heroicons_outline:check-badge',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];

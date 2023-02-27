import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('src/layouts/MainLayout.vue'),
        children: [
            // { path: '', component: () => import('src/pages/HomePage.vue') },
            {
                path: 'source/:sourceId',
                component: () => import('src/pages/HomePage.vue'),
                props: true,
            },
        ],
    },

    {
        path: '/b',
        component: () => import('src/layouts/InteriorLayout.vue'),
        children: [
            {
                path: 'view-more/:section',
                name: 'more',
                component: () => import('src/pages/ViewMore.vue'),
            },
            {
                path: 'view-results',
                name: 'results',
                component: () => import('src/pages/ResultsPage.vue'),
            },
            {
                path: 'manga-details',
                name: 'details',
                component: () => import('src/pages/MangaDetails.vue'),
            },
            {
                path: 'manga-pages',
                name: 'view',
                component: () => import('src/pages/MangaPages.vue'),
            },
            {
                path: 'settings',
                name: 'settings',
                component: () => import('src/pages/SettingsPage.vue'),
            },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('src/pages/ErrorNotFound.vue'),
    },
]

export default routes

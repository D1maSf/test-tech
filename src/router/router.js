import { createRouter, createWebHistory } from 'vue-router';

import PieChartPage from '../views/pieChart.vue';
const progressBarDemo = () => import('../views/progressBarDemo.vue');

const routes = [
    {
        path: '/',
        name: 'Demo',
        component: progressBarDemo
    },
    {
        path: '/pie-chart',
        name: 'pie-chart',
        component: PieChartPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
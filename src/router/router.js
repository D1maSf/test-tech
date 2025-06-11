import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import ('../views/home.vue');
const PieChartPage = () => import ('../views/pieChart.vue');
const ProgressBarDemo = () => import('../views/progressBarDemo.vue');

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/progressBarDemo',
        name: 'progressBarDemo',
        component: ProgressBarDemo
    },
    {
        path: '/pieChart',
        name: 'pie-chart',
        component: PieChartPage
    },


];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
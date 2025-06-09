import { createRouter, createWebHistory } from 'vue-router';
import progressBarDemo from '../views/progressBarDemo.vue';

const routes = [
    {
        path: '/',
        name: 'Demo',
        component: progressBarDemo
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
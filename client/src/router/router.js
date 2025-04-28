import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
      children: [
        {
          path: '/login',
          component: () => import('../pages/auth/UserAuth.vue'),
          meta: { sidebar: false },
        },
      ],
    },
    {
      path: '/home',
      component: () => import('../pages/Home.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      component: () => import('../pages/About.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/klienti',
      component: () => import('../pages/klienti/ClientList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/auta',
      component: () => import('../pages/auto/AutoList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      component: () => import('../pages/users/UsersList.vue'),
    },

    {
      path: '/:notFound(.*)',
      component: () => import('../pages/NotFound.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

export default router;

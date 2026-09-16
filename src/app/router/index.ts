import { createRouter, createWebHistory } from 'vue-router';
import StorefrontLayout from '@/app/layouts/StorefrontLayout.vue';
import PanelLayout from '@/app/layouts/PanelLayout.vue';
import AdminLayout from '@/app/layouts/AdminLayout.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: StorefrontLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/home').then((m) => m.HomePage),
        },
        {
          path: 'catalog',
          name: 'catalog',
          component: () => import('@/pages/catalog').then((m) => m.CatalogPage),
        },
        {
          path: 'books/:id',
          name: 'book-detail',
          component: () => import('@/pages/book-detail').then((m) => m.BookDetailPage),
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/pages/cart').then((m) => m.CartPage),
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('@/pages/checkout').then((m) => m.CheckoutPage),
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/login').then((m) => m.LoginPage),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/pages/register').then((m) => m.RegisterPage),
        },
      ],
    },
    {
      path: '/panel',
      component: PanelLayout,
      children: [
        {
          path: '',
          name: 'panel',
          component: () => import('@/pages/panel/dashboard').then((m) => m.PanelDashboardPage),
        },
        {
          path: 'profile',
          name: 'panel-profile',
          component: () => import('@/pages/panel/profile').then((m) => m.ProfilePage),
        },
        {
          path: 'orders',
          name: 'panel-orders',
          component: () => import('@/pages/panel/orders').then((m) => m.PanelOrdersPage),
        },
        {
          path: 'orders/:id',
          name: 'panel-order-detail',
          component: () => import('@/pages/panel/order-detail').then((m) => m.PanelOrderDetailPage),
        },
        {
          path: 'favorites',
          name: 'panel-favorites',
          component: () => import('@/pages/panel/favorites').then((m) => m.FavoritesPage),
        },
        {
          path: 'reviews',
          name: 'panel-reviews',
          component: () => import('@/pages/panel/reviews').then((m) => m.MyReviewsPage),
        },
        {
          path: 'report',
          name: 'panel-report',
          component: () => import('@/pages/panel/report').then((m) => m.ReportIssuePage),
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import('@/pages/admin/dashboard').then((m) => m.AdminDashboardPage),
        },
        {
          path: 'books',
          name: 'admin-books',
          component: () => import('@/pages/admin/books').then((m) => m.AdminBooksPage),
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/pages/admin/orders').then((m) => m.AdminOrdersPage),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/pages/admin/users').then((m) => m.AdminUsersPage),
        },
        {
          path: 'roles',
          name: 'admin-roles',
          component: () => import('@/pages/admin/roles').then((m) => m.AdminRolesPage),
        },
        {
          path: 'permissions',
          name: 'admin-permissions',
          component: () => import('@/pages/admin/permissions').then((m) => m.AdminPermissionsPage),
        },
        {
          path: 'discounts',
          name: 'admin-discounts',
          component: () => import('@/pages/admin/discounts').then((m) => m.AdminDiscountsPage),
        },
        {
          path: 'reports',
          name: 'admin-reports',
          component: () => import('@/pages/admin/reports').then((m) => m.AdminReportsPage),
        },
        {
          path: 'analytics',
          name: 'admin-analytics',
          component: () => import('@/pages/admin/analytics').then((m) => m.AdminAnalyticsPage),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

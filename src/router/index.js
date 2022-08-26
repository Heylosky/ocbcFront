import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from "@/views/AuthView";

const routes = [
  {
    path: '/',
    name: 'login',
    component: HomeView
  },
  {
    path: '/login/auth',
    name: 'authorization',
    component: AuthView
  },
  {
    path: '/people/list',
    name: 'peopleList',
    // component: () => import('../views/ListView.vue')
    component: () => import('@/views/ListView.vue')
  },
  {
    path: '/people/info/:email',
    name: 'peopleInfoPage',
    component: () => import('@/views/PeopleInfoView.vue')
  },
  {
    path: "/people/create",
    name: "peopleCreatePage",
    component: () => import('@/views/PeopleCreateView.vue')
  },
  {
    path: "/logout",
    name: "logoutPage",
    component: () => import('@/views/EndView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from) => {
  if (window.sessionStorage.getItem('isAuth') !== 'true' && to.name !== 'login') {
    return { name: 'login' }
  }
})

export default router

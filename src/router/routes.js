const routes = [
  {
    path: '/login',
    name: 'login',
    meta: 'isNotAuth',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    meta: 'isNotAuth',
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/chat/@:username',
    name: 'chat',
    component: () => import('@/views/Chat.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  }
]

export default routes
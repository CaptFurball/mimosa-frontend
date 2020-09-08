
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../components/Home.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../components/forms/Login.vue')
    },
    {
        path: '/status',
        name: 'Status',
        component: () => import('../components/forms/Status.vue')
    },
    {
        path: '/photo',
        name: 'Photo',
        component: () => import('../components/forms/Photo.vue')
    }
]

const router = new VueRouter({
  routes
})

export default router
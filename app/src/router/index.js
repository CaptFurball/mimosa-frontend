
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
        path: '/register',
        name: 'Register',
        component: () => import('../components/forms/Register.vue')
    }
]

const router = new VueRouter({
  routes
})

export default router
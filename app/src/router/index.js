
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
    },
    {
        path: '/video',
        name: 'Video',
        component: () => import('../components/forms/Video.vue')
    },
    {
        path: '/link',
        name: 'Link',
        component: () => import('../components/forms/Link.vue')
    },
    {
        path: '/user/:id',
        name: 'User',
        component: () => import('../components/User.vue')
    },
    {
        path: '/tag/:tag',
        name: 'Tag',
        component: () => import('../components/Tag.vue')
    },
    {
        path: '/popular',
        name: 'Popular',
        component: () => import('../components/Popular.vue')
    },
    {
        path: '/discussed',
        name: 'Discussed',
        component: () => import('../components/Discussed.vue')
    },
    {
        path: '*',
        redirect: '/'
    }
]

const router = new VueRouter({
  routes
})

export default router
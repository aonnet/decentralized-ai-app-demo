import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import User from '../views/User.vue'
import Created from '../views/Created.vue'
import Complete from '../views/Complete.vue'
import TaskCenter from '../views/TaskCenter.vue'
import Link from '../views/Link.vue'
import LinkEmail from '../views/link/LinkEmail.vue'
import LinkError from '../views/LinkError.vue'
import LinkTelegram from '../views/link/LinkTelegram.vue'
import login from '../views/login/login.vue'
import Setting from '../views/Setting.vue'
import Asset from '../views/funds/Asset.vue'
import Ledger from '../views/funds/Ledger.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/created',
      name: 'created',
      component: Created
    }, 
    {
      path: '/complete',
      name: 'complete',
      component: Complete
    },
    {
      path: '/task-center',
      name: 'complete',
      component: TaskCenter
    },
    {
      path: '/link',
      name: 'link',
      component: Link
    },
    {
      path: '/link-email',
      name: 'link-email',
      component: LinkEmail
    },
    {
      path: '/link-error',
      name: 'link-error',
      component: LinkError
    },
    {
      path: '/link-telegram',
      name: 'link-telegram',
      component: LinkTelegram
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting
    },
    {
      path: '/asset',
      name: 'asset',
      component: Asset
    },
    {
      path: '/ledger',
      name: 'ledger',
      component: Ledger
    }
  ]
})

export default router

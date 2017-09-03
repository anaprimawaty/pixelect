import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Group from '@/views/Group'
import NotFound from '@/views/NotFound'
import TOS from '@/views/TOS'
import Privacy from '@/views/Privacy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    {
      path: '/group/:groupId',
      name: 'group',
      component: Group,
      props: true,
    },
    {
      path: '/group/:groupId/:groupName',
      component: Group,
      alias: '/group/:groupId',
      props: true,
    },
    {
      path: '/terms',
      name: 'terms',
      component: TOS,
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: Privacy,
    },
    {
      path: '/*',
      name: 'not-found',
      component: NotFound,
    },
  ],
})

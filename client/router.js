import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Group from '@/views/Group'

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
  ],
})

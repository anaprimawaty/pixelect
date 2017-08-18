import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Group from '@/components/Group'
import User from '@/components/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'hello',
      component: Hello,
    },
    {
      path: '/group/:groupId',
      name: 'group',
      component: Group,
      props: true,
    },
    {
      path: '/user/:userId',
      name: 'user',
      component: User,
      props: true,
    },
  ],
})

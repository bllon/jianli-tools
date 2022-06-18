import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import MuBanCenter from '@/components/MuBanCenter'
import SoftCenter from '@/components/SoftCenter'
import UpdateLog from '@/components/UpdateLog'
import User from '@/components/User'
import JianLiEdit from '@/components/JianLiEdit'
import JianLiPlusEdit from '@/components/JianLiPlusEdit'
import JianLiTemplateEdit from '@/components/JianLiTemplateEdit'
import XmlEdit from '@/components/XmlEdit'

Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/muban_center',
      name: 'MuBanCenter',
      component: MuBanCenter
    },
    {
      path: '/soft_center',
      name: 'SoftCenter',
      component: SoftCenter
    },
    {
      path: '/update_log',
      name: 'UpdateLog',
      component: UpdateLog
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/resume',
      name: 'JianLiEdit',
      component: JianLiEdit
    },
    {
      path: '/resume/:id',
      name: 'JianLiUpdate',
      component: JianLiEdit
    },
    {
      path: '/resume/template/edit',
      name: 'JianLiTemplateEdit',
      component: JianLiTemplateEdit
    },
    {
      path: '/resume/template/edit/:id',
      name: 'JianLiTemplateUpdate',
      component: JianLiTemplateEdit
    },
    {
      path: '/xml/edit',
      name: 'XmlEdit',
      component: XmlEdit
    },
    {
      path: '/resume_plus',
      name: 'JianLiPlusEdit',
      component: JianLiPlusEdit
    },
    {
      path: '/resume_plus/:id',
      name: 'JianLiPlusUpdate',
      component: JianLiPlusEdit
    },
  ]
})

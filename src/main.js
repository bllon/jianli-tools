// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

import util from './utils/tool.js'
Vue.prototype.$util = util

//解决el-dialog页面抖动问题
ElementUI.Dialog.props.lockScroll.default = false;

axios.defaults.withCredentials = true
Vue.use(ElementUI)
Vue.use(VueAxios,axios)

Vue.config.productionTip = false

Vue.filter('dateFormat',(date) => {
  if (date == null || date == '') {
    return date
  }
  if (typeof(date) != 'object') {
    date = new Date(date)
  }
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  return y + '-' + m
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


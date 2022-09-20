import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //state存放状态,
  state: {
    network: true,
  },
  //getter为state的计算属性
  getters: {
    network: (state) => {
      return state.network
    },
  },
  //mutations可更改状态的逻辑，同步操作
  mutations: {
    networkYes: (state) => {
      state.network = true
    },
    networkNo: (state) => {
      state.network = false
    },
  },
})
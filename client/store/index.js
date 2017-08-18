import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  counter: 0,
}

const mutations = {
  increment(state) {
    state.counter++
  },
}

const actions = {
  increment({ commit }) {
    commit('increment')
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
})

export const INCREMENT = 'increment'

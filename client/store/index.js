import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  counter: 0,
  groups: {},
  facebook: null,
}

const mutations = {
  addGroup(state, { groupId, group }) {
    Vue.set(state.groups, groupId, group)
  },
}

const actions = {
  addGroup({ commit }, { groupId, group: { name, photos } }) {
    commit('addGroup', { groupId, group: { name, photos } })
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
})

export const ADD_GROUP = 'addGroup'

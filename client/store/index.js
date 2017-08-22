import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  group: null,
  facebook: null,
}

const mutations = {
  initialiseGroup(state, { name, photos }) {
    state.group = { name, photos }
  },
  updateGroupName(state, name) {
    Vue.set(state.group, 'name', name)
  },
}

const actions = {
  fetchGroup({ commit }, groupId) {
    fetch(`/mocks/group/${groupId}`)
      .then(response => response.json())
      .then(json => commit(INITIALISE_GROUP, json))
  },
  updateGroupName({ commit }, name) {
    commit(UPDATE_GROUP_NAME, name)
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
})

// Mutations
const INITIALISE_GROUP = 'initialiseGroup'

// Actions
export const FETCH_GROUP = 'fetchGroup'
export const UPDATE_GROUP_NAME = 'updateGroupName'

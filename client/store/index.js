import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  groupId: '',
  name: '',
  photos: {},
  preview: null,
  isLoggedIn: null,
}

const mutations = {
  initialiseGroup(state, { name, photos }) {
    state.name = name
    state.photos = photos
  },
  updateGroupName(state, name) {
    state.name = name
  },
  vote(state, { photoId, isUnvote }) {
    const photo = state.photos[photoId]
    state.photos[photoId] = {
      ...photo,
      voted: !isUnvote,
      votes: photo.votes + (isUnvote ? -1 : 1),
    }
  },
  preview(state, photoId) {
    state.preview = state.photos[photoId]
  },
  setLoginState(state, newLoginState) {
    state.isLoggedIn = newLoginState
  },
}

const actions = {
  fetchGroup({ commit }, groupId) {
    // fetch(`/api/group/${groupId}`)

    fetch(`/mocks/group/${groupId}`)
      .then(response => response.json())
      .then(json => commit(INITIALISE_GROUP, json))
  },
  updateGroupName({ commit }, { groupId, name }) {
    // const payload = { groupId, name }
    // const data = new FormData()
    // data.append('json', JSON.stringify(payload))

    // fetch(`/api/group/updateName`, {
    //   method: 'POST',
    //   body: data,
    // })

    commit(UPDATE_GROUP_NAME, name)
  },
  vote({ commit }, { photoId, isUnvote }) {
    // const payload = { photoId }
    // const data = new FormData()
    // data.append('json', JSON.stringify(payload))

    // fetch(`/api/photo/vote`, {
    //   method: 'POST',
    //   body: data,
    // })

    commit(VOTE, { photoId, isUnvote })
  },
  preview({ commit }, photoId) {
    commit(PREVIEW, photoId)
  },
  setLoginState({ commit }, newLoginState) {
    commit(SET_LOGIN_STATE, newLoginState)
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
})

// Mutations
export const INITIALISE_GROUP = 'initialiseGroup'

// Actions
export const FETCH_GROUP = 'fetchGroup'
export const UPDATE_GROUP_NAME = 'updateGroupName'
export const VOTE = 'vote'
export const PREVIEW = 'preview'
export const SET_LOGIN_STATE = 'setLoginState'

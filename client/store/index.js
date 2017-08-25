import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  groupId: '',
  name: '',
  photos: {},
  preview: null,
  isLoggedIn: null,
  username: '',
  fbId: '',
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
  setUsername(state, username) {
    state.username = username
  },
  setFbId(state, fbId) {
    state.fbId = fbId
  },
}

const actions = {
  fetchGroup({ commit }, groupId) {
    Promise.all([
      fetch(`/groups/${groupId}`),
      fetch(`/groups/${groupId}/photos`),
    ])
      .then(responses =>
            Promise.all(responses.map(response => response.json()))
           )
      .then(jsons => ({ ...jsons[0], photos: jsons[1] }))
      .then(json => commit(INITIALISE_GROUP, json))
  },
  updateGroupName({ commit }, { groupId, name }) {
    const payload = { name }

    fetch(`/groups/${groupId}/changeName`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.text())
      .then(console.log)

    commit(UPDATE_GROUP_NAME, name)
  },
  vote({ commit }, { fbId, photoId, isUnvote }) {
    const payload = { facebookId: fbId, photoId }

    fetch(`/votes/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
    })

    commit(VOTE, { photoId, isUnvote })
  },
  preview({ commit }, photoId) {
    commit(PREVIEW, photoId)
  },
  setLoginState({ commit }, newLoginState) {
    commit(SET_LOGIN_STATE, newLoginState)
  },
  setUsername({ commit }, username) {
    commit(SET_USERNAME, username)
  },
  setFbId({ commit }, fbId) {
    commit(SET_FB_ID, fbId)
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
export const SET_USERNAME = 'setUsername'
export const SET_FB_ID = 'setFbId'

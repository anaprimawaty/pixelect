import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isGroupValid: null,
  groupId: '',
  groupName: '',
  photos: {},
  users: [],
  preview: null,
  isLoggedIn: null,
  userName: '',
  facebookId: null,
  groups: [],
}

const mutations = {
  initialiseGroup(state, { valid, name, photos, users }) {
    state.isGroupValid = valid || null
    state.groupName = name
    state.photos = photos
    state.users = users
  },
  updateGroupName(state, name) {
    state.groupName = name
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
  login(state, { facebookId, name }) {
    state.facebookId = facebookId
    state.userName = name
  },
  initialiseGroupList(state, groups) {
    state.groups = groups
  },
  invalidateGroup(state) {
    state.isGroupValid = null
  },
}

const actions = {
  fetchGroup({ commit }, groupId) {
    commit(INVALIDATE_GROUP)
    Promise.all([
      fetch(`/groups/${groupId}`),
      fetch(`/groups/${groupId}/photos`),
      fetch(`/groups/${groupId}/users`),
    ])
      .then(responses => {
        if (!responses.every(v => v.ok)) {
          throw new Error('Invalid hash')
        }
        return Promise.all(responses.map(response => response.json()))
      })
      .then(jsons => {
        const photos = jsons[1].reduce((acc, val) => {
          acc[val.id] = { ...val, photoId: val.id }
          return acc
        }, {})
        return {
          ...jsons[0],
          photos,
          users: jsons[2],
          valid: true,
        }
      })
      .then(json => commit(INITIALISE_GROUP, json))
      .catch(err => {
        commit(INITIALISE_GROUP, { valid: false })
        console.log(err)
      })
  },
  fetchGroupList({ commit }) {
    fetch('/users/groups', { method: 'GET' })
      .then(response => response.json())
      .then(json => commit(INITIALISE_GROUP_LIST, json))
  },
  updateGroupName({ commit }, { groupId, name }) {
    const payload = {
      groupHash: groupId,
      name,
    }

    fetch(`/groups/changeName`, {
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
  vote({ commit }, { photoId, isUnvote }) {
    const payload = { photoId }

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
  login({ commit }, { facebookId, name }) {
    commit(LOGIN, { facebookId, name })
  },
  initialiseGroupList({ commit }, groups) {
    commit(INITIALISE_GROUP_LIST, groups)
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
})

// Mutations
export const INITIALISE_GROUP = 'initialiseGroup'
export const INITIALISE_GROUP_LIST = 'initialiseGroupList'

// Actions
export const FETCH_GROUP = 'fetchGroup'
export const UPDATE_GROUP_NAME = 'updateGroupName'
export const VOTE = 'vote'
export const PREVIEW = 'preview'
export const LOGIN = 'login'
export const FETCH_GROUP_LIST = 'fetchGroupList'
export const INVALIDATE_GROUP = 'invalidateGroup'

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
  userName: '',
  facebookId: null,
  groups: [],
  _csrf: null,
}

const mutations = {
  initialiseGroup(state, { valid, name, photos, users }) {
    state.isGroupValid = valid
    if (valid) {
      state.groupName = name
      state.photos = photos
      state.users = users
      if (!users.some(user => user.facebookId === state.facebookId)) {
        users.push({ facebookId: state.facebookId, firstName: state.username })
      }
    }
  },
  updateGroupName(state, name) {
    state.groupName = name
  },
  vote(state, { photoId, isUnvote }) {
    const photo = state.photos[photoId]
    photo.voted = !isUnvote
    photo.votes += isUnvote ? -1 : 1
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
  addPhoto(state, { link, photoId }) {
    Vue.set(state.photos, photoId, {
      id: photoId,
      photoId,
      link,
      userId: state.facebookId,
      votes: 0,
      voted: false,
    })
  },
  setCsrfToken(state, _csrf) {
    state._csrf = _csrf
  },
}

const actions = {
  fetchGroup({ commit }, groupId) {
    commit(INVALIDATE_GROUP)
    Promise.all([
      fetch(`/groups/${groupId}`, { credentials: 'same-origin' }),
      fetch(`/groups/${groupId}/photos`, { credentials: 'same-origin' }),
      fetch(`/groups/${groupId}/users`, { credentials: 'same-origin' }),
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
      .catch(() => {
        commit(INITIALISE_GROUP, { valid: false })
      })
  },
  fetchGroupList({ commit }) {
    fetch('/users/groups', { method: 'GET', credentials: 'same-origin' })
      .then(response => response.json())
      .then(json => commit(INITIALISE_GROUP_LIST, json))
  },
  updateGroupName({ commit }, { groupId, name }) {
    const payload = {
      groupHash: groupId,
      name,
      _csrf: store.state._csrf,
    }

    fetch('/groups/changeName', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
      credentials: 'same-origin',
    })

    commit(UPDATE_GROUP_NAME, name)
  },
  vote({ commit }, { photoId, isUnvote }) {
    const payload = {
      photoId,
      _csrf: store.state._csrf,
    }

    fetch(`/votes/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
      credentials: 'same-origin',
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
  addPhoto({ commit }, { link, photoId }) {
    commit(ADD_PHOTO, { link, photoId })
  },
  setCsrfToken({ commit }, _csrf) {
    commit(SET_CSRF_TOKEN, _csrf)
  },
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
})

export default store

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
export const ADD_PHOTO = 'addPhoto'
export const SET_CSRF_TOKEN = 'setCsrfToken'

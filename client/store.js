import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isGroupValid: null,
  isGroupOwner: false,
  groupId: '',
  groupName: '',
  photos: {},
  users: [],
  userName: '',
  facebookId: null,
  groups: null,
  _csrf: null,
}

const mutations = {
  initialiseGroup(state, { valid, name, photos, users, owner }) {
    if (valid) {
      state.groupName = name
      state.photos = photos
      state.users = users
      state.isGroupOwner = owner === state.facebookId
      if (!users.some(user => user.facebookId === state.facebookId)) {
        users.push({ facebookId: state.facebookId, firstName: state.username })
      }
    }
    state.isGroupValid = valid
  },
  deleteGroup(state, groupId) {
    state.groups = state.groups.filter(group => group.hash !== groupId)
  },
  updateGroupName(state, name) {
    state.groupName = name
  },
  vote(state, { photoId, isUnvote }) {
    const photo = state.photos[photoId]
    photo.voted = !isUnvote
    photo.votes += isUnvote ? -1 : 1
  },
  login(state, { facebookId, name }) {
    state.facebookId = facebookId
    state.userName = name
  },
  initialiseGroupList(state, groups) {
    state.groups = groups
  },
  invalidateGroup(state) {
    state.isGroupOwner = false
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
      isNew: true,
    })
  },
  setCsrfToken(state, _csrf) {
    state._csrf = _csrf
  },
  seenPhoto(state, photoId) {
    state.photos[photoId].isNew = false
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
  deleteGroup({ commit }, groupId) {
    commit(DELETE_GROUP, groupId)
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
  seenPhoto({ commit }, photoId) {
    commit(SEEN_PHOTO, photoId)
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
export const LOGIN = 'login'
export const FETCH_GROUP_LIST = 'fetchGroupList'
export const INVALIDATE_GROUP = 'invalidateGroup'
export const ADD_PHOTO = 'addPhoto'
export const SET_CSRF_TOKEN = 'setCsrfToken'
export const DELETE_GROUP = 'deleteGroup'
export const SEEN_PHOTO = 'seenPhoto'

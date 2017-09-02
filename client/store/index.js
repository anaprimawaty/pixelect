import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  groupId: '',
  groupName: '',
  photos: {},
  users: [],
  preview: null,
  isLoggedIn: null,
  userName: '',
  facebookId: null,
}

const mutations = {
  initialiseGroup(state, { name, photos, users }) {
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
}

const actions = {
  fetchGroup({ commit }, groupId) {
    Promise.all([
      fetch(`/groups/${groupId}`),
      fetch(`/groups/${groupId}/photos`),
      fetch(`/groups/${groupId}/users`),
    ])
      .then(responses =>
        Promise.all(responses.map(response => response.json()))
      )
      .then(jsons => {
        console.log(jsons[1])
        const photos = jsons[1].reduce((acc, val) => {
          acc[val.id] = { ...val, photoId: val.id }
          return acc
        }, {})
        return {
          ...jsons[0],
          photos,
          users: jsons[2],
        }
      })
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
export const LOGIN = 'login'

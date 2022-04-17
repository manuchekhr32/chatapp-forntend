import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('authorization'))
  },
  getters: {
    getUser: (state) => {
      return state.user
    },
    isUser: (state) => {
      return Object.keys(state.user).includes('username') && Object.keys(state.user).includes('_password')
    }
  },
  actions: {
    setUser: ({ commit }, user) => {
      if (user) {
        commit('setUser', user)
      }
      else {
        if (localStorage.getItem('authorization') == null) {
          commit('setUser', {})
        }
      }
    },
    logout: ({ commit }) => {
      commit('setUser', {})
    }
  },
  mutations: {
    setUser: (state, user) => {
      state.user = user
      localStorage.setItem('authorization', JSON.stringify(user))
    },
  },
})

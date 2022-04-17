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
    }
  },
  actions: {
    setUser: ({ commit }, user) => {
      commit('setUser', user)
    }
  },
  mutations: {
    setUser: (state, user) => {
      state.user = user
      localStorage.setItem('authorization', JSON.stringify(user))
    }
  },
})

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fileName: null,
    messages: [],
    user: null,
  },
  mutations: {
    setFileName(state, fileName) {
      state.fileName = fileName;
    },
    setMessages(state, messages) {
      state.messages = messages;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    setLogs({ commit }, logs) {
      commit('setFileName', logs.fileName);
      commit('setMessages', logs.messages);
    },
    setUser({ commit }, user) {
      commit('setUser', user);
    },
  },
});

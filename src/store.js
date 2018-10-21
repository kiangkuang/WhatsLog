import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fileName: null,
    messages: [],
    media: [],
    user: null,
  },
  mutations: {
    setFileName(state, fileName) {
      state.fileName = fileName;
    },
    setMessages(state, messages) {
      state.messages = messages;
    },
    setMedia(state, media) {
      state.media = media;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    setLogs({ commit }, logs) {
      commit('setFileName', logs.fileName);
      commit('setMessages', logs.messages);
      commit('setMedia', logs.media);
    },
  },
});

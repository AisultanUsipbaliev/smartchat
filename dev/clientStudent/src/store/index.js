import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import menu from './modules/menu';
import socketMessage from './modules/socketMessage';
import notice from './modules/notice';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    menu,
    socketMessage,
    notice
  },
  strict: process.env.NODE_ENV !== 'production'?true:false
});
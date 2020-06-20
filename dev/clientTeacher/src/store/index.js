import Vue from 'vue';
import Vuex from 'vuex';
import profile from './modules/profile';
import socket from './modules/socket';
import error from './modules/error';
import notice from './modules/notice';
import students from './modules/students';
import homeresult from './modules/homeresult';
import results from './modules/results';
import state from './modules/state';
import groups from './modules/groups';
import chat from './modules/chat';
import sidebar from './modules/sidebar';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    profile,
    groups,
    socket,
    error,
    notice,
    students,
    homeresult,
    results,
    state,
    chat,
    sidebar
  },
  strict: process.env.NODE_ENV !== 'production' ? true : false
});
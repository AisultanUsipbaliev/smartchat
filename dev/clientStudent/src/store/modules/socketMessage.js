const state = {
  data: {},
  audio: {},
  writing: {},
  isread: 0
};

const getters = {
  DATA: state => {
    return {
      data: state.data,
    }
  },
  AUDIO: state => {
    return {
      audio: state.audio,
    }
  },
  WRITING: state => {
    return {
      writing: state.writing,
    }
  },
  ISREAD: state => {
    return {
      isread: state.isread,
    }
  }
};

const mutations = {
  SET_DATA: (state, payload) => {
    state.data = payload;
  },
  SET_AUDIO: (state, payload) => {
    state.audio = payload;
  },
  SET_WRITING: (state, payload) => {
    state.writing = payload;
  },
  SET_ISREAD: (state, payload) => {
    state.isread += 1;
  },
};

const actions = {
  GET_DATA: async (context, payload) => {
    context.commit('SET_DATA', payload);
  },
  GET_AUDIO: async (context, payload) => {
    context.commit('SET_AUDIO', payload);
  },
  GET_WRITING: async (context, payload) => {
    context.commit('SET_WRITING', payload);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};


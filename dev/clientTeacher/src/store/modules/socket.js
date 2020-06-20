const state = {
  data: {},
  writing: {},
};

const getters = {
  DATA: state => {
    return {
      data: state.data,
    }
  },
  WRITING: state => {
    return {
      writing: state.writing,
    }
  }
};

const mutations = {
  SET_DATA: (state, payload) => {
    state.data = payload;
  },
  SET_WRITING: (state, payload) => {
    state.writing = payload;
  }
};

const actions = {
  GET_DATA: async (context, payload) => {
    context.commit('SET_DATA', payload);
  },  GET_WRITING: async (context, payload) => {
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


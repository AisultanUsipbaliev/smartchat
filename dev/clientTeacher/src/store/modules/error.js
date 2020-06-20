const state = {
  data: {}
};

const getters = {
  DATA: state => {
    return {
      data: state.data,
    }
  },
};

const mutations = {
  SET_DATA: (state, payload) => {
    state.data = payload;
  },
};

const actions = {
  GET_DATA: async (context, payload) => {
    context.commit('SET_DATA', payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};


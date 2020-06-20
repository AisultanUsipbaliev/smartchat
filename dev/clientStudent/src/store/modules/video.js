const state = {
  src: {},
};

const getters = {
  VIDEO: state => {
    return {
      src: state.src,
    }
  },
};

const mutations = {
  SET_VIDEO: (state, payload) => {
    state.src = payload;
  },
};

const actions = {
  GET_VIDEO: async (context, payload) => {
    context.commit('SET_VIDEO', payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};


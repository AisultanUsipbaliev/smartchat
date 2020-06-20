const state = {
  data: {}
};

const getters = {
  MENU: state => {
    return {
      data: state.data,
    }
  },
};

const mutations = {
  SET_MENU: (state, payload) => {
    state.data = payload;
  }
};

const actions = {
  GET_MENU: async (context, payload) => {
    context.commit('SET_MENU', payload);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};


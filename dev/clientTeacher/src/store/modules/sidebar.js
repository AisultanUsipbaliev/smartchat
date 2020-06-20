
const getDefaultState = () => {
  return {
    isOpenSidebar: false
  }
}

const state = getDefaultState();

const getters = {
  DATA: state => {
    return {
      isOpenSidebar: state.isOpenSidebar,
    }
  }
};

const mutations = {
  SET_IS_OPEN_SIDEBAR: (state, payload) => {
    state.isOpenSidebar = payload;
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  SET_STUDENT_ID: async (context, payload) => {
    context.commit('SET_IS_OPEN_SIDEBAR', payload);
  },

  RESET_STATE ({ commit }) {
    commit('RESET_STATE')
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};



const getDefaultState = () => {
  return {
    currentStudent: {}
  }
}

const state = getDefaultState();

const getters = {
  DATA: state => {
    return {
      currentStudent: state.currentStudent,
    }
  }
};

const mutations = {
  SET_STUDENT: (state, payload) => {
    state.currentStudent = payload;
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  SET_STUDENT: async (context, payload) => {
    context.commit('SET_STUDENT', payload);
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



const getDefaultState = () => {
  return {
    currentStudentId: {}
  }
}

const state = getDefaultState();

const getters = {
  DATA: state => {
    return {
      currentStudentId: state.currentStudentId,
    }
  }
};

const mutations = {
  SET_STUDENT_ID: (state, payload) => {
    state.currentStudentId = payload;
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  SET_STUDENT_ID: async (context, payload) => {
    context.commit('SET_STUDENT_ID', payload);
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


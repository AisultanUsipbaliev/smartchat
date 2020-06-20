const state = {
  data: {},
  graph: {},
  isOpenGraph: 0
};

const getters = {
  DATA: state => {
    return {
      data: state.data,
    }
  },
  GRAPH: state => {
    return {
      graph: state.graph,
    }
  },
  IS_OPEN_GRAPH: state => {
    return {
      isOpenGraph: state.isOpenGraph,
    }
  }
};

const mutations = {
  SET_DATA: (state, payload) => {
    state.data = payload;
  },
  SET_GRAPH: (state, payload) => {
    state.graph = payload;
  },
  SET_IS_OPEN_GRAPH: (state, payload) => {
    state.isOpenGraph = payload;
  }
};

const actions = {
  GET_DATA: async (context, payload) => {
    context.commit('SET_DATA', payload);
  },
  GET_GRAPH: async (context, payload) => {
    context.commit('SET_GRAPH', payload);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};


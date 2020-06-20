import axios from 'axios';
axios.defaults.baseURL = process.env.API_ENDPOINT;

const $http = process.env.NODE_ENV !== 'production'?axios.create({withCredentials: true}):axios;

const getDefaultState = () => {
  return {
    groups: []
  }
}

const state = getDefaultState();

const getters = {
  GET_ALL: state => {
    return state.groups
  }
};

const mutations = {
  
  SET_ALL: (state, payload) => { 
    state.groups = payload 
  },
  
  SET_GROUP_STATUS: (state, payload) => { 

    let mas = state.groups
    for(let i=0; i<mas.length; i++) {
      if(mas[i].studentId == payload.studentId) {
        mas[i].status = payload.status
      }
    }
    state.groups = mas
  },

  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
};

const actions = {
  GET_ALL: async (context, payload) => {
    try {
      let res = await $http.post('/api', 'method=get-groups')
      context.commit('SET_ALL', res.data.groups)
    } catch (err) {
      console.log(err)
    }
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


import axios from 'axios';
axios.defaults.baseURL = process.env.API_ENDPOINT;

const $http = process.env.NODE_ENV !== 'production'?axios.create({withCredentials: true}):axios;

const getDefaultState = () => {
  return {
    notices: [],
    unreadMessage: 0,
    unreadTestResult: 0,
    unverifiedQuizResult: 0,
    graphLength: 0
  }
}

const state = getDefaultState();

const getters = {
  GET_ALL: state => {
    return {
  		notices: state.notices,
  		unreadMessage: state.unreadMessage,
  		unreadTestResult: state.unreadTestResult,
  		unverifiedQuizResult: state.unverifiedQuizResult,
      graphLength: state.graphLength
    }
  }
};

const mutations = {
  SET_ALL: (state, payload) => {
		state.notices = payload.notices,
		state.unreadMessage = payload.unreadMessage,
		state.unreadTestResult = payload.unreadTestResult,
		state.unverifiedQuizResult = payload.unverifiedQuizResult,
    state.graphLength = payload.graphLength
  },
  SET_UNREAD_TEST_RESULT: (state, payload) => {
    state.unreadTestResult = payload
  },
  
  SET_UNVERIFIED_QUIZ_RESULT: (state, payload) => {
    state.unverifiedQuizResult = payload
  },
  SET_UNREAD_MESSAGE: (state, payload) => {
    state.unreadMessage = payload
  },
  UNREAD_MESSAGE_INCREMENT: (state, payload) => {
    let num = 1 
    if (typeof payload == 'number') {
      num = payload
    }
    state.unreadMessage += num
  },
  UNREAD_MESSAGE_DECREMENT: (state, payload) => {
    let num = 1 
    if (typeof payload == 'number') {
      num = payload
    }
    state.unreadMessage -= num
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
};

const actions = {
  GET_ALL: async (context, payload) => {
  	try {
  		let {data} = await $http.post('/api', 'method=get-status');
	  	if (data && data.status == 200) {
	  		context.commit('SET_ALL', data);
	  	} else {
	  		throw new Error(JSON.stringify(data))
	  	}
  	} catch(err) {
  		console.error(err)
  	}
  },
  SET_UNREAD_TEST_RESULT: async (context, payload) => {
    try {
      let {data} = await $http.post('/api', 'method=get-status&&unreadTestResult=1');
      if (data && data.status == 200) {
        context.commit('SET_UNREAD_TEST_RESULT', data.unreadTestResult);
      } else {
        throw new Error(JSON.stringify(data))
      }
    } catch(err) {
      console.error(err)
    }
  },
  SET_UNVERIFIED_QUIZ_RESULT: async (context, payload) => {
    try {
      let {data} = await $http.post('/api', 'method=get-status&&unverifiedQuizResult=1');
      if (data && data.status == 200) {
        context.commit('SET_UNVERIFIED_QUIZ_RESULT', data.unverifiedQuizResult);
      } else {
        throw new Error(JSON.stringify(data))
      }
    } catch(err) {
      console.error(err)
    }
  },
  SET_UNREAD_MESSAGE: async (context, payload) => {
    try {
      let {data} = await $http.post('/api', 'method=get-status&&unreadMessage=1');
      if (data && data.status == 200) {
        context.commit('SET_UNREAD_MESSAGE', data.unreadMessage);
      } else {
        throw new Error(JSON.stringify(data))
      }
    } catch(err) {
      console.error(err)
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


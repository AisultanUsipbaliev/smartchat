import axios from 'axios';
axios.defaults.baseURL = process.env.API_ENDPOINT;

const $http = process.env.NODE_ENV !== 'production'?axios.create({withCredentials: true}):axios;

const getDefaultState = () => {
  return {
    notices: [],
    unreadMessage: 0,
    unfullfilledTests: 0,
    unfullfilledQuiz: 0
  }
}

const state = getDefaultState();

const getters = {
  GET_ALL: state => {
    return {
		notices: state.notices,
		unreadMessage: state.unreadMessage,
		unfullfilledTests: state.unfullfilledTests,
		unfullfilledQuiz: state.unfullfilledQuiz
    }
  }
};

const mutations = {
  SET_ALL: (state, payload) => {
		state.notices = payload.notices,
		state.unreadMessage = payload.unreadMessage,
		state.unfullfilledTests = payload.unfullfilledTests,
		state.unfullfilledQuiz = payload.unfullfilledQuiz,
    state.needFeedback = payload.needFeedback
  },
  SET_UNFULFILLED_TESTS: (state, payload) => {
    state.unfullfilledTests = payload
  },
  SET_UNFULFILLED_QUIZ: (state, payload) => {
    state.unfullfilledQuiz = payload
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
  RESET_UNREAD_MESSAGE: (state, payload) => {
    state.unreadMessage = 0
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
  GET_UNFULFILLED_TESTS: async (context, payload) => {
    try {
      let {data} = await $http.post('/api', 'method=get-status&&unfullfilledTests=1');
      if (data && data.status == 200) {
        context.commit('SET_UNREAD_TEST_RESULT', data.unfullfilledTests);
      } else {
        throw new Error(JSON.stringify(data))
      }
    } catch(err) {
      console.error(err)
    }
  },
  GET_UNFULFILLED_QUIZ: async (context, payload) => {
    try {
      let {data} = await $http.post('/api', 'method=get-status&&unfullfilledQuiz=1');
      if (data && data.status == 200) {
        context.commit('SET_UNVERIFIED_QUIZ_RESULT', data.unfullfilledQuiz);
      } else {
        throw new Error(JSON.stringify(data))
      }
    } catch(err) {
      console.error(err)
    }
  },
  GET_UNREAD_MESSAGE: async (context, payload) => {
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


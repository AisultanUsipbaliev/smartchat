import  { getCookie, setCookie } from '../../functions/cookie'

const state = {
  state: true
}

const getters = {
  GET_STATE: state => {
    return {
		  state: state.state,
    }
  }
}

const mutations = {
  SET_STATE: (state, payload) => {
		state.state = payload
    setCookie('state', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
};

export { getCookie, setCookie }
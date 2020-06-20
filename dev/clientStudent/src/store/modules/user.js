import axios from 'axios';
axios.defaults.baseURL = process.env.API_ENDPOINT;

const $http = process.env.NODE_ENV !== 'production'?axios.create({withCredentials: true}):axios;

const getDefaultState = () => {
  return {
    user: {},
    rate: {},
    lessons: null,
    nextLesson: null,
    sertificats: [],
    teacher: {}
  }
}

const state = getDefaultState();

const getters = {
  ALL: state => {
    return {
      user: state.user,
      lessons: state.lessons,
      nextLesson: state.nextLesson,
      rate: state.rate,
      sertificats: state.sertificats,
      teacher: state.teacher
    }
  },
  USER: state => {
    return state.user;
  },
  RATE: state => {
    return state.rate;
  },
  LESSONS: state => {
    return state.lessons;
  },
  NEXT_LESSON: state => {
    return state.nextLesson;
  },
  SERTIFICATS: state => {
    return state.sertificats;
  },
  TEACHER: state => {
    return state.teacher;
  },
  AVA: state => {
    return state.user.ava;
  },
};

const mutations = {
  SET_ALL: (state, payload) => {
    state.user = payload.profile;
    state.lessons = payload.lessons;
    state.nextLesson = payload.nextLesson;
    state.rate = payload.rate;
    state.sertificats = payload.sertificats;
    state.teacher = payload.teacher;
  },
  SET_TEACHER_STATUS: (state, payload) => {
    state.teacher.status = payload
  },
  SET_USER_AVA: (state, payload) => {
    state.user.ava = payload;
  },
  SET_USER_SMS_ON: (state, payload) => {
    state.user.smsOn = payload;
  },
  SET_USER_MAIL_ON: (state, payload) => {
    state.user.mailOn = payload;
  },
  SET_USER_MAIL: (state, payload) => {
    state.user.email = payload;
  },
  RESET_ALL: (state) => {
    Object.assign(state, getDefaultState())
  }
};

const actions = {
  GET_ALL: async (context, payload) => {
    let {data} = await $http.post('/api', `method=GET-PROFILE`);
    if(!data.profile.ava) data.profile.ava =  process.env.PHOTO_URL + 'avatar.jpg' 
    else {
      data.profile.ava =  data.profile.ava.indexOf("/") == -1?  
      process.env.PHOTO_URL + data.profile.ava: 
      data.profile.ava
    }
       
    if (data.sertificats.length>0) {
      data.sertificats = data.sertificats;
    } else {
      data.sertificats = '';
    }
    if (data.profile.birthday) {
      let birthday = new Date(''+data.profile.birthday+'');
      let dd = birthday.getDate();
      let mm = birthday.getMonth() + 1; 
      let yyyy = birthday.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      data.profile.birthday = yyyy + '-' + mm + '-' + dd;
    }
    if (data.nextLesson) {
      data.nextLesson = new Date(data.nextLesson);
      let nextLesson = new Date(''+data.nextLesson+'');
      let dd = nextLesson.getDate();
      let mm = nextLesson.getMonth() + 1; 
      let yyyy = nextLesson.getFullYear();
      let HH = nextLesson.getHours();
      let MM = nextLesson.getMinutes();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      if (HH < 10) {
        HH = '0' + HH;
      }
      if (MM < 10) {
        MM = '0' + MM;
      }
      data.nextLesson = HH + ':' + MM + ' ' + dd + '.' + mm + '.' + yyyy;
    }
    data.profile.age = getAge(data.profile.birthday);

    
    let now = (new Date()).valueOf()
    let lastVisit = null;
    if (data.teacher && data.teacher.lastVisit) {
      lastVisit = (new Date(data.teacher.lastVisit)).valueOf()
      data.teacher.status = now - lastVisit < 120000
    } else data.teacher = { status: false }

    context.commit('SET_ALL', data);
  },
  GET_USER_SMS_ON: async (context, payload) => {
    context.commit('SET_USER_SMS_ON', payload);
  },
  GET_USER_AVA: async (context, payload) => {
    payload = process.env.PHOTO_URL + payload;
    console.log('payload', payload)
    context.commit('SET_USER_AVA', payload);
  },
  GET_USER_MAIL_ON: async (context, payload) => {
    context.commit('SET_USER_MAIL_ON', payload);
  },
  GET_USER_MAIL: async (context, payload) => {
    context.commit('SET_USER_MAIL', payload);
  },
  RESET_STATE ({ commit }) {
    commit('RESET_ALL')
  },
};

function getAge(date) {
  if(!date) return 'Возраст не известен';
  let today = new Date();
  let birthday = new Date(date);
  let year = null;
  year = today.getFullYear() - birthday.getFullYear();
  if(birthday.getMonth() > today.getMonth())year--;
  else if(birthday.getMonth() == today.getMonth())
    if(birthday.getDate() > today.getDate())year--;
  if(year < 21)
  {
    if(year == 1)year += ' год';
    else if(year < 5)year += ' года';
    else year += ' лет';
  }
  else
  {
    if(year%10 == 1)year += ' год';
    else if(year%10 > 0 && year%10 < 5)year += ' года';
    else year += ' лет';
  }
  return year;
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};


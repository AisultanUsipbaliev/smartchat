// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'core-js/es6/set';
import 'core-js/fn/array/from';
import MQ from 'vue-match-media/src';

//vuex 
  import {store} from './store';
//VueNativeSock
  import VueNativeSock from 'vue-native-websocket';
    Vue.use(VueNativeSock, `${process.env.NODE_ENV == 'production' ? 'wss://' +top.location.hostname + '/ws/' : 'ws://185.146.2.146:7575'}`, {
      connectManually: true,
      // reconnection: true,
      // reconnectionAttempts: 5,
      // reconnectionDelay: 3000
    });

// fileUrl
Vue.prototype.$fileUrl = process.env.FILE_URL;
Vue.prototype.$photoUrl = process.env.PHOTO_URL;
Vue.prototype.$audioUrl = 'http://185.146.2.146:9797/common/audio/';

// production
Vue.prototype.$production = process.env.NODE_ENV === 'production' ? 1 : 0;
//axios 
  import axios from 'axios';
  axios.defaults.baseURL = process.env.API_ENDPOINT;
  axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      return Promise.reject(error.response.data) 
    }
  )
  if (process.env.NODE_ENV !== 'production') {
    Vue.prototype.$http = axios.create({withCredentials: true});
  } else {
    Vue.prototype.$http = axios;
  }

// error
  let users = [{chat_id: '495188574', name: 'Vitalya'},{chat_id: '461238130', name: 'Ais'}]
  Vue.config.errorHandler = function(err, vm, info) {
    if(Vue.prototype.$production){
      let error = JSON.stringify(err.stack).split('components');
      for(let j = 0; j < users.length; j++)
        Vue.prototype.$http.post('https://api.telegram.org/bot861283547:AAGka0y9GRMAAkeUwVevdDWlZXcnxu4qQl0/sendMessage', 
          `chat_id=${users[j].chat_id}&text=${'teacher: page-' + vm.$options._componentTag + '- ' + err.name + ': ' + err.message + ' ' + (error && error[1] !== undefined ? error[1].split(' at ')[0] : '')}`)
        .then( res => console.warn(res))
        .catch( err => console.warn(err))
    }
  }


// font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
  import { faUser } from '@fortawesome/free-solid-svg-icons';
  import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
  import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
  import { faComments } from '@fortawesome/free-solid-svg-icons';
  import { faHome } from '@fortawesome/free-solid-svg-icons';
  import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
  import { faQuestion } from '@fortawesome/free-solid-svg-icons';
  import { faTasks } from '@fortawesome/free-solid-svg-icons';
  import { faUsers } from '@fortawesome/free-solid-svg-icons';
  import { faSearch } from '@fortawesome/free-solid-svg-icons';
  import { faFile } from '@fortawesome/free-solid-svg-icons';
  import { faTimes } from '@fortawesome/free-solid-svg-icons';
  import { faMicrophoneAlt } from '@fortawesome/free-solid-svg-icons';
  import { faBook } from '@fortawesome/free-solid-svg-icons';
  import { faPlus } from '@fortawesome/free-solid-svg-icons';
  import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
  import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
  import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
  import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
  import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
  import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
  import { faCheckDouble} from '@fortawesome/free-solid-svg-icons';
  import { faBars} from '@fortawesome/free-solid-svg-icons';
  import { faImage} from '@fortawesome/free-solid-svg-icons';
  import { faFileVideo} from '@fortawesome/free-solid-svg-icons';
  import { faTenge} from '@fortawesome/free-solid-svg-icons';
  import { faHandPointer} from '@fortawesome/free-solid-svg-icons';
  import { faClock} from '@fortawesome/free-solid-svg-icons';
  import { faFileDownload} from '@fortawesome/free-solid-svg-icons';
  import { faCheck } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  library.add(
    faGraduationCap,
    faFileDownload,
    faComments,
    faUser,
    faCalendarAlt,
    faClock,
    faHome,
    faSignOutAlt,
    faTasks,
    faUsers,
    faSearch,
    faFile,
    faTimes,
    faMicrophoneAlt,
    faBook,
    faPlus,
    faChevronUp,
    faChevronDown,
    faChevronRight,
    faChevronLeft,
    faPencilAlt,
    faTrashAlt,
    faCheckDouble,
    faBars,
    faImage,
    faFileVideo,
    faTenge,
    faHandPointer,
    faCheck
  );
  Vue.component('fai', FontAwesomeIcon);


//viewerjs
  import 'viewerjs/dist/viewer.css'
  import DirectiveViewer from './directives/viewer'
  Vue.use(DirectiveViewer, {})

//loading
  Vue.component('loading', {
    template: ` <div class="loading">
                  <img src="/static/img/loop.gif" class="circle-loading">
                </div>`
  })

//content-loader
  Vue.component('content-loader', {
    template: ` <div class="content-loader">
                  <img src="/static/img/loop.gif" class="circle-loading">
                </div>`
  })


Vue.prototype.$wiper = {
	left: true,
	right: true
}
Vue.prototype.$move = 0

Vue.use(MQ);
Vue.config.productionTip = false

import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);

// functions
  import functions from './functions/myFunction'
  Vue.prototype.$functions = functions;

//Cookie
  import  { getCookie, setCookie } from './functions/cookie'
  Vue.prototype.$getCookie = getCookie;
  Vue.prototype.$setCookie = setCookie;


// sendFile
  import sendFile from './functions/sendFile'
  Vue.prototype.$sendFile = sendFile;

// sound
  import sound from './functions/sound'
  Vue.prototype.$sound = sound;


// fscreen
  import fscreen from 'fscreen';
  Vue.prototype.$fscreen = fscreen

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,
mq: {
    phone: '(max-width: 768px)',
    tablet: '(max-width: 1024px)',
    desktop: '(min-width: 1024px)'
  }
})

  
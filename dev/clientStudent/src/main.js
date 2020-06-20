import Vue from 'vue';
import App from './App';
import router from './router';
//vuex 
	import {store} from './store';
//VueNativeSock
	import VueNativeSock from 'vue-native-websocket';

	// Vue.use(VueNativeSock, 'ws://185.146.2.146:7575', {
	// 		connectManually: true
	// 	});
	// Vue.use(VueNativeSock, 'wss://web.smartchat.kz/ws/', {
	// 		connectManually: true
	// 	});
	if(process.env.NODE_ENV !== 'production') {
		Vue.use(VueNativeSock, 'ws://185.146.2.146:7575', {
			connectManually: true
		});
	} else {
		Vue.use(VueNativeSock, `wss://${top.location.hostname}/ws/`, {
			connectManually: true
		});
	}
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


// production
	Vue.prototype.$production = process.env.NODE_ENV === 'production' ? 1 : 0;

// error
  let users = [{chat_id: '495188574', name: 'Vitalya'},{chat_id: '461238130', name: 'Ais'}]
  Vue.config.errorHandler = function(err, vm, info) {
    if(Vue.prototype.$production){
      let error = JSON.stringify(err.stack).split('components');
      for(let j = 0; j < users.length; j++)
        Vue.prototype.$http.post('https://api.telegram.org/bot861283547:AAGka0y9GRMAAkeUwVevdDWlZXcnxu4qQl0/sendMessage', 
          `chat_id=${users[j].chat_id}&text=${'student: page-' + vm.$options._componentTag + '- ' + err.name + ': ' + err.message + ' ' + (error && error[1] !== undefined ? error[1].split(' at ')[0] : '')}`)
        .then( res => console.warn(res))
        .catch( err => console.warn(err))
    }
  }


//fontawesome 
	import { library } from '@fortawesome/fontawesome-svg-core';
	import { faUser } from '@fortawesome/free-solid-svg-icons';
	import { faTelegramPlane as fabTelegramPlane } from '@fortawesome/free-brands-svg-icons';
	import { faInstagram as fabInstagram } from '@fortawesome/free-brands-svg-icons';
	import { faFacebookF as  fabFacebookF} from '@fortawesome/free-brands-svg-icons';
	import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
	import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
	import { faComments } from '@fortawesome/free-solid-svg-icons';
	import { faTasks } from '@fortawesome/free-solid-svg-icons';
	import { faDownload } from '@fortawesome/free-solid-svg-icons';
	import { faFont } from '@fortawesome/free-solid-svg-icons';
	import { faHome } from '@fortawesome/free-solid-svg-icons';
	import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
	import { faQuestion } from '@fortawesome/free-solid-svg-icons';
	import { faCheck } from '@fortawesome/free-solid-svg-icons';
	import { faInfo } from '@fortawesome/free-solid-svg-icons';
	import { faHandshake } from '@fortawesome/free-solid-svg-icons';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { faPause } from '@fortawesome/free-solid-svg-icons';
	import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
	import { faVolumeDown } from '@fortawesome/free-solid-svg-icons';
	import { faVolumeOff } from '@fortawesome/free-solid-svg-icons';
	import { faVolumeMute } from '@fortawesome/free-solid-svg-icons';
	import { faExpand } from '@fortawesome/free-solid-svg-icons';
	import { faCompress } from '@fortawesome/free-solid-svg-icons';
	import { faHeadset } from '@fortawesome/free-solid-svg-icons';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
	import { faTrash } from '@fortawesome/free-solid-svg-icons';
	import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
	import { faFile } from '@fortawesome/free-solid-svg-icons';
	import { faImage } from '@fortawesome/free-solid-svg-icons';
	import { faTimes } from '@fortawesome/free-solid-svg-icons';

	import { faStar } from '@fortawesome/free-solid-svg-icons';
	import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
	
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

	library.add(
		faGraduationCap,
		faComments,
		faUser,
		faCalendarAlt,
		faThumbsUp,
		faFont,
		faHome,
		faQuestion,
		faDownload,
		fabTelegramPlane,
		fabInstagram,
		fabFacebookF,
		faTasks,
		faCheck,
		faInfo,
		faHandshake,
		faStar,
		farStar,
		faPlay,
		faTimes,
		faPause,
		faVolumeUp,
		faVolumeDown,
		faVolumeOff,
		faVolumeMute,
		faExpand,
		faCompress,
		faHeadset,
		faPlus,
		faInfoCircle,
		faTrash,
		faMicrophone,
		faFile,
		faImage
	);
	Vue.component('fai', FontAwesomeIcon);
//MQ
	import 'core-js/es6/set';
	import 'core-js/fn/array/from';
	import MQ from 'vue-match-media/src';
	Vue.use(MQ);

//viewerjs
	import 'viewerjs/dist/viewer.css';
	import DirectiveViewer from './directives/viewer';
	Vue.use(DirectiveViewer, {});
//lineClamp
	import lineClamp from 'vue-line-clamp'
	Vue.use(lineClamp, {})
//dropper
	import dropper from './directives/chat_DnD';
	Vue.use(dropper);
//VueSweetalert2
	import VueSweetalert2 from 'vue-sweetalert2';
	Vue.use(VueSweetalert2);
//webAudioTouchUnlock
	import webAudioTouchUnlock from 'web-audio-touch-unlock';
	Vue.prototype.$webAudioTouchUnlock = webAudioTouchUnlock;
//cookie functions
	import {getCookie, setCookie} from './functions/cookie';
	Vue.prototype.$getCookie = getCookie;
	Vue.prototype.$setCookie = setCookie;
//sendFile function
	import sendFile from './functions/sendFile';
	Vue.prototype.$sendFile = sendFile;
//uploadPhoto function
	import uploadPhoto from './functions/uploadPhoto';
	Vue.prototype.$uploadPhoto = uploadPhoto;
//sound function
	import sound from './functions/sound';
	Vue.prototype.$sound = sound;
//dateFormat function
	import dateFormat from './functions/dateFormat';
	Vue.prototype.$dateFormat = dateFormat;
// Intervals
	import { toServer, toClient, toUnion } from './functions/interval'
	Vue.prototype.$toServer = toServer
	Vue.prototype.$toClient = toClient
	Vue.prototype.$toUnion = toUnion
// getAudio
	import getAudio from './functions/getAudio'
	Vue.prototype.$getAudio = getAudio
	Vue.prototype.$context = new (window.AudioContext || window.webkitAudioContext)()
// MakeId
	import MakeId from './functions/makeId'
	Vue.prototype.$makeId = MakeId
// fscreen
	import fscreen from 'fscreen';
	Vue.prototype.$fscreen = fscreen
// help
	Vue.prototype.$help = true

Vue.prototype.$photoUrl = process.env.PHOTO_URL;
Vue.prototype.$fileUrl = process.env.FILE_URL;
Vue.prototype.$audioUrl = process.env.AUDIO_URL;
Vue.prototype.$tutorialUrl = process.env.TUTORIAL_URL;
Vue.prototype.$NODE_ENV = process.env.NODE_ENV;
Vue.config.productionTip = false;

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

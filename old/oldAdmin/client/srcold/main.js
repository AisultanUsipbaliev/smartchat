import Vue from 'vue';
import App from './App';
import router from './router';
//axios 
import axios from 'axios';
axios.defaults.baseURL = process.env.API_ENDPOINT;
axios.create({ baseURL: process.env.API_ENDPOINT }).interceptors.response.use(undefined, (error) => {
  if (error.response && error.response.status === 401) {
    router.replace({
      path: '/login',
      query: { redirect: router.currentRoute.fullPath },
    });
  }
  return Promise.reject(error.response.data);
});
Vue.prototype.$http = axios;
//VueSweetalert2
import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);
//VueDragscroll
import VueDragscroll from 'vue-dragscroll'
Vue.use(VueDragscroll);
//fortawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faPaste } from '@fortawesome/free-solid-svg-icons';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { faUnlink } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { faCompress } from '@fortawesome/free-solid-svg-icons';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faSms } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faClone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faBars,
			faSearch,
			faChalkboardTeacher,
			faGraduationCap,
			faBell,
			faSignOutAlt,
			faUniversity,
			faAngleRight,
			faCircleNotch,
			faNewspaper,
			faCreditCard,
			faComments,
			faFileAlt,
			faPaste,
			faSlidersH,
			faUnlink,
			faLink,
			faTrashAlt,
			faSortUp,
			faSortDown,
			faLock,
			faUnlock,
			faEdit,
			faPencilAlt,
			faExpandArrowsAlt,
			faCompress,
			faSyncAlt,
			faTimes,
			faSave,
			faSpinner,
			faKey,
			faSms,
			faEllipsisH,
			faSignInAlt,
			faEnvelope,
			faClone,
			faPlusSquare);
Vue.component('fai', FontAwesomeIcon);
// Clipboard
import Clipboard from 'v-clipboard'
Vue.use(Clipboard)

Vue.prototype.$commonPhotoUrl = process.env.CONFIG.common_photo_url;
Vue.prototype.$webSmartchatUrl = process.env.CONFIG.web_smartchat_url;

import { toServer, toClient, toUnion } from './functions/interval';
Vue.prototype.$toServer = toServer;
Vue.prototype.$toClient = toClient;
Vue.prototype.$toUnion = toUnion;

import { getFullMonthName, getShortMonthName, getFullWeekDayName, getShortWeekDayName } from './functions/dateNames';
Vue.prototype.$getFullMonthName = getFullMonthName;
Vue.prototype.$getShortMonthName = getShortMonthName;
Vue.prototype.$getFullWeekDayName = getFullWeekDayName;
Vue.prototype.$getShortWeekDayName = getShortWeekDayName;

Vue.config.productionTip = false;
 
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

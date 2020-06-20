<template>
<div>
<!-- Разметка для Mobile версии -->
	<a v-if='help' href="https://wa.me/77476349265?text=Здравствуйте!%20Мне%20нужна%20ваша%20помощь." class="help-me"><fai icon="question"/></a>
	<header v-if="$mq.phone && $route.path != '/chat'">
		<div class="sidebar_button" id="sidebar_button" @click="sidebarToggle()">
			<div class="side_row" id="first_side"></div>
			<div class="side_row" id="second_side"></div>
			<div id="third_side" class="side_row"></div>
		</div>
		<router-link :to="{name: 'Profile'}">
			<img src="/static/img/logo-mobile.png" class="logo">
		</router-link>
		<span id="bell" @click="noticeToggle(); isReadNotice();">
			<span class="count-notificate" v-if="isreadNoticesCount">{{isreadNoticesCount}}</span>
			<img src="/static/img/bell.png" class="logo" >
		</span>
	</header>
	<div v-if="$mq.phone" class="mobile-notificate" id="mobile-notificate">
		<p class="mob-notice_head">Уведомления
			<span class="clear-notific" @click="clearNotice">Очистить</span>
		</p>
		<div class="mob-notice_body">
			<div v-for="(notice, index) in notices">
				<div class="notification">
					<div class = 'notific_img_block'>
						<img class="notific_img" src="/static/img/bell.png">
					</div>
					<span v-if="!notice.link" class="notific_title">{{notice.content}}</span>
					<router-link :to="notice.link.str" v-if="notice.link && notice.link.type == 0" class="notific_title">
						<span @click="deleteNotice(notice, index, 1);">{{notice.content}}</span>
					</router-link>
					<a :href="notice.link.str" v-if="notice.link && notice.link.type == 1" class="notific_title">{{notice.content}}</a>
					<span class="notific-time">{{$dateFormat('HH:MM dd.mm.yyyy', new Date(notice.dt))}}</span>
					<img src="/static/img/cancel.png" class="notific-delete" title="Удалить" @click="deleteNotice(notice, index)">
					<p></p>
				</div>
			</div>
		</div>
	</div>
	<div class="sidebar" id="sidebar" v-if="$mq.phone"> 
		<ul class="side_menu">
			<li class="menu_item" @click="sidebarToggle()"><router-link :to="{name: 'Profile'}" active-class="s_active" >Профиль</router-link></li>
			<li class="menu_item" @click="sidebarToggle()"><router-link :to="{name: 'Settings'}" active-class="s_active" >Настройки</router-link></li>
			<li class="menu_item" @click="sidebarToggle()"><router-link :to="{name: 'Courses'}" active-class="s_active" >Тарифы</router-link></li>
			<li class="menu_item" @click="sidebarToggle()" v-if='hasGroup'><router-link :to="{name: 'Schedule'}" active-class="s_active" >Расписание</router-link></li>
			<li class="menu_item" @click="sidebarToggle()" v-if='hasGroup'><router-link :to="{name: 'Chat'}" active-class="s_active" >Чат</router-link></li>
			<li class="menu_item" @click="sidebarToggle()"><router-link :to="{name: 'Tests'}" active-class="s_active" >Тесты</router-link></li>
			<li class="menu_item" @click="sidebarToggle()"><router-link :to="{name: 'QuizList'}" active-class="s_active" >Задания</router-link></li>
			<li class="menu_item" @click="sidebarToggle()"><router-link :to="{name: 'Feedback'}" active-class="s_active" >Помощь</router-link></li>
			<li class="menu_item" @click="sidebarToggle()"><a @click="logout">Выход</a></li>
			<li class="menu_item social-link">
			<a @click="sidebarToggle()" href="#"><fai :icon= "['fab', 'telegram-plane']" class="icon_header"/></a>
			<a @click="sidebarToggle()" href="#"><fai :icon= "['fab', 'instagram']" class="icon_header"/></a>
			<a @click="sidebarToggle()" href="#"><fai :icon="['fab', 'facebook-f']" class="icon_header"/></a>
			</li>
		</ul>
	</div>
<!-- Разметка для Mobile версии  end-->
<!-- 	разметка для Web версии -->
	<div v-show="!$mq.phone">
		<header>
			<img src="/static/img/logo.png" class="logo">
			<div class="left_header_div">
				<div class="bell" @click="showNotification()">
					<img src="/static/img/bell.png" class="bell_icon" :class="isreadNoticesCount ? 'bell_icon_anim' : ''">
					<span class="bell_count" v-if="isreadNoticesCount">{{isreadNoticesCount}}</span>
				</div>
				<div class="profile" @click="showSettings = true">
					<img :src="student.ava? student.ava:ava_replace" class="header_profile">
					<span class="username">{{student.firstname}} {{student.lastname}}</span>
					<img src="/static/img/if_down_1167972.png" class="all_settings">
				</div>
			</div>
		</header>
		<div class="notific_pop_web" id="web_note" :style="web_note">
			<p class="notific_web_title">Уведомления 
				<span class="clear-notific" @click="clearNotice">Очистить</span>
			</p>
			<div class="web-notific-body">
				<div v-for="(notice, index) in notices">
					<span v-if="noticeDateCompare(index)" class="day-notific">{{$dateFormat('dd.mm.yyyy', new Date(notice.dt))}}</span>
					<div class="notification">
						<div class = 'notific_img_block'>
							<img class="notific_img" src="/static/img/bell.png">
						</div>
						<span v-if="!notice.link" class="notific_title">{{notice.content}}</span>
						<router-link :to="notice.link.str" v-if="notice.link && notice.link.type == 1"  class="notific_title">
							<span @click="deleteNotice(notice, index, 1);">{{notice.content}}</span>
						</router-link>
						<a :href="notice.link.str" v-if="notice.link && notice.link.type == 2" class="notific_title">{{notice.content}}</a>
						<span class="notific-time">{{$dateFormat('HH:MM', new Date(notice.dt))}}</span>
						<img src="/static/img/cancel.png" class="notific-delete" title="Удалить" @click="deleteNotice(notice, index)">
						<p></p>
					</div>
				</div>
			</div>
		</div>
		<div class="sidebar">
			<div v-if="!$mq.phone" class="scroll_on_pages" :style="{top: getScrollTop()}"></div>
			<ul class="menu_ul">
				<li tool="Профиль">
					<router-link class-active="active" :to="{name:'Profile'}"><fai icon="user"/></router-link>
				</li>
				<li tool="Тарифы">
					<router-link class-active="active" :to="{name:'Courses'}"><fai icon="graduation-cap"/></router-link>
				</li>
				<li v-if='hasGroup' tool="Расписание">
					<router-link class-active="active"  :to="{name:'Schedule'}"><fai icon="calendar-alt"/></router-link>
				</li>
				<li v-if='hasGroup' tool="Чат">
					<router-link class-active="active" :to="{name:'Chat'}">
						<span>
							<fai icon="comments"/>
						</span>
						<span class="unreadSheet" v-if="unreadMessage">
							{{unreadMessage}}
						</span>
					</router-link>
				</li>
				<li tool="Тесты">
					<router-link class-active="active" :to="{name:'Tests'}">
						<span>
							<fai icon="tasks"/>
						</span>
						<span class="unreadSheet" v-if="unfullfilledTests">
							{{unfullfilledTests}}
						</span>
					</router-link>
				</li>
				<li tool="Домашнее задание">
					<router-link class-active="active" :to="{name:'QuizList'}">
						<span>
							<fai icon="home"/>
						</span>
						<span class="unreadSheet" v-if="unfullfilledQuiz">
							{{unfullfilledQuiz}}
						</span>
					</router-link>
				</li>
				<li tool="Помощь">
					<router-link class-active="active" :to="{name:'Feedback'}"><fai icon="handshake"/></router-link>
				</li>
				<li tool="Тех.поддержка">
					<a class-active="active" target="_blank" href="https://wa.me/77476349265?text=Здравствуйте!%20Мне%20нужна%20ваша%20помощь."><fai icon="headset"/></a>
				</li>
			</ul>
		</div>

		<div id="background" class="background" v-show="showSettings||showNotice" @click="showSettings=false;closeNotice()"></div>

		<div class="settings_profile" v-show="showSettings">
			<a class="color_black" @click="goToProfile">Профиль</a>
			<a class="color_black" @click="goToSettings">Настройки</a>
			<a class="color_black" @click="logout">Выйти</a>
		</div>
	</div>
	<!-- 	разметка для Web версии end-->
	<!-- popUp -->
	<div id="popUp" v-if="feedBack.length">
		<div class="popUp-bg" @click="closePU()"></div>
		<div class="popUp-content">
			<div class="popUp-content-swap_content">
				<img :src="'/static/img/' + feed_img" class="popUp-content-img" v-if="!$mq.phone">
				<div class="popUp-content-about" :style="$mq.phone ? 'padding: 15px' : ''">
					<h3 class="popUp-content-about-title">Оцените {{feed_name ? feed_name : 'нас'}}</h3>
					<label class="popUp-content-about-place_text" v-if="feed_id === null">Нам важно ваше мнение</label>
					<div class="popUp-content-about-stars" v-if="feed_id !== null">
						<div v-for="(star, starkey) in feed_names" :key="starkey">
							<fai class="starsN" :icon="[starkey < feed_count ? 'fa' : 'far', 'star']" @click="feed_count = starkey + 1" />
								<label>{{star}}</label>
						</div>
					</div>
					<textarea v-if="feed_id !== null" class="popUp-content-about-comment" v-model="feed_comment" placeholder="Ваш коментарий (необязательно)"></textarea>
					<div class="popUp-content-about-buttons" :style="$mq.phone ? feed_id === null ? 'position: absolute; left:0;' 
																																												: ''
																																		 : feed_id === null ? 'position: absolute;' 
																																												: ''">
						<button @click="changeToAsses()" id="popUp-content-about-buttons-first" v-if=" feed_id === null || feed_count">
						{{feed_next ? feed_next : 'Оценить'}}</button>
						<button @click="closePU()" id="popUp-content-about-buttons-second" v-if="feed_id === null">Позже</button>
					</div>
				</div>
			</div>
			<ul class="popUp-ul dots">
				<li class="popUp-ul-li" v-for="point in feed_points">
					<input class="popUp-ul-li-radio" ref="feed_point" type="radio" name="feed_block">
					<label></label>
				</li>
			</ul>
		</div>
	</div>
</div>
</template>

<script>
	import Vue from 'vue';
	import VueNativeSock from 'vue-native-websocket';
	export default {
		name: 'Header',
		data(){
			return{
				help: true,
				showSettings: false,
				showNotice: false,
				openSidebar: false,
				openNotice: false,
				ava_replace: '/static/img/prog.gif',
				teacher: {},
				student: { firstname:'Загрузка...',	lastname: '' },
				unreadMessage: 0,
				unfullfilledTests: 0,
				unfullfilledQuiz: 0,
				isreadNoticesCount: 0,
				notices: [],
				web_note: 'right: -500px',
				all: '',
				// push
				userInSystem: true,
				// feedback
				feedBack: [],
				radio_num: 0,
				feed_points: 0,
				feed_img: 'Rate_us.png',
				feed_name: '',
				feed_next: '',
				feed_id: null,
				feed_count : null,
				feed_comment: '',
				feed_names:['Ужасно','Плохо','Средне','Хорошо','Отлично',],
				hasGroup: false,
				// swipe
				sX: 0,
				eX: 0
			}
		},
		mounted(){
			let app = document.getElementById('app')
			if(!app.getAttribute('listener')) {
				app.addEventListener('touchstart', this.touchStart)
				app.addEventListener('touchend', this.touchEnd)
				app.setAttribute('listener', 'true')
			}
		},
		async created(){ 
			this.help = this.$getCookie('SAH')
			await this.$connect()
			this.makeSocket()
			// setTimeout(() => {
			// 	this.$socket.send(JSON.stringify({teacher_id: 83, notice: 4, test_id: 48}))
			// }, 1000)
			let interval = setInterval(()=>{
				this.$disconnect()
			}, 1000)
			setTimeout(()=>{clearInterval(interval)}, 5000)
			await this.$store.dispatch('user/GET_ALL');
			await this.$store.dispatch('notice/GET_ALL');
			await this.getStatus();
			setTimeout(()=>{
				window.onblur = () => this.userInSystem = false; 
				window.onfocus = () => this.userInSystem = true;
			}, 100)
			let user = this.$store.getters['user/USER']
			this.teacher = this.$store.getters['user/TEACHER']
			this.hasGroup = user.group_id
		},
		computed: {
			userInfo() {
				return this.$store.getters['user/USER'];
			},
			allInfo() {
				return this.$store.getters['user/ALL'];
			},
			getMenuOnMChat(){
				return this.$store.getters['menu/MENU'];
			},
			noticeAllData() {
				return this.$store.getters['notice/GET_ALL'];
			}
		},
		watch: {
			userInfo (newData) {
				this.student = newData;
				this.hasGroup = newData.group_id
			},
			allInfo (newData) {
				this.all = newData;
			},
			getMenuOnMChat(){
				this.sidebarToggle();
			},
			noticeAllData(newData) {
				this.unreadMessage = newData.unreadMessage;
				this.unfullfilledTests = newData.unfullfilledTests;
				this.unfullfilledQuiz = newData.unfullfilledQuiz;
				this.isreadNoticesCount = 0;
				this.notices = []
				for(let i=0; i<newData.notices.length; i++) {
					if(!newData.notices[i].isread) this.isreadNoticesCount++;
					this.notices.push(newData.notices[i]);
				}
			}
		},
		methods:{
			touchStart(){
				this.sX = event.changedTouches[0].clientX;
			},
			touchEnd(){
				this.eX = event.changedTouches[0].clientX;
				this.calcSwipe();			
			},
			calcSwipe(){
				let calc = this.eX - this.sX
				if(calc > 150 && !this.openSidebar && !this.openNotice) 				this.sidebarToggle();
				else if(calc > 150 && !this.openSidebar && this.openNotice) 		this.noticeToggle();
				else if(calc < -150 && this.openSidebar)  											this.sidebarToggle();
			},
			makeSocket(){
				let that = this
				this.$socket.onclose = function(e){ that.$connect(); that.makeSocket() }
				this.$socket.onerror = function(e){ console.log(e); }
				this.$socket.onmessage = this.messageFunction;
				},
				getNameByType(type){
			  let t;
			  switch(type){
				case 2: t = 'Фото'; break;
				case 3: t = 'Аудио'; break;
				case 4: t = 'Файл'; break;
				case 5: t = 'Видео'; break;
				case 7: t = 'Задание'; break;
				case 8: t = 'Тест'; break;
				default: t = 'Файл'; break;
			  }
			  return t;
			},
			notifyMe(title, text){
				let notification = new Notification(title, {
					tag 	: 'ache-mail',
					body 	: text,
					icon 	: '/static/img/notify.png' 
				})
			},
			push(title, text) {
				if(!("Notification" in window)) console.log('Не поддерживает push')
				else if(Notification.permission == 'granted') this.notifyMe(title, text)
				else if(Notification.permission != 'denied')
					Notification.requestPermission(permisson => {
						if (!('permisson' in Notification)) Notification.permisson = permisson
						if (permisson == 'granted') 				this.notifyMe(title, text)			
					})
			},
			messageFunction(event) {
				let data = JSON.parse(event.data);
				if(!data.notice) return;
					if(!this.userInSystem && data.notice === 1 && data.notice === 10){
						let	title = 'SmartChat',
							text = '';
						if(data.notice == 1){
							title = data.sender_name;
							if(data.type == 1) text = data.content;
							else text = this.getNameByType(data.type);
						}else text = data.msg;
						this.push(title, text)
					}
				switch(data.notice) {
					case 1: { 
						if(data.isteacher) this.$sound('sms')
						if(this.$route.path == '/chat') this.$store.dispatch('socketMessage/GET_DATA', data) 
						else {
							if (data.isteacher) this.$store.commit('notice/UNREAD_MESSAGE_INCREMENT');
						}
					} break;
					case 6: 
						if(data.isteacher && data.id == this.teacher.teacher_id) 
							this.$store.commit('user/SET_TEACHER_STATUS', data.status)
						break 
					case 8:
						this.$store.commit('socketMessage/SET_ISREAD', 1) 
						break
					case 10:{
						this.$sound('bell')
						// if(data.sended) searchMes(data.last);
						let notice = Object.assign({ dt: new Date(), content: data.msg }, data)
						delete notice.msg
						this.notices.push(notice); this.isreadNoticesCount++;
					}	break;
					case 11: {
						if(this.$route.path == '/chat') this.$store.dispatch('socketMessage/GET_WRITING', {writing: new Date().valueOf()});
						if(data.isteacher && data.id == this.teacher.teacher_id) 
							this.$store.commit('user/SET_TEACHER_STATUS', 1)
					} break;
					// case 111: 	location.reload(); 					break;
				}
			},
		//feedBack
			closePU(){
				setTimeout(()=>{document.getElementById('popUp').style.display = "none"},500);
				document.getElementsByClassName('popUp-content-swap_content')[0].classList.add('popup-close_popUp');
				setTimeout(()=>{document.getElementsByClassName('popUp-content-swap_content')[0].classList.remove('popup-close_popUp');},500)
			},
			changeToAsses(){
				if(this.feed_id !== null){
					this.$http.post('/api', `method=FEED&&value=${this.feed_count}&&teacher_id=${this.feed_id}&&comment=${this.feed_comment}`)
					.then(res =>{
						if(res.status !== 200) return;
						else{
							this.feed_count = null;
							this.feed_comment = '';
						}
					})
					.catch(err =>{
						console.error(err);
						return
					})
				}
				let teach = this.feedBack[this.radio_num];
				if(!teach) this.closePU();
				else{
					let div = document.getElementsByClassName('popUp-content-swap_content')[0]
					div.classList.add('popUp-content-swap_content_anim');
					setTimeout(()=>{
						this.feed_id = teach.teacher;
						if(teach.teacher === 0){
							this.feed_name = 'SmartChat';
							this.feed_next = "Отправить";
							this.feed_img = "Rate_us_2.png";
						}else{
							this.feed_name = 'преподователя ' + teach.firstname + ' ' + teach.lastname;
							this.feed_next = "Далее";
							this.feed_img = 'Rate_us_1.png';
						}
					},350)
					this.radio_num++;
					this.$refs['feed_point'][this.radio_num].click();
					setTimeout(()=>div.classList.remove('popUp-content-swap_content_anim'),700)
				}
			},
			logout(){
				this.$http.post('/account', 'method=logout')
				.then(res => {
					this.$store.dispatch('user/RESET_STATE');
					this.showSettings=false; 
					location.reload()
				})
				.catch(err => {console.error(err);})
			},
			goToSettings(){
				this.showSettings=false;
				this.$router.push({ name: 'Settings' })
			},
			goToProfile(){
				this.showSettings=false;
				this.$router.push({ name: 'Profile' })
			},
			//notice 
			async getStatus(){
				let data = this.$store.getters['notice/GET_ALL'];
				this.unreadMessage = data.unreadMessage;
				this.unfullfilledTests = data.unfullfilledTests;
				this.unfullfilledQuiz = data.unfullfilledQuiz;
				this.isreadNoticesCount = 0;
				this.notices = []
				for(let i=0; i<data.notices.length; i++) {
					if(!data.notices[i].isread) this.isreadNoticesCount++;
					this.notices.push(data.notices[i]);
				}
				if(data.needFeedback){
					this.feedBack = data.needFeedback;
					this.feed_points = data.needFeedback.length;
					this.feed_points++;
					if(this.$refs['feed_point'])setTimeout(()=>{this.$refs['feed_point'][this.radio_num].click();},0);
				}
			},
			isReadNotice(){
				if (this.isreadNoticesCount) {
					this.$http.post('/api', 'method=READ-NOTICE')
					.then(res => { this.isreadNoticesCount = 0; })
					.catch(err => { console.error(err); })
				}
			},
			clearNotice() {
				if (this.notices.length) {
					this.$http.post('/api', 'method=CLEAR-NOTICE')
					.then(res => { 
						this.notices = [];
						this.$mq.phone ? this.noticeToggle() : this.showNotification();
					})
					.catch(err => { console.error(err) })
				}else	this.$mq.phone ? this.noticeToggle() : this.showNotification();

			},
			deleteNotice(notice, index, close) {
				if (notice.notice_id) {
					this.$http.post('/api', `method=DELETE-NOTICE&notice_id=${notice.notice_id}`)
					.then(res => { 
						this.notices.splice(index, 1) 
					})
					.catch(err => { console.error(err) })
				} else {
					this.notices.splice(index, 1) 
				}
				if (close) {
					if (this.$mq.phone) this.noticeToggle();
					else this.showNotification();
				}
				else if (!close && this.notices.length == 0) {
					if (this.$mq.phone) this.noticeToggle();
					else this.showNotification();
				}
			},
			closeNotice() {
				let notif = document.getElementById('web_note');
				this.showNotice = false;
				this.web_note = 'right: -500px'
				setTimeout(()=>{
					notif.style.display = 'none';
				}, 200)
			},
			showNotification(){
				let notif = document.getElementById('web_note');
				if(this.showNotice == false){
					notif.style.display = 'block';
					this.isReadNotice()
					setTimeout(()=>{
					this.web_note = 'right: 15px';
						this.showNotice = true;
					},10 )
				}else{
					this.showNotice = false;
					this.web_note = 'right: -500px'
					setTimeout(()=>{
						notif.style.display = 'none';
					}, 200)
				}
			},
			noticeDateCompare(i) {
			if(i > 0){
				let first = new Date(this.notices[i].dt).setHours(0, 0, 0, 0);
				let second = new Date(this.notices[i-1].dt).setHours(0, 0, 0, 0);
				if(first == second) return false;
			}
			return true;
			},
			noticeToggle(){
				let notificate = document.getElementById('mobile-notificate');
				if(!this.openNotice){
					notificate.style.display = 'block';
					this.isReadNotice()
					setTimeout(()=>{
						notificate.style.left = 0;
					}, 50)
					if(this.openSidebar){
						this.sidebarToggle();
					}
					this.openNotice = true;
				}else{
					notificate.style.left = '100%';
					setTimeout(()=>{
						notificate.style.display = 'none';
					}, 300)
					this.openNotice = false;
				}
			},
			sidebarToggle() {
				let sidebar = document.getElementById('sidebar');
				let first 	= document.getElementById('first_side');
				let second 	= document.getElementById('second_side');
				let third 	= document.getElementById('third_side');
				let w = window.innerWidth;
				if(!this.openSidebar){
					first.style.top = '22px';
					third.style.top = '22px';
					sidebar.style.display = 'block';
					setTimeout(() => { 
						sidebar.style.left = '0'; 
						if (this.openNotice) {
							this.noticeToggle();
						}
					}, 100);
					setTimeout(() => {
						second.style.display = 'none';
						first.style.transform = 'rotate(45deg)';
						third.style.transform = 'rotate(-45deg)';
						this.openSidebar = true;
					}, 200)
				} else {
					first.style.transform = 'rotate(0deg)';
					third.style.transform = 'rotate(0deg)';
					setTimeout(() => {
						second.style.display = 'block';
						first.style.top = '14px';
						second.style.top = '22px';
						third.style.top = '30px';
					},200)
					sidebar.style.left = parseInt(w*(-1))+'px';
					setTimeout(() =>{
						sidebar.style.display = 'none';
						this.openSidebar = false;
					}, 300);
				}
			},
			getScrollTop() {
				if(this.hasGroup) return this.$route.meta.page_count * 50 + 'px'
				else {
					if(this.$route.meta.page_count > 3)
						return (this.$route.meta.page_count - 2) * 50 + 'px'	
					else return this.$route.meta.page_count * 50 + 'px'
				}
			}
		}
	}
</script>

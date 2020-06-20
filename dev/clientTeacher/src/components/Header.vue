<template>
	<div>  
		<!-- web -->
		<div class="web-header" v-show="!$mq.phone">
			<div class="header" id="header">
				<div class="left_side_logo">
					<img src="/static/img/logo.png" class="logo" @click="random()">
				</div>
				<div class="header-second-block">
					<!-- <a href="https://wa.me/77476349265?text=Здравствуйте!%20Мне%20нужна%20ваша%20помощь." class="help-me">Тех.поддержка</a> -->	
					<div class="bell" @click='showNotification()'>
						<span class="count-notificate" v-if="isreadNoticesCount">{{isreadNoticesCount}}</span>
						<img src="/static/img/bell.png"  class="bell_icon" >
					</div>
				</div>
			</div>
			<div class="sidebar_web" v-if="!$mq.phone" id='side_web' ref="sidebar">
				<ul class="menu_sidebar_web">
					<li class="li-item-web">
						<router-link to="/profile" class="link-item-web"><fai class="ichd" icon="user"/><span v-if="hideSp">Профиль</span></router-link></li>
					<li class="li-item-web">
						<router-link to="/schedule" class="link-item-web"><fai class="ichd" icon="calendar-alt"/><span v-if="hideSp">Расписание</span></router-link></li>
					<li class="li-item-web">
						<router-link to="/methodics" class="link-item-web"><fai class="ichd" icon="book"/><span v-if="hideSp">Методика</span></router-link></li>
					<li class="li-item-web">
						<router-link to="/chat" class="link-item-web"><fai class="ichd" icon="comments"/><span v-if="unreadMessage" class="unread-data">{{unreadMessage}}</span><span v-if="hideSp">Чат</span></router-link></li>
					<li class="li-item-web">
						<router-link to="/students" class="link-item-web"><fai class="ichd" icon="graduation-cap"/><span v-if="hideSp">Студенты</span></router-link></li>
					<li class="li-item-web">
						<router-link to="/homeworks" class="link-item-web"><fai class="ichd" icon="home"/><span v-if="unverifiedQuizResult" class="unread-data">{{unverifiedQuizResult}}</span><span v-if="hideSp">Задания</span></router-link>	</li>
					<li class="li-item-web">
						<router-link to="/tests" class="link-item-web"><fai class="ichd" icon="tasks"/><span v-if="unreadTestResult" class="unread-data">{{unreadTestResult}}</span><span v-if="hideSp">Тесты</span></router-link>	</li>
					<li class="li-item-web">
						<router-link to="/billing" class="link-item-web"><fai class="ichd" icon="tenge"/><span v-if="hideSp">Биллинг</span></router-link>	</li>
					<li class="li-item-web">
						<span @click="logout()" class="link-item-web"><fai class="ichd" icon="sign-out-alt"/><span v-if="hideSp">Выйти</span></span>	
					</li>
				</ul>
				<div class="web-shortbtn" @click="fullScreen()">
					<fai icon="bars" class="sidebar_button_web" id="sidebar_button" :title="!contentSize ? 'Развернуть меню' : ''" />
					<span v-if="hideSp">Cкрыть</span>
				</div>
			</div>
				<div class="notific_pop_web" id="web_note" :style="web_note">
					<p class="notific_web_title">Уведомления 
						<span class="clear-notific" @click="clearNotice">Очистить</span>
					</p>
					<div class="web-notific-body">
						<div v-for="(notice, index) in notices">
							<span v-if="noticeDateCompare(index)" class="day-notific">{{$functions.dateFormat('dd.mm.yyyy', new Date(notice.dt))}}</span>
							<div class="notification">
								<div class = 'notific_img_block'>
									<img class="notific_img" src="/static/img/bell.png">
								</div>
								<span v-if="!notice.link" class="notific_title">{{notice}}</span>
								<router-link :to="notice.link.str" v-if="notice.link && notice.link.type == 1"  class="notific_title">
									<span @click="deleteNotice(notice, index, 1);">{{notice.content}}</span>
								</router-link>
								<a :href="notice.link.str" v-if="notice.link && notice.link.type == 2" class="notific_title">{{notice.content}}</a>
								<span class="notific-time">{{$functions.dateFormat('HH:MM', new Date(notice.dt))}}</span>
								<img src="/static/img/cancel.png" class="notific-delete" title="Удалить" @click="deleteNotice(notice, index)">
								<p></p>
							</div>
						</div>
					</div>
					<!-- <p class="notific_web_footer">Очистить</p> -->
				</div>
			<div class="notificatons-web" v-show="black" @click="showNotification()"></div>
		</div>
		<!-- web end -->
		<!-- mobile sidebar -->
		<div class="web-mobile" v-show="$mq.phone" >
			<div class="header" id="header-mobile">
				<div class="sidebar_button_mobile" id="sidebar_button" @click="toggleSidebar()" v-if="$mq.phone">
					<div :class="openSidebar ? 'fside-animate' : 'first_side'"></div>
					<div :class="openSidebar ? 'sside-animate' : 'second_side'"></div>
					<div :class="openSidebar ? 'tside-animate' : 'third_side'"></div>
				</div>
				<router-link to="/profile"><img src="/static/img/logo.png" class="logo" @click="random()"></router-link>
				<span class="count-notificate" v-if="isreadNoticesCount">{{isreadNoticesCount}}</span>
				<img src="/static/img/bell_iconll.png" class="logo" @click="noticeToggle()">
			</div>
			<div :class="openSidebar ? 'openMSidebar' : 'closeMSidebar'" id="sidebar">
				<div class="halfclose" @click="toggleSidebar()"></div>
				<ul class="menu_sidebar_mobile">
					<li class="li-item-mobile" @click="toggleSidebar()">
						<router-link to="/profile" class="link-item-mobile">
							<div class="mob_info_inhead">
								<img :src="profile && profile.precontent ? profile.precontent 
																												 : profile && profile.ava ? $functions.checkAva(profile.ava) ?  profile.ava 
																												 																															: $photoUrl + profile.ava 
																												 													: 'static/img/avatar.jpg'" 
								class="mob_photo_header">
								<div class="mob_info_profile_head">
									<span class="nameheader">{{profile.login}} {{profile.lastname}}</span>
									<span class="prlink">{{profile.lvl_name}}</span>
								</div>
								<fai icon="chevron-right" class="chevron-profile" />
							</div>
						</router-link>
					</li>
					<li class="li-item-mobile" @click="toggleSidebar()">
						<router-link to="/schedule" class="link-item-mobile">
							Расписание
						</router-link> 
					</li>
					<li class="li-item-mobile" @click="toggleSidebar()">
						<router-link to="/methodics" class="link-item-mobile">
							Методика
						</router-link> 
					</li>
					<li class="li-item-mobile" @click="toggleSidebar()">
						<router-link to="/chat" class="link-item-mobile link-item-mobile-unread">
							<span>Чат</span>
							<span v-if="unreadMessage" class="unread-data">{{unreadMessage}}</span>
						</router-link> 
					</li>
					<li class="li-item-mobile" @click="toggleSidebar()">
						<router-link to="/students" class="link-item-mobile">
							Студенты
						</router-link> 
					</li>
					<li class="li-item-mobile" @click="toggleSidebar()">
						<router-link to="/tests" class="link-item-mobile">
							<span>Тесты</span>
							<span v-if="unreadTestResult" class="unread-data">{{unreadTestResult}}</span>
						</router-link> 
					</li>
					<li class="li-item-mobile" @click="toggleSidebar()">
						<router-link to="/homeworks" class="link-item-mobile">
							<span>Задания</span>
							<span v-if="unverifiedQuizResult" class="unread-data">{{unverifiedQuizResult}}</span>
						</router-link>
					</li> 
					<li class="li-item-mobile" @click="toggleSidebar()">
						<router-link to="/billing" class="link-item-mobile">
							Биллинг
						</router-link> 
					</li>
					<li class="li-item-mobile" @click="toggleSidebar()">
						<span @click="logout()" class="link-item-mobile">
							Выйти
						</span>	 
					</li>
				</ul>
			</div>
		</div>	
		<div :class="openNotice ? 'openNotice' : 'closeNotice'" id="mobile-notificate" v-if="$mq.phone">
			<p class="mob-notice_head">Уведомления
				<span class="clear-notific" @click="clearNotice">Очистить</span>
			</p>
			<div class="mob-notice_body">
				<div v-for="(notice, index) in notices">
					<!-- <span v-if="noticeDateCompare(index)" class="day-notific">{{$functions.dateFormat('dd.mm.yyyy', new Date(notice.dt))}}</span> -->
					<div class="notification">
						<div class = 'notific_img_block'>
							<img class="notific_img" src="/static/img/bell.png">
						</div>
						<span v-if="!notice.link" class="notific_title">{{notice.content}}</span>
						<router-link :to="notice.link.str" v-if="notice.link && notice.link.type == 0" class="notific_title">
							<span @click="deleteNotice(notice, index, 1);">{{notice.content}}</span>
						</router-link>
						<a :href="notice.link.str" v-if="notice.link && notice.link.type == 1" class="notific_title">{{notice.content}}</a>
						<span class="notific-time">{{$functions.dateFormat('HH:MM dd.mm.yyyy', new Date(notice.dt))}}</span>
						<img src="/static/img/cancel.png" class="notific-delete" title="Удалить" @click="deleteNotice(notice, index)">
						<p></p>
					</div>
				</div>
			</div>
		</div>
		<!-- mobile sidebar end -->
	</div>
</template>

<script>

export default {
  name: 'Header',
	data () {
		return {
			profile: {},
			isreadNoticesCount: 0,
			noticeDate: false,
			notices: [],
			unreadMessage: 0,
			unreadTestResult: 0,
			unverifiedQuizResult: 0,
			// Bauka  magic
			hideSp: this.$store.getters['state/GET_STATE'].state,
		  openSidebar: false,
		  contentSize: true,
		  openNotice: false,
		  black: false,
		  web_note: 'right: -500px'
		}
  },
  created() {
  	let cookieState = this.$getCookie('state')
  	let state = cookieState == 'false'? false : true 
  	this.$store.commit('state/SET_STATE', state)
 
  },
  computed:{
		userInfo() {
			return this.$store.getters['profile/DATA'];
		},
		isOpenSidebar() {
			return this.$store.getters['sidebar/DATA'].isOpenSidebar;
		},
		err(){
			return this.$store.getters['error/DATA'].data;
		},
		noticeAllData() {
			return this.$store.getters['notice/GET_ALL'];
		},
		globalState() {
			return this.$store.getters['state/GET_STATE']
		}
	},
	watch:{
		isOpenSidebar(newState) {
				console.log(newState)
		},
		globalState(newState) {
			this.hideSp = newState.state
		},
		userInfo(newData){
			this.profile = newData.data;
		},
		err(newData){
			throw new Error(newData.path + ' ' + newData.str + ' ' + newData.err);
		},
		noticeAllData(newData) {
			console.log('newData', newData)
			this.unreadMessage = newData.unreadMessage;
			this.unreadTestResult = newData.unreadTestResult;
			this.unverifiedQuizResult = newData.unverifiedQuizResult;
			this.isreadNoticesCount = 0;
			this.notices = []
			for(let i=0; i<newData.notices.length; i++) {
				if(!newData.notices[i].isread) this.isreadNoticesCount++;
				// if (newData.notices[i].link) {	newData.notices[i].link = JSON.parse(newData.notices[i].link)	}
				this.notices.push(newData.notices[i]);
			}
		}
	},
  async mounted() {
		let app = document.getElementById('app')
		if(!app.getAttribute('listener')) {
			app.addEventListener('touchstart', this.touchStart)
			app.addEventListener('touchend', this.touchEnd)
			app.setAttribute('listener', 'true')
		}

		this.getProfileInfo();
		this.$connect();
		this.makeSocket();
		await this.$store.dispatch('notice/GET_ALL');
		await this.getStatus();

		setTimeout(() => {
			this.$socket.send(JSON.stringify({student_id: 37, notice: 5, quiz_id: 18}))
		}, 1000)
		window.addEventListener('resize', ()=>{
			if(this.$mq.phone) {
				this.$store.commit('state/SET_STATE', 1)
			}
		})
  },
  methods:{
		makeSocket(){
			this.$socket.onclose = e => { this.$connect(); this.makeSocket() }
			this.$socket.onerror = e => { console.log(e); }
			this.$socket.onmessage = this.getMessage;
		},
		preLinkFunction(data) {
			if (data && data.link && data.link.type === 1 && data.link.id) {
				if (data.link.str === '/students') {
					this.$store.dispatch('students/SET_STUDENT', data)
				}
			}
		},
		logout(){
			this.$http.post('/account', 'method=LOGOUT')
			.then(res => { 
				if(res.status == 200) window.top.location.reload()
			})
			.catch(err => { console.error(err) })
		},
		getMessage(event){
				let data = JSON.parse(event.data);
				if(!data.notice) return;
				switch(data.notice) {
					case 1:{
									if(!data.isteacher) this.$sound('sms')
									if(this.$route.name == 'Chat') this.$store.dispatch('socket/GET_DATA', data);
									else { 
										if (!data.isteacher) this.$store.commit('notice/UNREAD_MESSAGE_INCREMENT');
									}
								 }break; 
					case 6:
						if(!data.isteacher) 
							this.$store.commit('groups/SET_GROUP_STATUS', {studentId: data.id, status: data.status})
						break
					case 10:{
							this.$sound('bell')
							// if(data.sended) searchMes(data.last);
						let notice = Object.assign({ dt: new Date(), content: data.msg }, data)
						delete notice.msg
						this.notices.unshift(notice); this.isreadNoticesCount++;
					}
					break;
					case 11:  
						if(this.$route.path == '/chat') this.$store.dispatch('socket/GET_WRITING', {dt: new Date().valueOf(), group_id: data.group_id});
						if(!data.isteacher) this.$store.commit('groups/SET_GROUP_STATUS', {studentId: data.id, status: 1})
					break;
					case 111:
						this.$http.post('/account', 'method=LOGOUT')
						.then(res => { 
							if(res.status == 200) window.top.location.reload()
						})
						.catch(err => { console.error(err) })
					break;
				}
		},
		async getStatus(){
			let data = this.$store.getters['notice/GET_ALL'];
			this.unreadMessage = data.unreadMessage;
			this.unreadTestResult = data.unreadTestResult;
			this.unverifiedQuizResult = data.unverifiedQuizResult;
			this.isreadNoticesCount = 0
			this.notices = []
			for(let i=0; i<data.notices.length; i++) {
				if(!data.notices[i].isread) this.isreadNoticesCount++;
				this.notices.push(data.notices[i]);
			}
			if (!data.graphLength) {
				this.$swal({ 
					type: 'info', 
					title: 'Чтобы работать в системе составьте график!',
					showCancelButton: true,
					reverseButtons: true,
				  confirmButtonColor: '#3085d6',
				  cancelButtonColor: '#d33',
				  confirmButtonText: 'Начать',
				  cancelButtonText: 'Отмена' 
				}).then((result) => {
				  if (result.value) {
				  	this.$store.commit('profile/SET_IS_OPEN_GRAPH', 1)
				    this.$router.push({ path: `/profile` })
				  }
				})
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
		readNotice(){
			if (this.isreadNoticesCount) {
				this.$http.post('/api', 'method=READ-NOTICE')
				.then(res => { this.isreadNoticesCount = 0 })
				.catch(err => { console.error(err); })
			}
		},
		clearNotice() {
			this.notices = [];
			this.$http.post('/api', 'method=CLEAR-NOTICE')
			this.$mq.phone ? this.noticeToggle() : this.showNotification();
		},
		deleteNotice(notice, index, close) {
			this.preLinkFunction(this.notices[index])
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
		getProfileInfo(){
			this.$http.post('/api', `method=GET-PROFILE`)
			.then( res =>{ this.$store.dispatch('profile/GET_DATA', res.data.profile) })
			.catch(err => console.error(err))
		},
	// mobile functions
		toggleSidebar(){
			if(this.openSidebar && !this.openNotice){
				this.openSidebar = false;
			}					

			else if(!this.openSidebar && this.openNotice){
				this.openSidebar = true;
				this.openNotice = false;
			}

			else if(!this.openSidebar && !this.openNotice){
				this.openSidebar = true;
			}  		
		},
		noticeToggle(){
			if(this.openNotice && !this.openSidebar){
				this.openNotice = false;
			}						
			else if(!this.openNotice && this.openSidebar){
				this.openNotice = true;
				this.openSidebar = false;
			}else if(!this.openNotice && !this.openSidebar){
				this.openNotice = true;
			} 		
		},
		touchStart(){
			this.sX = event.changedTouches[0].clientX;
		},
		touchEnd(){
			this.eX = event.changedTouches[0].clientX;
			this.calcSwipe();			
		},
		calcSwipe(){
			let calc = this.eX - this.sX
			if(calc > 150){
				if(!this.openSidebar && this.openNotice)      		return this.noticeToggle();
				if(!this.openSidebar && !this.openNotice)        	return this.toggleSidebar();
			}if(calc < -150) {
				if(this.openSidebar && !this.openNotice)      		return this.toggleSidebar();
				if(!this.openSidebar && !this.openNotice)        	return this.noticeToggle();
			}
		},
		// web functions
		fullScreen(){
			let state = this.$store.getters['state/GET_STATE']
			this.$store.commit('state/SET_STATE', !state.state)
		},
		showNotification(){
			let notif = document.getElementById('web_note');
			if(this.black == false){
				notif.style.display = 'block';
				this.readNotice()
				setTimeout(()=>{
				this.web_note = 'right: 27px';
					this.black = true;
				},10 )
			}else{
				this.black = false;
				this.web_note = 'right: -500px'
				setTimeout(()=>{
					notif.style.display = 'none';
				}, 200)
			}
		},
		blured(){
			let header = document.getElementById('header');
			let sidebar = document.getElementById('sidebar_web');
			let content = document.getElementsByClassName('content')[0];
			if(this.addMethod){
				sidebar.style.filter = 'blur(0px)';
				header.style.filter = 'blur(0px)';
				content.style.filter = 'blur(0px)';
			}else{
				sidebar.style.filter = 'blur(3px)';
				header.style.filter = 'blur(3px)';
				content.style.filter = 'blur(3px)';
			}
		},
  }
}
</script>
<style>
	@import url(../assets/css/header-mob.css) (max-width: 768px);
	@import url(../assets/css/header-web.css) (min-width: 768px);
</style>
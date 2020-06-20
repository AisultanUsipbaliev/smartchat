<template>
	<div>	 
		<loading v-if="loading"></loading>
		<transition name="fade" >	
			<div class="web-redact" v-if="redactBlock">
				<div class="redact-form">
					<img src="/static/img/close.png" class="close-redact" @click="openRedact()"/>
					<p class="redact-title">Редактировать</p>
					<div class="block-picture-redact" v-if="!changePass">
						<input type="file" id="userAva" accept="image/*" style="display: none;" ref="inputTypeFile" @change="setAva">
						<img :src="changer.precontent && !tempAva.blob ? changer.precontent 
																												   : tempAva.precontent ? tempAva.precontent 
																												   											: changer.ava ? $functions.checkAva(changer.ava) ? changer.ava 
																												   																																			 : $photoUrl + changer.ava
																												   																		: '/static/img/avatar.jpg'" 
						class="redact-picture">
						<img src="/static/img/cam.png" class="cam-redact" title="Загрузить фото" @click="updateAva">
					</div>
					<div class="input-redact-block" v-if="!changePass">
						<label class="label-redact" for="name">Имя</label>
						<input type="text" class="redact-input" id="name" :style="changer.login_err? {borderColor: 'red'} : ''" v-model="changer.login"
									 @focus="changer.login_err ? changer.login_err = false : ''">
						<label class="label-redact" for="surname">Фамилия</label>
						<input type="text" class="redact-input" id="surname" :style="changer.lastname_err ? {borderColor: 'red'} : ''" v-model="changer.lastname"
									 @focus="changer.lastname_err ? changer.lastname_err = false : ''">
					</div>
					<div class="change-pass" v-if="changePass">
						<div v-for="i in changeLogContent.length">
							<label class="label-redact" :for="changeLogContent[i-1]">{{changeLogTitle[i-1]}}</label>
							<input type="password" class="redact-input" :id="changeLogContent[i-1]" :style="changer[changeLogContent[i-1] + '_err'] ? {borderColor: 'red'} : ''" v-model="changer[changeLogContent[i-1]]" @focus="changer[changeLogContent[i-1] + '_err'] ? changer[changeLogContent[i-1] + '_err'] = false : ''">
							<span class="mes_err" v-if="changer[changeLogContent[i-1] + '_err']">{{switchErr(i-1)}}</span>
						</div>
					</div>
					<div class="redact-block-buttons">
						<button class="change-redact" @click="changePass = !changePass">{{!changePass ? 'Изменить пароль' : 'Изменить данные профиля'}}</button>
						<button class="save-redact" @click="changeInfo()">Сохранить</button>
					</div>
				</div>
			</div>
		</transition>
		<transition name="fade">
			<div class="web-graph" v-if="graphBlock">
				<div class="graph-form">
					<img src="/static/img/close.png" class="close-redact" @click="openGraph()"/>
					<p class="redact-title">Cменить график</p>
					<div class="graph-selects">
						<div class="graph-row" v-for="i in 7">
							<p class="week-day-graph">{{$functions.getFullWeekday(i-1)}}</p>
							<selector :day="i-1" :start="0" :finish="24" ref="days" ></selector>
						</div>
					</div>
					<button class="save-graph" @click="saveGraph()">Сохранить</button>
				</div>
			</div>
		</transition>
		<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
			<div class="profile">
				<div class="profile-first-block">
					<p class="teacher-name-profile">
						{{profile.login}} {{profile.lastname}}
					</p>
					<div class="image-teacher-profile-block">
						<img :src="profile.precontent ? profile.precontent 
																					: profile.ava ? $functions.checkAva(profile.ava) ? profile.ava 
																																												   : $photoUrl + profile.ava 
																												: '/static/img/avatar.jpg'" 
						class="image-teacher-profile">
					</div>
					<div class="stars-rate-profile" :title="profile.rating !== null ? profile.rating : 'У вас ещё нет рейтинга'">
						<img src="/static/img/star.png" class="star-profile" v-for="star in profile.rating^0">
						<img src="/static/img/halfstar.png" class="star-profile" v-if="profile.rating >= Math.floor(profile.rating) + 0.5">
						<img src="/static/img/emptystar.png" class="star-profile" v-for="star in (profile.rating >= Math.floor(profile.rating) + 0.5 ? 4 : 5) - Number(profile.rating^0)">
					</div>
					<p class="level-teacher-profile">
						{{profile.lvl_name}}
					</p>
					<p class="mail-teacher-profile">
						{{profile.email}}
					</p>
					<p class="phone-teacher-profile">
						{{profile.phone}}
					</p>
					<div class="buttons-settings">
						<button class="buttons-profile" @click="openRedact()">Редактировать</button>
						<button class="buttons-profile" @click="openGraph()">Сменить график</button>
					</div>
				</div>
				<div class="profile-third-block" v-if="lessons.length">
					<div class="head-near-lesson">
						<p class="near-lesson-title">
							Ближайшие занятия
							<router-link to="/schedule"><img src="/static/img/down.png" alt="" class="link-head"></router-link>	
						</p>
					</div>
					<div class="body-near-lesson">
						<div class="near-lesson-row" v-for="lesson in lessons">
							<p class="near-lesson-student">{{lesson.group_name}}({{lesson.level.lvl_name}})</p>
							<p class="near-lesson-time"><img src="/static/img/clock.png" alt="" class="near-lesson-clock">{{$functions.getNormalDate(lesson.start, false, true)}}</p>
							<p class="near-lesson-tarif">Тариф: {{lesson.rate_name}}</p>
						</div>
					</div>
				</div>
				<div class="balans-block" v-if="balance.length">
					<div class="head-balans-block">
						<p class="balans-block-title">
							Баланс:
						</p>
						<p class="balans-count">
							{{profile.amount}} {{profile.currency}}
							<router-link to="/billing"><img src="/static/img/down.png" alt="" class="link-head"></router-link>	
						</p>
					</div>
					<div class="body-balans-block">
						<div class="profile-balans-row" v-for="transaction in balance.slice(0, 10)">
							<p class="profile-balans-about">{{transaction.comment}}</p>
							<div class="bottom-balans-block">
								<span class="date-balans">{{$functions.getNormalDate(transaction.dt)}}</span>
								<span class="green-math-balans" :style="transaction.amount < 0 ? {color: 'red'} : ''">{{transaction.amount > 0 ? '+' : ''}}{{transaction.amount}}{{profile.currency}}</span>
							</div>
						</div>
					</div>
				</div> 
			</div>
		</div>
	</div>
</template>
<script>
	import selector from '@/components/partials/selector'
	import Vue from 'vue'
export default{
	name: 'Profile',
	components:{ selector },
	data(){
		return{
			loading: false,
			profile: this.$store.getters['profile/DATA'].data,
			tempAva: {},
			lessons: [],
			balance : [],
			changer: {},
			changeLogTitle: ['Старый пароль','Новый пароль',' Повторите новый пароль'],
			changeLogError: ['Слишком короткий пароль','Новый пароль должен отличаться от старого','Пароли не совпадают','Неверный пароль'],
			changeLogContent: ['oldpass','newpass','repass'],
			// Bauka magic
			redactBlock: false,
			changePass: false,
			graphBlock: false,
			data: []
		}
	},
  computed:{
		userInfo() {
			return this.$store.getters['profile/DATA'];
		},
		isOpenGraphVuex() {
			return this.$store.getters['profile/IS_OPEN_GRAPH'];
		}
	},
	watch:{
		userInfo(newData){
			this.profile = newData.data;
		},
		isOpenGraphVuex(newData) {
			if (newData.isOpenGraph) this.openGraph()
		}
	},
	async mounted(){
		this.loading = true;
		await this.getLessons();
		await this.getBalance();
		if (this.$store.getters['profile/IS_OPEN_GRAPH'].isOpenGraph) this.openGraph()
	},
	methods:{
		switchErr(index){
			switch(index){
				case 0:
					if(this.changer.pass_err.oldShort)
						return this.changeLogError[0]
					else if(this.changer.pass_err.not_true)
						return this.changeLogError[3]; 
					break;
				case 1: 
					if(this.changer.pass_err.newShort)
						return this.changeLogError[0]
					else if(this.changer.pass_err.repeat)
						return this.changeLogError[1]; 
					break;
				case 2: 
					if(this.changer.pass_err.repeat_pass)
						return this.changeLogError[2]; 
					break;
			}
		},
		sendFile() {
			this.changer.precontent = this.tempAva.precontent;
			this.$sendFile(this.tempAva.blob, res => {
				this.tempAva.blob = '';
			}, false, true)
		},
		async changeInfo(){
			let chance = true;
			Vue.set(this.changer, 'pass_err', {})
			if(this.changePass){
				if(this.$functions.validateInput(this.changer, 'oldpass', 6)){
					Vue.set(this.changer.pass_err, 'oldShort', true)
					chance = false;
				}
				if(this.$functions.validateInput(this.changer, 'newpass', 6, this.changer.oldpass, true)){
					if(this.changer.newpass === undefined || this.changer.newpass.length < 6)
						Vue.set(this.changer.pass_err, 'newShort', true)
					else
						Vue.set(this.changer.pass_err, 'repeat', true)
					chance = false;
				}
				if(this.$functions.validateInput(this.changer, 'repass', 6, this.changer.newpass, false)){
					Vue.set(this.changer.pass_err, 'repeat_pass', true)
					chance = false;
				}
				if(!chance) return false;
				this.changer.pass_err = {};
				this.loading = true;
				this.$http.post('/api', `method=UPDATE-PASSWORD&oldpass=${this.changer.oldpass}&pass=${this.changer.newpass}`)
				.then( res => {
					if(res.status === 200) this.openRedact()
					else if(res.status === 202){
						Vue.set(this.changer, 'oldpass_err', true);
						Vue.set(this.changer.pass_err, 'not_true', true)
					}
					else	console.warn(res)
				})
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'UPDATE-PASSWORD'}))
				.finally( ()=> this.loading = false)
			}else{
				if(this.$functions.validateInput(this.changer, 'login')) chance = false; 
				if(this.$functions.validateInput(this.changer, 'lastname')) chance = false;
				if(!chance) return false;
				this.loading = true;
				if(this.tempAva.blob) await this.sendFile();
				this.$http.post('/api', `method=UPDATE-PROFILE&login=${this.changer.login}&lastname=${this.changer.lastname}`)
				.then( res => {
					if(res.status === 200){
						this.$store.dispatch('profile/GET_DATA', this.changer);
						this.openRedact();
					}
					else console.warn(res);
				})
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'UPDATE-PROFILE'}))
				.finally( ()=> this.loading = false)
				this.loading = false
			}
		},
		updateAva() {
			this.$refs['inputTypeFile'].click()
		},
		setAva(e){
			let blob = e.target.files[0];
			Vue.set(this.tempAva, 'precontent', URL.createObjectURL(blob))
			Vue.set(this.tempAva, 'blob', blob)
		},
		getGraph(){
			this.$http.post('/api', `method=GET-GRAPH`)
			.then( res => {
				let servGraph = res.data.graph, graph = [], end = [];
				for(let i = 0; i < servGraph.length; i++)
					graph.push(this.$functions.toClient({start: servGraph[i].start_time, finish: servGraph[i].finish_time, nday: servGraph[i].nday}));
				for(let i = 0; i < graph.length; i++)
					for(let j = 0; j < graph[i].length; j++)
						end.push(graph[i][j])	
					
					for(let i = 0; i < end.length - 1; i++)
						for(let j = i + 1; j < end.length; j++)
							if(end[i].nday === end[j].nday){
								if(end[i].finish < end[j].finish)
									end[i].finish = end[j].finish;
								else
									end[i].start = end[j].start;
								end.splice(j, 1)
								j--;
							}
				this.$store.dispatch('profile/GET_GRAPH', end);
			})
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-GRAPH'}))
		},
		async getLessons() {
			this.$http.post('/api', `method=GET-NEAR-LESSONS`)
			.then( res => this.lessons = res.data.lessons )
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-NEAR-LESSONS'}) )
			return
		},
		async getBalance(){
			this.$http.post('/api', `method=GET-BALANCE`)
			.then( res => this.balance = res.data.balance )
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-BALANCE'}) )
			.finally( () => this.loading = false )
			return
		},
		openRedact(){
			this.changer = JSON.parse(JSON.stringify(this.profile));
			if(this.redactBlock){
				this.tempAva = {};
				this.redactBlock = false;
			}else{
				this.redactBlock = true;
			}
		},
		openGraph(){
			if(this.graphBlock){
				this.graphBlock = false;
				if (this.$store.getters['profile/IS_OPEN_GRAPH'].isOpenGraph) this.$store.commit('profile/SET_IS_OPEN_GRAPH', 0)
			}else{
				this.graphBlock = true;
				this.getGraph();
			}
		},
		saveGraph(){
			let days = this.$refs['days'];
			let toServer = [];
			for(let i = 0; i < days.length; i++)
				if((days[i].sStart >= days[i].sFinish || (days[i].sStart == 'нет' && days[i].sFinish !== 'нет') || (days[i].sStart !== 'нет' && days[i].sFinish == 'нет')) && (days[i].sStart !== 'нет' && days[i].sFinish !== 'нет')){
					days[i].error = true;
					return
				}else if(days[i].sStart !== 'нет' && days[i].sFinish !== 'нет'){
					toServer.push(this.$functions.toServer({start: days[i].sStart, finish: days[i].sFinish, nday: i}))
				}
			let end = [];
			for(let i = 0; i < toServer.length; i++)
				for(let j = 0; j < toServer[i].length; j++)
					end.push(toServer[i][j])
			this.loading = true;
			this.$http.post('/api', `method=UPDATE-GRAPH&graph=${JSON.stringify(end)}`)
			.then( res => {
				this.openGraph();
				this.getGraph();
			})
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'UPDATE-GRAPH'}))
			.finally( ()=> this.loading = false)
		}
	}
}
</script>
<style>
	@import url(../../assets/css/profile.css);
	@import url(../../assets/css/partials.css);
</style>
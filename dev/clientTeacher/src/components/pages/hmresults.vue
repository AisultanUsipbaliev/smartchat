<template>
	<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
		<loading v-if="loader"></loading>
		<div class="infoLine">
			<div class="rechanges" v-if="!search_block">
				<router-link to="/homeworks" class="changes"><fai v-if="$mq.phone" icon="home"/><span v-if="!$mq.phone">Задания</span></router-link>
				<router-link to="/homeresult" class="changes result-changes">
					<span>
						<fai v-if="$mq.phone" icon="check-double"/>
						<span class="unread-data-result" v-if="unverifiedQuizResult">{{unverifiedQuizResult}}</span>
					</span>
					<span v-if="!$mq.phone">
						<span>Результаты</span>
						<span class="unread-data-result" v-if="unverifiedQuizResult">{{unverifiedQuizResult}}</span>
					</span>
				</router-link>
			</div>
			<div class="searches" v-if="!search_block && false">
				<input type="text" class="search_input" placeholder="Поиск" v-if="!$mq.phone">
				<img src="/static/img/zalupa.png" v-if="$mq.phone" @click="search_block = true" class="sort">
				<!-- <img src="/static/img/sort.png" class="sort" > -->
			</div>
			<div class="search_block_st" v-if="search_block">
				<input type="text" class="search_input_st" placeholder="Поиск">
				<img src="/static/img/x.png" class="close_st_input" @click="search_block = false">
			</div>
			<div v-if="showAllResults" @click="getHwresults()" class="changes-btn">
				<span class="button">Показать все</span>
			</div>
		</div>
		<div class="web-hw-lists">
			<div class="web-hw-head-list" v-if="!$mq.phone">
				<span class="web-name-hw">Название</span>
				<span class="web-name-hw">Имя</span>
				<span class="web-name-hw">Дата</span>
				<span class="web-name-hw">Оценка</span>
				<span class="web-name-hw">Действия</span>
			</div>
			<div class="web-hw-body-list">
				<div class="nothing-content" v-if="!homeworks">Результатов нет</div>
				<div class="web-row-hw" v-for="homework in homeworks" :class = "{ 'notchecked': homework.content && !homework.score }">
					<span class="hw-lsd hw-name">{{homework.name}}</span>
					<span class="hw-lsd hw-student-name">{{$mq.phone ? 'Студент: ' : ''}}{{homework.lastname}} {{homework.firstname}}</span>
					<span class="hw-lsd hw-student-date">{{$mq.phone ? 'Дата: ' : ''}}{{homework.dt ? $functions.getNormalDate(homework.dt, true) : '-'}}</span>
					<span class="hw-lsd hw-student-rate">{{$mq.phone ? 'Оценка: ' : ''}}{{Math.round(homework.score * 10) + '%' || '-'}}</span>
					<span class="hw-lsd hw-student-actions">
						<router-link :to="{ name:'HomeResult', params:{id:homework.id}}" v-if="homework.content">{{homework.score? 'Посмотреть' : 'Проверить' }}</router-link>
						<span v-else>Не выполнено</span>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
 
<script>
	export default{
		name: 'HomeworkResults',
		data(){
			return{
  			search_block: false,
  			homeworks: [],
  			loader: false,
				showAllResults: false,
				unverifiedQuizResult: this.$store.getters['notice/GET_ALL'].unverifiedQuizResult
			}
		},
		computed:{
			unverifiedQuizResultVuex() {
				return this.$store.getters['notice/GET_ALL'].unverifiedQuizResult
			}
		},
		watch: {
			unverifiedQuizResultVuex(newData) {
				this.unverifiedQuizResult = newData
			}
		},
		mounted(){
			this.getHwresults();
		},
		methods:{
			getHwresults(){
				this.loader = true;
				let studentId = this.$store.getters['homeresult/DATA'].currentStudentId;
				if (typeof studentId === 'number') {
					this.$http.post('/api', `method=GET-STUDENT-QUIZ-RESULT-LIST&studentId=${studentId}`)
					.then( res => { 
						if(tes.status === 200) this.homeworks = res.data.results; 
						else this.homeworks = null;
						this.showAllResults = true 
					})
					.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-STUDENT-QUIZ-RESULT-LIST'}) )
					.finally( () => { this.loader = false; this.$store.dispatch('homeresult/RESET_STATE') })
				} else {
					this.$http.post('/api', `method=GET-QUIZ-RESULT-LIST`)
					.then( res => {
						if(res.status === 200 )this.homeworks = res.data.results 
						else this.homeworks = null;
					})
					.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-QUIZ-RESULT-LIST'}) )
					.finally( () => { this.loader = false; this.showAllResults = false })
				}
			},
		}
	}
</script>

<style>
	@import url(../../assets/css/homeworks.css);
</style>
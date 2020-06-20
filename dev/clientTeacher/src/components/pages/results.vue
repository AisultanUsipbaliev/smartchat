<template>
	<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
		<loading v-if="loader"></loading>
		<div class="infoLine">
			<div class="rechanges" v-if="!search_block">
				<router-link to="/tests" class="changes"><fai v-if="$mq.phone" icon="tasks"/><span v-if="!$mq.phone">Тесты</span></router-link>
				<router-link to="/results" class="changes result-changes">
					<span>
						<fai v-if="$mq.phone" icon="check-double"/>
						<span class="unread-data-result" v-if="unreadTestResult">{{unreadTestResult}}</span>
					</span>
					<span v-if="!$mq.phone">
						<span>Результаты</span>
						<span class="unread-data-result" v-if="unreadTestResult">{{unreadTestResult}}</span>
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
			<div v-if="showAllResults" @click="getTests()" class="changes-btn">
				<span class="button">Показать все</span>
			</div>
		</div>
		<div class="web-ts-lists">
			<div class="web-ts-head-list" v-if="!$mq.phone">
				<span class="web-name-ts" v-for="title in titles">{{title}}</span>
			</div>
			<div class="web-ts-body-list">
			<div class="nothing-content" v-if="!tests">Тестов нет</div>
				<div class="web-row-ts" v-for="test in tests" :class = "{ 'notchecked': !test.isread && test.done }" >
					<span class="ts-lsd ts-student-test">{{test.firstname}}{{test.lastname}}</span>
					<span class="ts-lsd ts-student-name">{{$mq.phone ? 'Тест: ' : ''}}{{test.test_name}}</span>
					<span class="ts-lsd ts-student-rate">{{$mq.phone ? 'Оценка: ' : ''}}{{test.count}}%</span>
					<span class="ts-lsd ts-student-date">{{$mq.phone ? 'Дата: ' : ''}}{{$functions.getNormalDate(test.dt)}}</span>
					<span class="ts-lsd ts-student-actions">
						<router-link :to="{ name:'TestResult', params:{id:test.result_id} }" v-if="test.done" >{{test.isread? 'Посмотреть': 'Проверить' }}</router-link>
						<span v-else>Не выполнено</span>
					</span>
				</div>
			</div>
		</div>
	</div> 
</template>
 
<script>
	export default{
		name: 'Results',
		data(){
			return{
				tests: [],
				titles: ['Студент','Тест','Оценка','Дата','Действие'],
				search_block: false,
				loader: false,
				showAllResults: false,
				unreadTestResult: this.$store.getters['notice/GET_ALL'].unreadTestResult
			}
		},
		mounted(){
			this.getTests();
		},
		computed:{
			unreadTestResultVuex() {
				return this.$store.getters['notice/GET_ALL'].unreadTestResult
			}
		},
		watch: {
			unreadTestResultVuex(newData) {
				this.unreadTestResult = newData
			}
		},
		methods:{
			getTests(){
				this.loader = true;
				let studentId = this.$store.getters['results/DATA'].currentStudentId;
				if (typeof studentId === 'number') {
					this.$http.post('/api',`method=GET-STUDENT_RESULT-LIST&studentId=${studentId}`)
					.then( res => {  
						this.showAllResults = true 
						if (res.status == 200) {
							this.tests = res.data.result;
						} else {
							this.tests = null;
							console.error(res)
						}
					})
					.catch( err => this.$store.dispatch('error/GET_DATA', { err, path: this.$route.name, str: 'GET-STUDENT_RESULT-LIST' }) )
					.finally( () => { this.loader = false; this.$store.dispatch('results/RESET_STATE') })
				} else {
					this.$http.post('/api',`method=GET-RESULT-LIST`)
					.then( res => {
						if (res.status == 200) {
							this.tests = res.data.result; 
						}else this.tests = null;
					})
					.catch( err => { 
						this.$store.dispatch('error/GET_DATA', { err, path: this.$route.name, str: 'GET-RESULT-LIST' } )
					})
					.finally( () => { this.loader = false; this.showAllResults = false })
				}
			}, 
		}
	}
</script>

<style>
	@import url(../../assets/css/tests.css); 
</style>
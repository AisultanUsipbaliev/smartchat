<template>
	<div>
		<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
			<loading v-if="loader"></loading>
			<router-link :to="{ name:'AddTest', params:{id:'new'} }"><div class="web-ts-new-method" title="Добавить"><fai icon="plus" /></div></router-link>
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
			</div>

			<div class="web-ts-lists">
				<div class="web-ts-head-list" v-if="!$mq.phone">
					<span class="web-name-ts">Тест</span>
					<span class="web-name-ts">Уровень</span>
					<span class="web-name-ts">Дата</span>
					<span class="web-name-ts">Действия</span>
				</div>
				<div class="web-ts-body-list">
					<div class="nothing-content" v-if="!tests">Тестов нет</div>
					<div class="web-row-ts" v-for="(test, i) in tests" :key="i">
						<span class="ts-lsd ts-student-test">{{test.test_name}}</span>
						<span class="ts-lsd ts-student-level">{{$mq.phone ? 'Уровень: ' : ''}}{{test.lvl_name}}</span>
						<span class="ts-lsd ts-student-date">{{$mq.phone ? 'Дата: ' : ''}}{{$functions.getNormalDate(test.dt)}}</span>
						<span class="ts-lsd ts-student-actions">
							<router-link :to="{ name:'AddTest', params:{id:test.test_id} }"><fai icon="pencil-alt" class="redact-test" title="Редактировать"/></router-link>
							<fai @click="confirmDelete = {id:test.test_id, index: i}" icon="trash-alt" title="Удалить" class="delete-test"/></span>
					</div>
				</div>
			</div>
		</div>
		<transition name="fade">
			<div class="confirm-delete" v-show="confirmDelete !== false">
				<div class="confirm-delete-homework">
					<span>Вы уверены что хотите удалить тест?</span>
					<button class="confirm-delete-btn" @click="deleteTest()">Удалить</button>
					<button class="confirm-btn" @click="confirmDelete = false">Отменить</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	export default{
		name: 'Tests',
		data(){
			return{
				search_block: false,
				tests: [],
				confirmDelete: false,
				loader: false,
				unreadTestResult: this.$store.getters['notice/GET_ALL'].unreadTestResult
			}
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
		mounted(){
			this.getTests();
		},
		methods:{
			getTests(){
				this.loader = true;
				this.$http.post('/api', `method=GET-TEST-LIST`)
				.then( res => this.tests = res.data.tests )
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-TEST-LIST'}))
				.finally( () => this.loader = false);
			},
			deleteTest(){
				this.loader = true;
				this.tests.splice(this.confirmDelete.index, 1)
				this.$http.post('/api', `method=DELETE-TEST&test_id=${this.confirmDelete.id}`)
				.then( res => this.confirmDelete = false )
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'DELETE-TEST'}) )
				.finally( () => this.loader = false);
			},
		}
	}
</script>

<style>
	@import url(../../assets/css/tests.css); 
</style>
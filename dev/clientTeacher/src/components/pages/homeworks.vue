<template>
	<div>	
		<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
			<loading v-if="loader"></loading>
			<router-link :to="{ name:'NewQuiz' }"><div class="web-hw-new-method" title="Добавить"><fai icon="plus" /></div></router-link>
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
			</div>

			<div class="web-hw-lists">
				<div class="web-hw-head-list" v-if="!$mq.phone">
					<span class="web-name-hw">Название</span>
					<span class="web-name-hw">Уровень</span>
					<span class="web-name-hw">Действия</span>
				</div>
				<div class="web-hw-body-list">
					<div class="nothing-content" v-if="!homeworks">Заданий нет</div>
					<div class="web-row-hw" v-for="(homework, i) in homeworks">
						<span class="hw-lsd hw-name">{{homework.name}}</span>
						<span class="hw-lsd hw-level">{{$mq.phone ? 'Уровень: ' : ''}}{{homework.lvl_name}}</span>
						<span class="hw-lsd hw-student-actions">
							<router-link :to="{ name:'NewQuiz', query:{id:homework.id} }"><fai icon="pencil-alt" class="redact-test" title="Редактировать"/></router-link>
							<fai @click="confirmDelete = {id:homework.id, index: i}" icon="trash-alt" title="Удалить" class="delete-test"/></span>
					</div>
				</div>
			</div>
		</div>
		<transition name="fade">
			<div class="confirm-delete" v-show="confirmDelete !== false">
				<div class="confirm-delete-homework">
					<span>Вы уверены что хотите удалить домашнее задание?</span>
					<button class="confirm-delete-btn" @click="deleteQuiz()">Удалить</button>
					<button class="confirm-btn" @click="confirmDelete = false">Отменить</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	export default{
		name: 'Homeworks',
		data(){
			return{
  			search_block: false,
  			homeworks: [],
  			confirmDelete: false,
  			loader: false,
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
		methods:{
			deleteQuiz(){
				this.loader = true;
				this.$http.post('/api', `method=DELETE-QUIZ&quiz_id=${this.confirmDelete.id}`)
				.then( res => {
					this.homeworks.splice(this.confirmDelete.index, 1)
					this.confirmDelete = false;
				})
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'DELETE-QUIZ'}))
				.finally( () => this.loader = false )
			},
			getHomeworks(){
				this.loader = true;
				this.$http.post('/api', `method=GET-QUIZ-LIST`)
				.then( res => {
					if(res.status === 200) this.homeworks = res.data.quiz;
					else this.homeworks = null;
				})
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-QUIZ-LIST'}) )
				.finally( () => this.loader = false )
			},
		},
		mounted(){
			this.getHomeworks();
		}
	}
</script>
<style>
	@import url(../../assets/css/homeworks.css);
</style>
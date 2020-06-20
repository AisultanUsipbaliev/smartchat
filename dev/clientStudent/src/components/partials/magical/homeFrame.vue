














<template>
	<div class="homeFrame" v-if="quizList">
		<p class="homeFrame-title">Задания</p>
		<div class="body-homeFrame">
			<div class="rowHomeFrame" v-for="hm in quizList">
				<span class="home-quiz">{{hm.name}}</span>
				<span class="bottom-settings-quiz">
					<span class="date-quiz">{{getDate(hm.dt)}}</span>
					<router-link :to="'/quiz?id=' + hm.id">Выполнить</router-link>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'homeFrame',
		data(){
			return{
				quizList: []
			}
		},
		created(){
			this.$http.post('/api', 'method=get-quiz-list')
			.then(res => {
				if(res.status == 200){
					this.quizList = res.data.quizList;
					console.log(this.quizList)
				}else if(res.status == 202){
					this.quizList = false;
				}
			})
			.catch(err => {
				console.log(err)
			})
		},
		methods:{
			getDate(date){
				let n = new Date(date);
				let day  = n.getDay(date);
				let month  = n.getMonth(date);
				let year  = n.getFullYear(date);
				if(day < 10) day =  '0' + day;
				if(month < 10) month =  '0' + month;
				return day + '.' + month + '.' + year;
			}
		}
	}
</script>
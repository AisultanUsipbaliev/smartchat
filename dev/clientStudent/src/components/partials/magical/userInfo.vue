<template>
	<div class="true-div">
		<div class="student-profile-info">
			<p class="student-name-profile">{{student.firstname}} {{student.lastname}}</p>
			<div class="photo-block-profile">
				<!-- <img src="/static/img/starnight.jpg" class="photo-with-circle"> -->
				<img :src="student.ava? student.ava:ava_replace" class="photo-with-circle">
			</div>
			<div class="level-block">
				<div class="level-about-into-profile">
					<span class="level-name-into-block">
						<img :src="'/static/img/level/' + rank.photo" class="level-picture">
						<span>{{rank.name}}</span>
					</span>
					<span class="level-name-into-block"> {{rank.id}} ур. <fai class="info-circle" v-if="!$mq.phone" @mousemove="infoLevelBlock = true" @mouseleave="infoLevelBlock = false" icon="info-circle"/></span>
				</div>
				<div class="level-up-progress" @mousemove="hint = true" @mouseleave="hint = false">
					<div v-if="hint" class="hint-popup">У вас 
					{{student.score}}
					  очков<!--, до следующего уровня {{pRank != 0 ? ((rank.value - pRank.value) - (student.score - pRank.value)) : ((rank.value - pRank) - (student.score - pRank))}} очков --></div>
					<div class="width-progress" :style="{width: (student.score - (pRank != 0 ? pRank.value : 0)) / (rank.value - (pRank != 0 ? pRank.value : 0)) * 100 + '%'}"></div>
				</div>
				<span class="next-level-experience">до след.уровня {{pRank != 0 ? (rank.value - pRank.value) - (student.score - pRank.value) : 
				(rank.value - pRank) - (student.score - pRank)}} очков</span>
				<transition name="slide-fade">	
					<div class="info-plus-level" v-show="infoLevelBlock">
						<p class="exp-about"><span class="plus-exp-about"> Выполненный тест</span>  <span class="plus-exp">+ 50</span></p>
						<p class="exp-about"><span class="plus-exp-about"> Выполненное задание</span>  <span class="plus-exp">+ 50</span></p>
						<p class="exp-about"><span class="plus-exp-about"> Пройденное занятие</span>  <span class="plus-exp">+100</span></p>
						<p class="exp-about"><span class="plus-exp-about"> Завершение курса</span>  <span class="plus-exp">+500</span></p>
					</div>
				</transition>
			</div>
			<div class="plus-information">
				<p class="english-level-student">{{student.lvl_name}}</p>
				<p class="mail-student">{{student.email}}</p>
				<p class="callmemaybe">{{student.phone}}</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'userInfo',
		data(){
			return{
				student: '',
				rank: '',
				pRank: '',
				infoLevelBlock: false,
				hint: false,
				ava_replace: '/static/img/prog.gif',
			}
		},
		created(){
			this.student = this.$store.getters['user/ALL'].user;

			this.$http.post('/api', 'method=get-profile')
			.then(res => {
				this.rank = res.data.rank;
				if(this.rank.value == 1000)		this.pRank = 0;
				else 							this.pRank = res.data.prevRank;
			})
			.catch(err => {
				console.error(err)
			})
		},
		computed: {
			allInfo() {
		    	return this.$store.getters['user/ALL'];
		  },
		},
		watch: {
    	allInfo (newData) {
 			this.student = newData.user;
    	}
  	}
	}
</script>

<style>
	@import url('../../../assets/styles/pages/web/magical.css');
</style>
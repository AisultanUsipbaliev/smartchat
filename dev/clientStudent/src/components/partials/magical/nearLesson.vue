<template>
	<div class="nearLesson-div">
		<p class="nearLesson-title">Ближайшие занятия</p>
		<div class="body-nearLesson">
			<div class="rowNearLesson" v-for="(lesson, index) in lessons" :key="index">
				<p class="time-nearLesson">
					<img src="/static/img/clock.png" class="clock-png">
					<span>{{getDay(lesson.start)}}</span>
				</p>
				<p class="lessonType">{{lesson.rate_name}}</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'nearLesson',
		data(){
			return{
				lessons: []
			}
		},
		methods:{
			getDay(start){
				let s = new Date(start);
				let sM = this.getMonthName(s.getMonth());
				let sD = s.getDate();
				let sh = PlusNull(s.getHours());
				let sS = PlusNull(s.getMinutes());
				return sM + ' ' + sD + ',' + sh + ':' + sS; 
				function PlusNull(e){
					return e < 10 ? '0' + e : e;
				}
			},
			getMonthName(month){
				switch(month){
					case 0: return 'Январь'; break;
					case 1: return 'Февраль'; break;
					case 2: return ' Март'; break;
					case 3: return 'Апрель'; break;
					case 4: return 'Май'; break;
					case 5: return 'Июнь'; break;
					case 6: return 'Июль'; break;
					case 7: return 'Август'; break;
					case 8: return 'Сентябрь'; break;
					case 9: return 'Октябрь'; break;
					case 10: return 'Ноябрь'; break;
					case 11: return 'Декабрь'; break;
				}
			}
		},
		created(){
			this.$http.post('/api', `method=GET-CHART`)
	  		.then(res =>{
	  			if(res.status === 200){
	  				this.lessons = res.data.chart;
	  			}
	  		})
	  		.catch(err => console.error(err))
		}
	}
</script>
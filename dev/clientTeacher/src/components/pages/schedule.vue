<template>
	<div>
		<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
			<div class="calendar">
				<div>
	      	<h1 class="today_lessons">
		      	<span class="shedule_title">Расписание</span>
	      		<span @click="getSchedule()" class="block-all" :class="all ? 'block-active' : ''">Показать всё</span> 
		      </h1>
	      	<div class="month_days" ref="dmonth">
	        <!-- <img src="/static/img/left.png" class="left_arrow" ref="left_a" @click="prevBtn()"> -->
	        <!-- <img src="/static/img/right.png" class="right_arrow" ref="right_a" @click="nextBtn()"> -->
	        </div>
					<div class="months" @touchend="offSwipe()">
		        <div class="month" v-for="(month, m) in months" :key="m">
							<p class="month_name">{{$functions.getFullMonth(month.month_name)}}</p>
							<div class="month_day" v-for="m in month.array">   
								<span class="week_day">{{$functions.getShortWeekday(m.week_day)}}</span>   
								<span class="day_number" :class="{'current_day' : validateDate(m.date, todayer)}" @click="getSchedule(m.date);">{{m.day}}</span> 
								<div class="action_blue" v-if="m.lesson"></div>  
							</div>
						</div>
					</div>
	      </div>
	    </div>
			<div class="lessons_blocks">
				<div class="nothing-content" v-if="!pseudoschedule.length">Занятий нет</div>
	      <div class="lesson" v-for="(graph, index) in pseudoschedule" :key="index">
	        <h3 class="lesson_name">Занятие {{index+1}}</h3>
	        <p class="time_lesson"><img src="/static/img/clock.png" class="lesson_clock">{{calcTime(graph.start, graph.finish)}}</p>
	        <span class="time_day">{{$functions.getNormalDate(graph.finish,true)}}</span>
	        <p class="level_in_lesson_block">Индивидуальный - Beginner</p>
	        <p class="student_name_in_lesson">{{graph.group_name}}</p>
	      </div>
	    </div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Schedule',
  data () {
    return {
      msg: 'schedule',
      interval: 200,
      current_pos: 0,
      minimum: 0,
      newDate: new Date(),
      schedule: [],
      days: [],
      week_day: [],
      first_month: '',
      month_name: '',
      months: [new Date().getMonth()],
      lessons: [],
      pseudoschedule: [],
      todayer: '',
      all: false
    }
  },
  mounted(){
		this.getDots();
		let today = new Date();
		this.getSchedule(today);
  },
  methods:{
  	validateDate(dat1, dat2){
  		if(dat1 && dat2)
  		if(dat1.getFullYear() === dat2.getFullYear())
  			if(dat1.getMonth() === dat2.getMonth())
  				if(dat1.getDate() === dat2.getDate())
  					return true
  		return false;
  	},
	  getSchedule(date){
	  	let begin = '', end = '';
  		if(date){
  			begin = (new Date(date).setHours(0, 0, 0, 0)).valueOf()
	  		end = begin + (1000*60*60*24);
	  		this.all = false;
	  	}else this.all = true;
			this.$http.post('/api', `method=GET-SCHEDULE&begin=${begin}&end=${end}`)
			.then( res => {
				this.pseudoschedule = res.data.schedule;
		  	this.todayer = date;
			})
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-SCHEDULE'}))
		},
		getDots(){
			this.$http.post('/api', `method=GET-SCHEDULE`)
			.then( res => {
				if(!this.schedule.length) this.schedule = res.data.schedule;
				else this.schedule.concat(res.data.schedule);
				this.createLine()
			})
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-SCHEDULE'}))
		},
		createLine() {
			let date = new Date()
			let start = date
			let finish = new Date(date.valueOf() + 1000*60*60*24*62)
			let days = []
			this.months = []
			while(date.valueOf() <= finish.valueOf()) {
				if(date.getDate() == 1) {
					if (days.length) {
						this.months.push({
							array: days,
							month_name: date.getMonth() - 1
						})
						days = []
					}
				}
				days.push({
					day: date.getDate(),
					week_day: date.getDay(),
					today: start.valueOf() == date.valueOf(),
					date: date,
				})
				for (let i = 0; i < this.schedule.length; i++) {
					let time = new Date(this.schedule[i].finish)
					let lesson_day = time.getDate(this.schedule[i].finish);
					let lesson_month = time.getMonth(this.schedule[i].finish);
					if(date.getDate() == lesson_day && date.getMonth()  == lesson_month){
						days[days.length-1].lesson = true
						break;
					}
				}
				date = new Date(date.valueOf() + 1000*60*60*24);
			}
		},
	  calcTime(start, finish){
			let s = new Date(start);
			let f = new Date(finish);
			let sH = PlusNull(s.getHours());
			let sM = PlusNull(s.getMinutes());
			let fH = PlusNull(f.getHours());
			let fM = PlusNull(f.getMinutes());
			return sH + ':' + sM + ' - ' + fH + ':' + fM;
			function PlusNull(e){
				return e < 10 ? '0' + e : e;
			}
		},
		calcDay(time){
			let t = new Date(time);
			let td = this.$functions.getFullMonth(t.getMonth()) + ', ' + t.getDate();
			return td;
		},
		offSwipe(){
			event.stopPropagation();
		},
	},
}

</script>

<style>
	@import url(../../assets/css/schedule.css);
</style>
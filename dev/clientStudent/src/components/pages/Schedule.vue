<template>
	<div class="content">
		<p v-if="!$mq.phone" class="page_title">Расписание</p>
				<div class="month">
					<img src="static/img/if_Left_arrow_2202280.png" class="left_arrow arrow" @click="changeMonth(-1)">
					<span>{{month}}</span>
					<img src="static/img/if_Right_arrow_2202241.png" class="right_arrow arrow" @click="changeMonth(1)">
				</div>
		<div class="schedule_block">
			<div class="calendar">
				<table class="week_days">
					<tr class="week_name">
						<th>{{!$mq.phone ? 'Понедельник' 	: 'Пн'}}</th>
						<th>{{!$mq.phone ? 'Вторник' 			: 'Вт'}}</th>
						<th>{{!$mq.phone ? 'Среда' 				: 'Ср'}}</th>
						<th>{{!$mq.phone ? 'Четверг' 			: 'Чт'}}</th>
						<th>{{!$mq.phone ? 'Пятница' 			: 'Пт'}}</th>
						<th>{{!$mq.phone ? 'Суббота' 			: 'Сб'}}</th>
						<th>{{!$mq.phone ? 'Воскресенье' 	: 'Вс'}}</th>
					</tr>
				</table>
				<div class="calendar_content">
					<table class="calendar_table">
						<tr class="days" v-for="(week, key) in days" :key="key">
							<td class="td_bgc" v-for="day in week"  :style="tr_style">
								<div class="day" :class="{'another_month': day.last, 'current_day': $mq.phone && day.today}" @click="!day.last && $mq.phone ? getToday(day.date, day) : ''" @mouseover="day.ocup && !$mq.phone && day.ocup[0].hw ? show_task = true : show_task = false">
									<div class="true_div">
										<p class="day_number" :class="{'current_day': day.today, 'action': $mq.phone && day.ocup}">{{day.date}}</p>
									</div>
									<div class="about_lesson_in_calendar" v-for="ocup in day.ocup" v-if="!$mq.phone">
										<p>Занятие</p> 
										<p>{{getTime(ocup.start, ocup.finish)}}</p>
									</div>
									<div class="about_lesson_in_calendar" v-if="day.hw && !mq.phone">
										<p>Занятие</p> 
										<p>Заданий: {{day.hw.length}}</p>
									</div>
								</div>
								<!-- <div class="tasks_modal" v-if="!$mq.phone && day.ocup && day.ocup[0].hw" :style="show_task ? 'opacity: 1' : ''" @mouseover="show_task = true">
									<span v-for="hw in day.ocup[0].hw">{{getShortText(hw.content, 25)}}</span>
								</div> -->
							</td>
						</tr>
					</table>
				</div>
				<span @click="show_today = true" class="button_bottom_open_tasks" v-if="$mq.phone">Информация о занятии 
					<img src="static/img/up_arrow.png" class="downclip">
				</span>
				<div class="tasks_schedule" v-if="$mq.phone" :style="show_today ? 'top: 50px' : 'top: 100%'">
					<span @click="show_today = false" class="close_modal">Посмотреть календарь<img src="static/img/cal.png"></span>
						<p class="full_info">Занятия</p>
					<div class="first_half">
						<p class="lesson_time" v-for="chart in m_charts">
							<img src="static/img/if_171-Time_2124097.png" height="20px">
							<strong >{{getTime(chart.start, chart.finish)}}</strong>
						</p>
						<p class="calendar_day_lesson">
							<img src="static/img/if_Calendar-01_2035005.png" height="20px">
							<strong v-if="info_date">{{info_date.getDate()}}/{{info_date.getMonth() + 1}}/{{info_date.getFullYear()}}</strong>
						</p>
						<p class="teacher_in_info">Преподаватель: <strong>{{teacher}}</strong></p>
						<p class="couse_name_info">Курс: <strong>{{rate}}</strong></p>
					</div>
						<p class="full_info">Задания</p>
					<div class="first_half" v-if="m_tasks">
						<li class="lesson_about_task" v-for="task in m_tasks">{{getShortText(task.content, 40)}}</li>
					</div>
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
      days: [],
      global_date: new Date(),
      month: '',
      tr_style: {height: '20%'},
      start_month: null,
      end_month: null,
      charts: {},
      show_today: false,
      show_task: true,
      // mobile
      m_charts: [],
      info_date: '',
      m_tasks: [],
      teacher: '',
      rate: ''
    }
  },
  methods:{
  	getToday(day, d){
  		if(d) this.m_tasks = d.ocup[0].hw;
  		let dt = this.global_date;
  		dt = new Date(dt.setDate(day));
  		dt = new Date(dt.getTime() - dt.getTime() % 86400000);
  		dt = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60000);
  		let n_dt = new Date(dt.getTime() + (24*60*60*1000)).valueOf();
  		dt = dt.valueOf();
  		this.$http.post('/api', `method=GET-CHART&&begin=${dt}&&end=${n_dt}`)
  		.then(res =>{
  			if(res.status === 200){
  				this.info_date = new Date(dt);
  				this.show_today = true;
  				this.m_charts = res.data.chart;			
  			}
  		})
  		.catch(err => console.error(err))
  	},
  	monthName(){
  		let current_month = this.global_date.getMonth();
  		switch(current_month){
  			case 0: this.month = 'Январь'; break;
  			case 1: this.month = 'Февраль'; break;
  			case 2: this.month = 'Март'; break;
  			case 3: this.month = 'Апрель'; break;
  			case 4: this.month = 'Май'; break;
  			case 5: this.month = 'Июнь'; break;
  			case 6: this.month = 'Июль'; break;
  			case 7: this.month = 'Август'; break;
  			case 8: this.month = 'Сентябрь'; break;
  			case 9: this.month = 'Октябрь'; break;
  			case 10: this.month = 'Ноябрь'; break;
  			case 11: this.month = 'Декабрь'; break;
  		}
  	},
  	paintCalendar(){
  		this.days = [];
	  	this.monthName();
	  	let date = new Date(this.global_date);
			let current_month = date.getMonth();
			let i = 0;
			let mas = [];
			date = new Date(date.setDate(1));
			this.start_month = new Date(date.getTime() - date.getTime() % 86400000);
			this.start_month = new Date(this.start_month.valueOf() + this.start_month.getTimezoneOffset() * 60000).valueOf();
			while(date.getDay() != 1){
				date = new Date(date.setDate(date.getDate() - 1))
			}
			while(date.getMonth() <= current_month || (date.getMonth() == 11 && current_month == 0)){
				if(date.getMonth() == 0 && current_month == 11) break;
				if(date.getMonth() == current_month && date.getDate() == new Date().getDate() && date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth()){
					if(this.$mq.phone){
						this.info_date = new Date(date);
						this.getToday(date.getDate())
					}
					mas.push({date:date.getDate(), today:true, last: false})
				}
				else if(date.getMonth() != current_month)
					mas.push({date:date.getDate(), last:true})
				else mas.push({date:date.getDate(), last:false})
				if(date.getDay() == 0) {
					this.days.push(mas);
					mas = [];
				}
				date = new Date(date.setDate(date.getDate() + 1))
			}
			date = new Date(date.setDate(date.getDate() - 1))
			this.end_month = new Date(date.getTime() - date.getTime() % 86400000 +(24*60*60*1000));
			this.end_month = new Date(this.end_month.valueOf() + this.end_month.getTimezoneOffset() * 60000).valueOf();
			while(date.getDay() != 0){
				date = new Date(date.setDate(date.getDate() + 1))
				mas.push({date:date.getDate(), last:true})
			}
			if(mas[0])
			this.days.push(mas);
			this.tr_style = {height: `calc(100% / ${this.days.length})`};
			this.$http.post('/api', `method=GET-CHART&&begin=${this.start_month}&&end=${this.end_month}`)
			.then(async res =>{
				this.charts = {};
				if(res.data.status === 200){
					this.charts = res.data.chart;
					let data = this.charts[0];
					data.hw = await this.getHW();
					this.charts.splice(0,1, data);
					for (let i = 0; i < this.charts.length; i++){
						let day = new Date(this.charts[i].start).getDate();
						for (let j = 0; j < this.days.length; j++)
							for (let q = 0; q < this.days[j].length; q++){
								if(!this.days[j][q].last)
									if(this.days[j][q].date == day){
										let dat = await this.days[j][q];
										if(!dat.ocup) dat.ocup = [];
										dat.ocup.push(this.charts[i]);
										this.days[j].splice(q, 1, dat);
									}
							}
					}
				}
			})
			.catch(err => console.error(err))
		},
		changeMonth(num){
			this.global_date = new Date(this.global_date.setDate(1))
			this.global_date = new Date(this.global_date.setMonth(this.global_date.getMonth() + num));
			this.paintCalendar();
		},
		async getHW(){
			let data = await this.$http.post('/api', `method=GET-QUIZ-LIST`);
			return data.data.homeworks;
		},
		async getGroup(){
			let data = await this.$http.post('/api', `method=GET-GROUP`);
			if(data.status === 200){
				this.rate = this.$store.getters['user/ALL'].rate.rate_name;
				this.teacher = data.data.teacher.firstname + ' ' + data.data.teacher.lastname;
			}
		},
		ifDateForLes(dt1){
			dt1 = new Date(dt1);
			dt2 = new Date(dt2);
			if(dt1.getFullYear() === dt2.getFullYear() && dt1.getMonth() === dt2.getMonth() && dt1.getDate() === dt2.getDate())
				return true;
			else return false;
		},
		getShortText(text, length){
			if(text.length > length) return text.substring(0, length - 3) + '...';
			else return text;
		},
		getTime(start, finish){
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
		}
  },
  mounted(){
  	this.paintCalendar();
  	this.getGroup();
  }
}
</script>

<style type="text/css" scoped>
  @import url(../../assets/styles/pages/web/shedule.css) (min-width: 768px);
  @import url(../../assets/styles/pages/mobile/shedule.css) (max-width: 768px);
</style>
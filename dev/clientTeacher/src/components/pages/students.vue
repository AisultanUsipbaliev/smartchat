<template>
	<div>
		<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
			<loading v-if="loader"></loading>
			<div class="nothing-content" v-if="!students">Здесь будут студенты состоящие у вас на обучении</div>
			<!-- <div class="infoLine">
				<div class="rechanges" v-if="!search_block">
					<router-link to="/students" class="changes"><fai v-if="$mq.phone" icon="user"/><span v-if="!$mq.phone">Студенты</span></router-link>
				</div>
				<div class="searches" v-if="!search_block">
					<input type="text" class="search_input" placeholder="Поиск" v-if="!$mq.phone">
					<img src="/static/img/zalupa.png" v-if="$mq.phone" @click="search_block = true" class="sort">
				</div>
				<div class="search_block_st" v-if="search_block">
					<input type="text" class="search_input_st" placeholder="Поиск">
					<img src="/static/img/x.png" class="close_st_input" @click="search_block = false">
				</div>
			</div> -->
			<div class="students_list_block">
				<div class="student" v-for="(student, index) in students" :key="index"> 
					<div class="photo">
						<img :src="student.ava ? $functions.checkAva(student.ava) ? student.ava : $photoUrl + student.ava : '/static/img/avatar.jpg'" class="pseudophoto">
					</div>
					<div class="infoStudent">
						<p class="name_in_student_block">{{student.firstname}} {{student.lastname}}</p>
						<p class="level_in_student_block">{{student.lvl_name}}</p>
						<button class="about_student btn" @click="studentPops(index)">Подробнее</button>
					</div>
				</div>
			</div>
		</div>
		<div class="student-info-pops" v-show="studentsPopUp" @touchstart="startSwipe()" @touchend="endSwipe()" >
			<div class="lenta" :style="margin">
				<div v-for="(student, index) in students" :key="index" :class="{'white-block-student' : index == studentIndex, 
				'prev-block-student' : index == studentIndex - 1, 'next-block-student' : index == studentIndex + 1,
				'prev-prev-block' : index == studentIndex - 2, 'next-next-block' : index == studentIndex + 2,
				'display-none' : index < 0 || index  == students.length, 'display-none' : index > studentIndex + 2 || index < studentIndex - 2
				}">
				<div class="not-touchable" v-if="index != studentIndex"></div>
						<img src="/static/img/cancel.png" class="cancel-pops" @click="studentsPopUp = false">
					<div class="white-block">
						<div class="photo-info-student-block">
							<img :src="student.ava ? $functions.checkAva(student.ava) ? student.ava : $photoUrl + student.ava : '/static/img/avatar.jpg'" class="photo-circle-about">
						</div>
						<div class="name-and-other">
							<p class="student-name-student-info">{{student.firstname}} {{student.lastname}}</p>
							<span class="low-info-student">Уровень: <b>{{student.lvl_name}}</b></span>
							<span class="low-info-student">Тариф: <b v-if="student.group_type == 1">Индивидуальный</b></span>
							<!-- <span class="low-info-student">Ближайшие занятия: <b>Monday, 12:00</b></span> -->
							<span class="low-info-student">День рождения: <b>{{getDay(student.birthday)}}</b></span>
						</div>
					</div>
					<div class="buttons-in-info-block">
						<router-link :to="{ name:'Chat' }" class="buttons-baton">
							<span @click="openStudentChat(student.student_id)">Написать</span>
						</router-link>
						<router-link to="/results" class="buttons-baton">
							<span @click="showThisStudentTestResults(student.student_id)">Тесты</span>
						</router-link>
						<router-link to="/homeresult" class="buttons-baton">
							<span @click="showThisStudentQuizResults(student.student_id)">Задания</span>
						</router-link>
					</div>
					<div class="next-prev-student">
						<span class="prev-student" v-if="index != 0" @click="studentIndex--">Пред.</span>
						<span class="next-student" v-if="index != students.length - 1" @click="studentIndex++">След.</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
export default {
	name: 'Students',
	data () {
		return {
		  search_block: false,
		  search_info_st: '',
		  studentsPopUp: false,
		  students: [],
		  studentIndex: null,
		  margin: 'margin-left: 0;',
		  intervalMargin: 0,
		  sX: 0,
		  eX: 0,
		  loader: false
		}
	},
	computed: {
		currentStudent() {
			return this.$store.getters['students/DATA'].currentStudent;
		}
	},
  watch: {
  	currentStudent(newValue, oldValue) {
  		for (let i = 0; i < this.students.length; i++) {
				Vue.set(this.students[i], 'pr', i)
				if (newValue && newValue.link.id == this.students[i].student_id) this.studentPops(i)
			}
  	}
  },
	mounted(){
		this.getStudents();
	},
	methods:{
		openStudentChat(studentId) {
			this.$store.commit('chat/SET_STUDENT_ID', studentId);
		},
		showThisStudentTestResults(studentId) {
			this.$store.dispatch('results/SET_STUDENT_ID', studentId);
		},
		showThisStudentQuizResults(studentId) {
			this.$store.dispatch('homeresult/SET_STUDENT_ID', studentId);
		},
		getStudents(){
			this.loader = true;
			this.$http.post('/api', `method=GET-STUDENTS`)
			.then( res => {
				if(res.status === 200){
					this.students = res.data.students;
					let student = this.$store.getters['students/DATA'].currentStudent
					for (let i = 0; i < this.students.length; i++) {
						Vue.set(this.students[i], 'pr', i)
						if (student && student.link && student.link.id && student.link.id == this.students[i].student_id) this.studentPops(i)
					}
				}else this.students = null;
			})
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-STUDENTS'}))
			.finally( () => this.loader = false);
		},
		startSwipe(){
			this.sX = event.changedTouches[0].clientX;
		},
		endSwipe(){
			this.eX = event.changedTouches[0].clientX;
			event.stopPropagation();
			this.calcSwipe();
		},
		calcSwipe(){
			let calc = this.eX - this.sX;
			if(calc <= -150 && this.studentIndex <= this.students.length - 2){
				this.studentIndex++;
			}
			if(calc >= 150 && this.studentIndex != 0 ){
				this.studentIndex--;
			}
		},
		studentPops(st){
			this.studentsPopUp = true;
			this.studentIndex = st;
		},
		getDay(date){
	    let day = '';
	    day += this.getMonth(new Date(date).getMonth()) + ' '; 
	    day +=new Date(date).getDate() + ', '; 
	    day +=new Date(date).getFullYear();
	    return day;
	  },
		getMonth(date){
			switch(date){
				case 0: return 'Январь'; break;
	      case 1: return 'Февраль'; break;
	      case 2: return 'Март'; break;
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
	beforeDestroy() {
		this.$store.dispatch('students/RESET_STATE')
	}
}
</script>
<style>
	@import url(../../assets/css/students.css);
</style>
<template>
	<div class="about_process">
		<mailon v-show="showMailOn" @close="closeMailOn"></mailon>
		<smson v-show="showSmsOn" @close="closeSmsOn"></smson>
		<p class="level_title">Учебный процесс</i></p>
		<div class="in_process">
			<div class="feedback_process">	
				<div class="info_process">
					<p class="course_name">{{rate.rate_name}}</p>
					<p class="lessons_out">Осталось занятий: {{lessons}}</p>
					<p v-if="nextLesson" class="teacher_name_web">Дата следующего занятия:  {{nextLesson}}</p>
					<p class="teacher_name_web">Преподаватель:  {{teacher.firstname}} {{teacher.lastname}}</p>
				</div>
				<div class="feedback">
					<input id="sms" type="checkbox" v-model="student.smsOn" @click="updateSmsOn" class="checkbox_setting">
					<label for="sms">SMS уведомления</label>
					<br>
					<br>
					<input id="email" type="checkbox" v-model="student.mailOn" @click="updateMailOn" class="checkbox_setting">
					<label for="email">Email уведомления</label>
				</div>
			</div>
		</div>
  </div>
</template> 

<script> 
 
	import mailon from '@/components/popups/mailon'
	import smson from '@/components/popups/smson'

	export default {
	  name: 'userStudyingProccessProfile',
	  data () {
	    return {
	    	showMailOn: false,
	    	showSmsOn: false,
				student: '',
				rate: '',
				teacher: '',
				lessons: '',
				nextLesson: ''
	    }
	  },
	  created(){
			this.student = this.$store.getters['user/ALL'].user;
			this.rate = this.$store.getters['user/ALL'].rate;
			this.teacher = this.$store.getters['user/ALL'].teacher;
			this.lessons = this.$store.getters['user/ALL'].lessons;
			this.nextLesson = this.$store.getters['user/ALL'].nextLesson;
	  },
	  computed: {
		  allInfo() {
		    return this.$store.getters['user/ALL'];
		  },
		},
		watch: {
	    allInfo (newData) {
	 			this.student = newData.user;
	    	this.rate = newData.rate;
	 			this.teacher = newData.teacher;
	 			this.lessons = newData.lessons;
	 			this.nextLesson = newData.nextLesson;
	    }
	  },
	  components: {
			mailon, smson
		},
	  methods: {
	  	closeMailOn: function (data) {
	  		this.showMailOn = false;
	  	},
	  	closeSmsOn: function (data) {
	  		this.showSmsOn = false;
	  	},
      updateSmsOn: function (event) {
	  		event.preventDefault();
	  		if (this.student.smsOn) {
	  			this.$http.post('/api', `method=sms-status&&status=off`)
					.then( res => {
				 		console.log('sms', res.data)
				 		if (res.status == 200) {
				 			console.log('before', this.student.smsOn);
				 			 this.$store.dispatch('user/GET_USER_SMS_ON', 0);
				 		}
					})
					.catch(err => {console.error(err);});
	  		} else {
	  			if (this.student.phone) {
		  			this.$http.post('/api', `method=sms-status&&status=on`)
						.then(async res => {
			 				if (res.status == 200) {
					 			await this.$store.dispatch('user/GET_USER_SMS_ON', 1);
					 		}
						})
						.catch(err => {console.error(err);});
	  			} else {
	  				this.showSmsOn = true;
  				}
	  		}
	  	},
	  	updateMailOn: function (event) {
	  		event.preventDefault();
	  		if (this.student.mailOn) {
	  			this.$http.post('/api', `method=mail-status&&status=off`)
					.then(async res => {
				 		if (res.status == 200) {
				 			await this.$store.dispatch('user/GET_USER_MAIL_ON', 0);
				 		}
					})
					.catch(err => {console.error(err);});
	  		} else {
	  			if (this.student.email) {
	  				if (this.student.activated) {
			  			this.$http.post('/api', `method=mail-status&&status=on`)
							.then(async res => {
				 				if (res.status == 200) {
						 			await this.$store.dispatch('user/GET_USER_MAIL_ON', 1);
						 		}
							})
							.catch(err => {console.error(err);});
	  				} else {
	  					this.showMailOn = true;
	  				}
	  			} else {
	  				this.showMailOn = true;
	  			}
	  		}
	  	}
    }
	}
</script>

<style type="text/css" scoped>
  @import url(../../../assets/styles/pages/web/profile.css) (min-width: 768px);
  @import url(../../../assets/styles/pages/mobile/profile.css) (max-width: 768px);
</style>
<template>
	<div class="block">
		<mailon v-show="showMailOn" @close="closeMailOn"></mailon>
		<smson v-show="showSmsOn" @close="closeSmsOn"></smson>
		<p class="title">Учебный процесс</p>
		<div class="process_round">
			<p class="course_name">{{rate.rate_name}}</p>
			<p class="out_lessons">Осталось занятий: {{lessons}}</p>
			<p v-if="nextLesson" class="teacher_name_mobile">Дата следующего занятия:  {{nextLesson}}</p>
			<p class="teacher_name_mobile">Преподаватель:  {{teacher.firstname}} {{teacher.lastname}}</p>
		</div>
		<div class="change_notificate">
			<div><input type="checkbox" id="sms" class="checkbox" v-model="student.smsOn" @click="updateSmsOn">
				<label for="sms">SMS - уведомления</label>
			</div>
			<div>
				<input type="checkbox" id="mail" class="checkbox" v-model="student.mailOn" @click="updateMailOn">
				<label for="mail">Email - уведомления</label>
			</div>
		</div>
  </div>
</template> 

<script>
	
	import mailon from '@/components/popups/mailon'
	import smson from '@/components/popups/smson'

	export default {
	  name: 'mUserStudyingProccessProfile',
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
				 		if (res.status == 200) {
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
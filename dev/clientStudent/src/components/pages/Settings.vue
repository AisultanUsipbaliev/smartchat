<template>
  <div class="content">
  	<mailon v-show="showMailOn" @close="closeMailOn"></mailon>
		<smson v-show="showSmsOn" @close="closeSmsOn"></smson>
  	<!-- desktop -->
		<p v-if="!$mq.phone" class="page_title">НАСТРОЙКИ</p>
		<div v-if="!$mq.phone" class="settings_block">
			<div class="settings_head"><span>Основная информация</span></div>
			<div class="settings_body">
				<div class="avatar_div">
					<div class="userAvatar">
						<img :src="ava" @click="updateAva" class="avatar">
						<span @click="updateAva" class="ph1">Загрузить фото</span>
					</div>
					<div class="feedback">
						<input id="sms" type="checkbox" v-model="student.smsOn" @click="updateSmsOn" class="checkbox_setting">
						<label for="sms">SMS уведомления</label><br><br>
						<input id="email" type="checkbox" v-model="student.mailOn" @click="updateMailOn" class="checkbox_setting">
						<label for="email">Email уведомления</label>
					</div>
				</div>
				<div class="input_div">
					<label for="name">Имя</label>
					<input class="input_in_settings" id="name" type="text" v-model.trim="firstname" @blur="checkFirstname" @focus="firstnameValidate=''">
					<span v-if="firstnameValidate" class="change_comments_1">{{firstnameValidate}}</span>
					<label for="lastname">Фамилия</label>
					<input class="input_in_settings" type="text" id="lastname" v-model.trim="lastname" @blur="checkLastname" @focus="lastnameValidate=''">
					<span v-if="lastnameValidate" class="change_comments_1">{{lastnameValidate}}</span>
					<label for="born">Дата рождения</label>
					<input class="input_in_settings" id="born" type="date" v-model.trim="birthday" @blur="checkBirthday"  @focus="birthdayValidate=''">
					<span v-if="birthdayValidate" class="change_comments_1">{{birthdayValidate}}</span>
					<label for="mail">E-Mail</label>
					<input class="input_in_settings" id="mail" type="email" v-model.trim="email" @blur="checkEmail" @focus="emailValidate=''">
					<span v-if="emailValidate" class="change_comments_1">{{emailValidate}}</span>
				</div>
			</div>
			<div class="settings_buttons">
				<button class="btn_setting" @click="changePass">Поменять пароль</button>
				<button class="btn_setting" @click="updateProfile">Сохранить</button>
				<button class="btn_setting" @click="$router.go(-1)">Отмена</button>
			</div>
		</div>
		<div v-if="!$mq.phone && showChangePass" id="background" @click="closeChangePass"></div>
		<div v-if="!$mq.phone && showChangePass" class="change_pass">
			<span class="change_pass_title">Поменять пароль</span>
			<img src="static/img/x.png" class="close_change_pass" @click="closeChangePass">
			<label class="label_change_pass" for="old_pass">Старый пароль</label>
			<div class="inputs_row">
				<input class="change_pass_input" type="password" id="old_pass" v-model.trim="oldPassword" @blur="checkOldPassword" @focus="oldPasswordValidate = ''">
				<fai v-if="!oldPasswordValidate && oldPassword" icon="check" class="checkIcon"/>
				<span v-if="oldPasswordValidate" class="change_comments">{{oldPasswordValidate}}</span>
			</div>
			<label class="label_change_pass" for="new_pass">Новый пароль</label>
			<div class="inputs_row">
				<input class="change_pass_input" type="password" id="new_pass" v-model.trim="firstNewPassword" @blur="checkFirstNewPassword" @focus="firstNewPasswordValidate = ''">
				<fai v-if="!firstNewPasswordValidate && firstNewPassword" icon="check" class="checkIcon"/>
				<span v-if="firstNewPasswordValidate" class="change_comments">{{firstNewPasswordValidate}}</span>
			</div>
			<label class="label_change_pass" for="repeat_pass">Повторите новый пароль</label>
			<div class="inputs_row">
				<input class="change_pass_input" type="password" id="repeat_pass" v-model.trim="secondNewPassword" @blur="checkSecondNewPassword" @focus="secondNewPasswordValidate = ''">
				<fai v-if="!secondNewPasswordValidate && secondNewPassword" icon="check" class="checkIcon"/>
				<span v-if="secondNewPasswordValidate" class="change_comments">{{secondNewPasswordValidate}}</span>
			</div>	
			<button class="btn_change_pass" @click="updatePassword">Сохранить</button>
		</div>
		<!-- mobile -->
		<div v-if="$mq.phone" class="settings_block">
			<p class="title">Beginner</p>
			<div class="userAvatar">
				<img :src="ava" @click="updateAva" class="avatar">
				<img @click="updateAva" src="static/img/cam.png" class="ph1">
			</div>
			<div class="form">
				<label for="name">Имя</label>
				<input type="text" id="name" v-model.trim="firstname" @blur="checkFirstname" @focus="firstnameValidate=''">
				<span v-if="firstnameValidate" class="change_comments_1">{{firstnameValidate}}</span>
				<label for="surname">Фамилия</label>
				<input type="text" id="surname" v-model.trim="lastname" @blur="checkLastname" @focus="lastnameValidate=''">
				<span v-if="lastnameValidate" class="change_comments_1">{{lastnameValidate}}</span>
				<label for="born">Дата рождения:</label>
				<input type="date" id="born" v-model.trim="birthday" @blur="checkBirthday"  @focus="birthdayValidate=''">
				<span v-if="birthdayValidate" class="change_comments_1">{{birthdayValidate}}</span>
				<label for="email">E-Mail</label>
				<input type="email" id="email" v-model.trim="email" @blur="checkEmail" @focus="emailValidate=''">
				<span v-if="emailValidate" class="change_comments_1">{{emailValidate}}</span>
			</div>
			<div class="change_notificate">
				<div>
					<input type="checkbox" id="sms" v-model="student.smsOn" @click="updateSmsOn" class="checkbox">
					<label for="sms">SMS - уведомления</label></div>
				<div>
					<input type="checkbox" id="mail" v-model="student.mailOn" @click="updateMailOn" class="checkbox">
					<label for="mail">Email - уведомления</label>
				</div>
			</div>
			<div class="buttons">	
				<button class="btn_settings" @click="updateProfile">Сохранить</button>
				<button class="btn_settings" @click="changePass">Изменить пароль</button>
				<button class="btn_settings" @click="$router.go(-1)">Отмена</button>
			</div>
		</div>
		<div id="black" v-if="$mq.phone && showChangePass" @click="closeChangePassM">
			<div class="change_pass_mobile" id="change_pass_mobile">
				<span class="change_pass_title">Поменять пароль</span>
				<img src="static/img/x.png" class="close_change_pass" @click="closeChangePass">
				<label class="label_change_pass" for="old_pass">Старый пароль</label>
				<div class="inputs_row">
					<input class="change_pass_input" type="password" id="old_pass" v-model.trim="oldPassword" @blur="checkOldPassword" @focus="oldPasswordValidate = ''">
					<fai v-if="!oldPasswordValidate && oldPassword" icon="check" class="checkIcon"/>
				</div>
				<span v-if="oldPasswordValidate" class="change_comments">{{oldPasswordValidate}}</span>
				<label class="label_change_pass" for="new_pass">Новый пароль</label>
				<div class="inputs_row">
					<input class="change_pass_input" type="password" id="new_pass" v-model.trim="firstNewPassword" @blur="checkFirstNewPassword" @focus="firstNewPasswordValidate = ''">
					<fai v-if="!firstNewPasswordValidate && firstNewPassword" icon="check" class="checkIcon"/>
				</div>
				<span v-if="firstNewPasswordValidate" class="change_comments">{{firstNewPasswordValidate}}</span>
				<label class="label_change_pass" for="repeat_pass">Повторите новый пароль</label>
				<div class="inputs_row">
					<input class="change_pass_input" type="password" id="repeat_pass" v-model.trim="secondNewPassword" @blur="checkSecondNewPassword" @focus="secondNewPasswordValidate = ''">
					<fai v-if="!secondNewPasswordValidate && secondNewPassword" icon="check" class="checkIcon"/>
				</div>	
				<span v-if="secondNewPasswordValidate" class="change_comments">{{secondNewPasswordValidate}}</span>
				<button class="btn_change_pass_mobile btn" @click="updatePassword">Сохранить</button>
			</div>
		</div>
		<input type="file"  id="upload_photo" @change="uploadPhoto" accept="image/*" style="visibility: hidden; position: absolute; top: -200vh;">
  </div>
</template>

<script>
import mailon from '@/components/popups/mailon'
import smson from '@/components/popups/smson'
export default {
  name: 'Settings',
  components: {
  	smson,
  	mailon
  },
  data () {
    return {
    	student: {},
    	firstname: '',
    	lastname: '',
    	birthday: '',
    	email: '',
			ava: '',
    	showMailOn: false,
			showSmsOn: false,
			showChangePass: false,
			firstnameValidate: '',
			lastnameValidate: '',
			birthdayValidate: '',
			emailValidate: '',
			oldPassword: '',
			oldPasswordValidate: '',
			firstNewPassword: '',
			firstNewPasswordValidate: '',
			secondNewPassword: '',
			secondNewPasswordValidate: ''
    }
  },
  created() {
  	this.student = this.userInfoMethod();
		this.firstname = this.userInfoMethod().firstname;
		this.lastname = this.userInfoMethod().lastname;
		this.birthday = this.userInfoMethod().birthday;
		this.email = this.userInfoMethod().email;
		this.ava = this.userInfoMethod().ava;
  },
  computed: {
	  userInfo() {
	    return this.$store.getters['user/USER'];
	  }
	},
	watch: {
		userInfo: {
			handler: function (newData) {
				this.student = newData;
				this.firstname = newData.firstname;
				this.lastname = newData.lastname;
				this.birthday = newData.birthday;
				this.email = newData.email;
				this.ava = this.student.ava;
	    },
	    deep: true
	  }
	},
  methods: {
  	updateAva(e){
      document.getElementById("upload_photo").click();
    },
  	uploadPhoto(e){
      let files = e.target.files || e.dataTransfer.files;
      this.ava = '/static/img/prog.gif'
      this.$uploadPhoto(files[0], async res => {
        if(res.status === 200){
          await this.$store.dispatch('user/GET_USER_AVA', res.data.name);
        }
      })
    },
  	updateProfile: function () {
  		if (this.checkFirstname() && this.checkLastname() && this.checkBirthday() && this.checkEmail()) {
  			if (this.firstname == this.student.firstname && this.lastname == this.student.lastname && this.birthday == this.student.birthday && this.email == this.student.email) {
  				this.$swal({
		 				type: 'info',
						title: 'Данные не изменены'
		 			})
  			} else {
  				this.$swal({
		        title: 'Загрузка...',
		        onBeforeOpen: () => {
		          this.$swal.showLoading();
				 			this.$http.post('/api', `method=UPDATE-PROFILE&&firstname=${this.firstname}&&lastname=${this.lastname}&&birthday=${this.birthday.replace(/\-/g,'%2D')}&&email=${this.email}`)
							.then(async res => {
						 		this.$swal.hideLoading();
						 		if (res.status == 200) {
						 			this.$swal({
						 				type: 'success',
										title: 'Данные успешно изменены'
						 			})
						 			await this.$store.dispatch('user/GET_ALL');
						 		} else {
						 			this.$swal({
						 				type: 'error',
										title: 'Не удалось изменить данные'
						 			})
						 		}
							})
							.catch(err => {
								this.$swal.hideLoading();
								this.$swal({
					 				type: 'error',
									title: 'Не удалось изменить данные'
					 			})
							});
						 },
		      })
  			}
  		} else {
  			this.$swal({
	 				type: 'error',
					title: 'Заполните все поля'
	 			})
  		}
    },
  	updatePassword: function () {
  		if (this.checkOldPassword() && this.checkFirstNewPassword() && this.checkSecondNewPassword()) {
  			if (this.oldPassword == this.firstNewPassword) {
  				this.$swal({
		 				type: 'info',
						title: 'Новый пароль не должен совпадать со старым паролем'
		 			})
  			} else {
  				this.$swal({
		        title: 'Загрузка...',
		        onBeforeOpen: () => {
		          this.$swal.showLoading();
				 			this.$http.post('/api', `method=NEW-PASSWORD&&old=${this.oldPassword}&&password=${this.firstNewPassword}`)
							.then(async res => {
								this.$swal.hideLoading();
						 		if (res.status == 200) {
						 			this.$swal({
						 				type: 'success',
										title: 'Пароль успешно изменен'
						 			})
						 		} else {
						 			this.$swal({
						 				type: 'error',
										title: 'Не удалось изменить пароль'
						 			})
						 		}
							})
							.catch(err => {
								this.$swal.hideLoading();
								console.log('err',err)
								if (true || err.response.status && err.response.status == 403) {
									this.$swal({
						 				type: 'error',
										title: 'Не удалось изменить пароль',
										text: 'Неверный пароль'
						 			});
						 			this.oldPasswordValidate = '*Неверный пароль'
								} else {
									this.$swal({
						 				type: 'error',
										title: 'Не удалось изменить пароль'
						 			})
								}
							});
						},
	      	})
  			}
  		} else {
  			this.$swal({
	 				type: 'error',
					title: 'Заполните все поля'
	 			})
  		}
    },
  	checkOldPassword: function () {
      if(this.oldPassword.length > 0){
        this.oldPasswordValidate = '';
        return true;
      } else {
      	this.oldPasswordValidate = '*Введите пароль';
      	return false;
      }
    },
  	checkFirstNewPassword: function () {
      if(this.firstNewPassword.length > 5){
        this.firstNewPasswordValidate = '';
        return true;
      } else if(this.firstNewPassword.length < 6) {
        this.firstNewPasswordValidate = '*Слишком короткий пароль';
        return false;
      } else {
      	this.firstNewPasswordValidate = '*Введите пароль';
      }
    },
  	checkSecondNewPassword: function () {
      if(this.secondNewPassword.length > 0 && this.firstNewPassword === this.secondNewPassword){
        this.secondNewPasswordValidate = '';
        return true;
      } else if(this.secondNewPassword.length == 0) {
        this.secondNewPasswordValidate = '*Введите пароль';
        return false;
      } else {
      	this.secondNewPasswordValidate = '*Пароли не совпадают';
        return false;
      }
    },
  	checkFirstname: function () {
      if(this.firstname.length > 0){
        this.firstnameValidate = '';
        return true;
      } else if(this.firstname.length == 0) {
        this.firstnameValidate = '*Введите имя';
        return false;
      } 
    },
  	checkLastname: function () {
      if(this.lastname.length > 0){
        this.lastnameValidate = '';
        return true;
      } else if(this.lastname.length == 0) {
        this.lastnameValidate = '*Введите фамилию';
        return false;
      } 
    },
  	checkBirthday: function () {
      if(this.birthday && new Date(this.birthday).getFullYear() > 1899 && new Date(this.birthday) < new Date()){
        this.birthdayValidate = '';
        return true;
      } else if(this.birthday && new Date(this.birthday).getFullYear() < 1900 && new Date(this.birthday) > new Date()) {
        this.birthdayValidate = `*Выберите дату от 1900 до ${new Date().getFullYear()}`;
        return false;
      } else {
      	this.birthdayValidate = '*Не корректная дата'
      	return false;
      }
    },
  	checkEmail: function () {
      if(this.email.length > 0 && /^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i.test(this.email)){
        this.emailValidate = '';
        return true;
      } else if(this.email.length == 0) {
        this.emailValidate = '*Введите email';
      } else { 
        this.emailValidate = '*Неверный email!';
      }
      return false;
    },
  	userInfoMethod() {
	    return this.$store.getters['user/USER'];
	  },
  	changePass: function () {
  		this.showChangePass = true;
  		this.oldPassword = '';
			this.oldPasswordValidate = '';
			this.firstNewPassword = '';
			this.firstNewPasswordValidate = '';
			this.secondNewPassword = '';
			this.secondNewPasswordValidate = '';
  	},
  	closeChangePass: function () {
  		this.showChangePass = false
  	},
  	closeChangePassM: function (event) {
  		if (event.target.id == 'black') {
  			this.showChangePass = false;
  		} 
  	},
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
  @import url(../../assets/styles/pages/web/settings.css) (min-width: 768px);
  @import url(../../assets/styles/pages/mobile/settings.css) (max-width: 768px);
</style>
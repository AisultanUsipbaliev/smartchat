<template>
	<div class="mailact"  id="close">

		<div v-show="!countryPopup && !confirmPopup" class="innerAct">
			<img src="static/img/x-men.png" title="Закрыть" @click="closeIcon" class="xclose">
			<p>Введите номер вашего телефона, чтобы получать от нас уведомления</p>
			<label for="country">Выберите страну</label>
			<div class="input input_focus" @click="showCountryPopup"><span id="countryName">{{country.name}}</span>
			</div>
			<img src="static/img/iconfinder_handyArtboard_13_3044149.png" class="right_input">

			<label for="phone">Номер телефона<span class="place_phone">{{country.code}}</span></label>
			<input id="phone" v-bind:class="{'input_focus':phoneState == 2,'input_error':phoneState==1,'input':true}" v-model.trim="phone" @blur='checkPhone' @focus='phoneState=2' @keyup.enter="sendPhone" type="phone" maxlength="10">
			<span v-if="phoneState==1" class="mistake">{{phoneValidate.message}}</span>
			<img v-if="phoneValidate.correct && phoneValidate.check" src="static/img/iconfinder_handyArtboard_13_3044149.png" class="right_input">
			<button class="btn_send" @click="sendPhone">Отправить</button>
		</div>

		<div id="background" v-if="confirmPopup">
			<div v-if="confirmPopup" class="square_mail">
				<img src="static/img/x-men.png" title="Закрыть" @click="confirmPopup = false;" class="xclose">
				<p>Введите код подтверждения</p>
				<label for="code"></label>
				<div class="center_only">
					<input class="input" type="phone" id="code" v-bind:class="{'input_focus':codeState == 2,'input_error':codeState==1,'input':true}" v-model.trim="code" @blur='checkCode' @focus='codeState=2' @keyup.enter="sendConfirmCode"  maxlength="4">
					<span v-if="codeState==1" class="mistake">{{codeValidate.message}}</span>
					<img v-if="codeValidate.correct && codeValidate.check" src="static/img/iconfinder_handyArtboard_13_3044149.png" class="right_input">
					<button class="btn_send" @click="sendConfirmCode">Отправить код</button>
				</div>
			</div>
		</div>

		<div id="background" v-if="countryPopup" @click="hideCountryPopup">
			<div id="modal_country">
				<div class="head_country">
					<span>Выберите страну</span>
					<img src="static/img/x-men.png" @click="countryPopup = false;" title="Закрыть">
				</div>
				<div class="search_country">
					<input type="text" class="input" v-model.trim="search" id="search_country" @keyup="searchCountry()" placeholder="Поиск">
				</div>
				<div class="body_country" id="body_country">
					<div class="country_row" v-for="(item, index) in countries" @click="changeCountry(item, index)" :key="index">
						<span>{{item.name}}</span>
						<span class="number_country">{{item.code}}</span>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>  

<script>

export default {
  name: 'SmsOn',
  data () {
    return {
    	countries: '',
    	country: {
    		name: ''
    	},
    	countryPopup: false,
    	search: '',
    	phone: '',
    	phoneValidate: {
    		correct: false,
    		message: '',
    		check: false
    	},
    	confirmPopup: false,
    	code: '',
    	codeValidate: {
    		correct: false,
    		message: '',
    		check: false
    	},
    	phoneState: 0,
    	codeState: 0
    }
  },
  props:['data'],
  created(){
  	this.$http.post('/account', `method=countries`)
		.then(res => {
	 		if (res.status == 200) {
	 			this.countries = res.data.codes;
	 			if (this.$getCookie('COUNTRY')) {
  				this.country = {
  					name: this.countries[Number(this.$getCookie('COUNTRY'))].name,
  					code: this.countries[Number(this.$getCookie('COUNTRY'))].code,
  					id: this.countries[Number(this.$getCookie('COUNTRY'))].id
  				}
  			} else {
			  	this.country = {
		    		name: 'Kazakhstan',
		    		code: '+7',
		    		id: 1
		    	}
  			}
	 		}
		})
		.catch(err => {console.error(err);});
  },
  methods: {
  	checkCode: function () {
  		if(this.code.length == 4 && !/[-\.;":'a-zA-Zа-яА-Я]/.test(this.code)){
				this.codeValidate.check = true;
				this.codeValidate.correct = true;
				return true;
			} else if(this.code.length == 0) {
				this.codeValidate.message = '*Введите код';
			}	else { 
				this.codeValidate.message = '*Неверный код';
			}
			this.codeValidate.check = false;
			this.codeState = 1;
			this.codeValidate.correct = false;
			return false;
  	},
  	checkPhone: function () {
			if(this.phone.length == 10 && !/[-\.;":'a-zA-Zа-яА-Я]/.test(this.phone)){
				this.phoneValidate.check = true;
				this.phoneValidate.correct = true;
				return true;
			} else if(this.phone.length == 0) {
				this.phoneValidate.message = '*Введите номер';
			}	else { 
				this.phoneValidate.message = '*Неверный номер';
			}
			this.phoneValidate.check = false;
			this.phoneState = 1;
			this.phoneValidate.correct = false;
			return false;
  	},
    closeIcon: function () {
      this.$emit('close',)
    },
		showCountryPopup() {
 			this.countryPopup = true;
 			this.search = '';
 			this.$http.post('/account', `method=countries`)
			.then(res => {
		 		if (res.status == 200) {
		 			this.countries = res.data.codes;
		 		}
			})
			.catch(err => {console.error(err);});
 		},
 		hideCountryPopup(event) {
 			if (event.target&&event.target.id=='background') {
 				this.countryPopup = false;
 			}
 		},
 		changeCountry(data, index) {
			this.$setCookie('COUNTRY', index);
			this.country = data;
			this.countryPopup = false;
  	},
  	searchCountry() {
 			if (this.search.length>0) {
	 			this.$http.post('/account', `method=find&&part=${this.search}`)
	 			.then(res => {
					this.countries = res.data.codes;
				})
				.catch(err => {console.error(err);});
 			} else {
 				this.$http.post('/account', `method=countries`)
				.then(res => {
			 		if (res.status == 200) {
			 			this.countries = res.data.codes;
			 		}
				})
				.catch(err => {console.error(err);});
 			}
 		},
  	sendPhone() {
  		if (this.phone.length>0) {
				this.$http.post('/account', `method=sms&&phone=${this.country.code.replace(/\+/g,'%2B')+this.phone}&&api=1`)
	 			.then(res => {
	 				if (res.data.status == 200) {
						this.code = '';
						this.codeState = 0;
			    	this.codeValidate = {
			    		correct: false,
			    		message: '',
			    		check: false
			    	},
						this.confirmPopup = true;
	 				} else {
	 					this.phoneState = 1;
	 					this.phoneValidate.correct = false;
	 					this.phoneValidate.check = false;
  					this.phoneValidate.message = '*Неверный номер!';
	 				}
				})
				.catch(err => {
					console.error(err);
					this.phoneState = 1;
					this.phoneValidate.correct = false;
					this.phoneValidate.check = false;
  				this.phoneValidate.message = '*Неверный номер!';
				});
  		} else {
  			this.phoneState = 1;
  			this.phoneValidate.correct = false;
  			this.phoneValidate.check = false;
  			this.phoneValidate.message = '*Введите номер!';
  		}
  	},
  	sendConfirmCode() {
  		if (this.phone.length>0) {
				this.$http.post('/api', `method=new-phone&&phone=${this.country.code.replace(/\+/g,'%2B')+this.phone}&&code=${this.code}`)
	 			.then(async res => {
	 				if (res.status == 200) {
						this.confirmPopup = false;
						this.$swal({
							type: 'success',
							title: 'SMS - уведомления включено'
						})
						this.$emit('close');
						await this.$store.dispatch('user/GET_USER_SMS_ON', 1);
	 				} else {
	 					this.codeState = 1;
	 					this.codeValidate.correct = false;
						this.codeValidate.check = false;
	  				this.codeValidate.message = '*Некорректный код!';
		 			}
				})
				.catch(err => {
					this.codeState = 1;
					this.codeValidate.correct = false;
					this.codeValidate.check = false;
  				this.codeValidate.message = '*Некорректный код!';
				});
  		} else {
  			this.codeState = 1;
  			this.codeValidate.correct = false;
				this.codeValidate.check = false;
				this.codeValidate.message = '*Введите код!';
  		}
  	},
  }
}

</script>
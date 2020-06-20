<template>
  	<div class="login-container">
	    <div class="login-content">
	      <div class="logo">
	        <h1>SmartChat</h1>
	      </div>
	      <div class="login-box">
	        <form class="login-form" method="post" v-on:submit.prevent="send">
	          <h3 class="login-head"><i class="fa fa-lg fa-fw fa-user"></i>АДМИН</h3>
	          <div class="form-group">
	            <p class="semibold-text semibold-text_alert show_error" v-if="error_field">{{error_message}}</p>
	          </div>
	          <div class="form-group">
	            <label class="login-label">ПАРОЛЬ</label>
	            <input class="login-input" type="password" name="password" v-model="password" placeholder="Password">
	          </div>
	          <div class="form-group">
	            <button type="submit" class="login-button"><i class="fa fa-sign-in fa-lg fa-fw"></i>ВОИТИ</button>
	          </div>
	        </form>
	      </div>
	    </div>
    </div>
</template>

<script>

export default {
	name: 'Login',
	data () {
    	return {
      		error_field: false,
      		error_message: '',
      		password: ''
    	}
 	},
	methods: {
	    send: function (e) {
			if (!this.password) {
				this.error_field = true;
				this.error_message = 'Заполните поле пароль!';
			} else {
				this.$http.post(`/account`, `method=SIGN&&password=${this.password}`)
				.then(response => {
			 		if (response.status == 200) {
			 			this.$router.replace({ path: '/' });
			 		} else {
			 			this.error_field = true;
					 	this.error_message = 'Ошибка доступа!';
					 	this.password = '';
			 		}
				})
				.catch(e => {
					this.error_field = true;
				 	this.error_message = 'Ошибка доступа!';
				 	this.password = '';
				})
			}
		}
    }
}

</script>

<style src="@/assets/styles/pages/login.css" scoped></style>
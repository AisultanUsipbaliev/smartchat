<template>
  <div class="mailact" @click="close" id="close">

    <div v-if="studentEmail" class="innerPh1">
      <img src="static/img/mailpost.png" class="mailpost">
      <div class="about_active">
        <h3>Активируйте почту</h3>
        <p> Чтобы активировать Email-уведомления. В вашем почтовом ящике {{studentEmail}} перейдите по ссылке активации. Если вы удалили сообщение с ссылкой, попробуйте отправить снова.</p>
        <button class="btn_send" @click="repeat">Отправить</button>
      </div>
    </div>
    
    <div id="background" v-else-if="!studentEmail && emailSendPopup">
      <div class="square_mail">
        <img src="static/img/x-men.png" title="Закрыть" @click="closeMail();" class="xclose">
        <p>Введите ваш Email</p>
        <label for="code"></label>
        <div class="center_only">
          <input class="input" type="email" id="code" v-bind:class="{'input_focus':emailState == 2,'input_error':emailState==1,'input':true}" v-model.trim="email" @blur='checkEmail' @focus='emailState=2' @keyup.enter="sendEmail"  maxlength="45">
          <span v-if="emailState==1" class="mistake">{{emailValidate.message}}</span>
          <img v-if="emailValidate.correct && emailValidate.check" src="static/img/iconfinder_handyArtboard_13_3044149.png" class="right_input">
          <button class="btn_send" @click="sendEmail">Отправить</button>
        </div>
      </div>
    </div>

  </div> 
</template> 

<script>

export default {
  name: 'MailOn',
  data () {
    return {
      emailSendPopup: '',
      email: '',
      emailValidate: {
        correct: false,
        message: '',
        check: false
      },
      emailState: 0,
      studentEmail: ''
    }
  },
  created(){
    this.studentEmail = this.$store.getters['user/USER'].email;
    if (!this.studentEmail) {
      this.emailSendPopup = true
    } else {
      this.emailSendPopup = false
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters['user/USER'].email;
    },
  },
  watch: {
    userInfo (newData) {
      this.studentEmail = newData;
      if (!this.studentEmail) {
        this.emailSendPopup = true
      } else {
        this.emailSendPopup = false
      }
    }
  },
  methods: {
    close: function (event) {
      if (event&&event.target.id == 'close') {
       this.$emit('close');
      }
    },
    closeMail: function () {
      this.$emit('close');
    },
    repeat: function () {
      this.$swal({
        title: 'Загрузка...',
        onBeforeOpen: () => {
          this.$swal.showLoading();
          this.$http.post('/api', `method=repeat`)
          .then(res => {
            this.$swal.hideLoading();
            this.$swal({
              type: 'success',
              title: 'Сообщение отправлено!'
            })
            this.$emit('close');
          })
          .catch(err => {
            this.$swal.hideLoading();
            this.$swal({
              type: 'error',
              title: 'Ошибка',
              text: 'Сообщение не отправлено!'
            })
            this.$emit('close');
          });
        },
      })
    },
    checkEmail: function () {
      if(this.email.length > 0 && /^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i.test(this.email)){
        this.emailValidate.check = true;
        this.emailValidate.correct = true;
        return true;
      } else if(this.email.length == 0) {
        this.emailValidate.message = '*Введите email';
      } else { 
        this.emailValidate.message = '*Неверный email!';
      }
      this.emailValidate.check = false;
      this.emailState = 1;
      this.emailValidate.correct = false;
      return false;
    },
    sendEmail() {
      if (this.email.length>0  && /^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i.test(this.email)) {
        this.$http.post('/api', `method=new-email&&email=${this.email}`)
        .then(async res => {
          if (res.status == 200) {
            await this.$store.dispatch('user/GET_USER_MAIL', this.email);
          } else {
            this.emailState = 1;
            this.emailValidate.correct = false;
            this.emailValidate.check = false;
            this.emailValidate.message = '*Неверный email!';
          }
        })
        .catch(err => {
          this.emailState = 1;
          this.emailValidate.correct = false;
          this.emailValidate.check = false;
          this.emailValidate.message = '*Неверный email!';
        });
      } else {
        this.emailState = 1;
        this.emailValidate.correct = false;
        this.emailValidate.check = false;
        this.emailValidate.message  = '*Введите email!';
      }
    },
  }
}

</script>
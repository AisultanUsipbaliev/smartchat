<template> 
  <div class="container-fluid">    

    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card">
          <div class="card__header ">
            <h2>Общая информация</h2>
            <ul class="card__action">
              <li> 
                <a href="#;"><fai icon="sync-alt"/></a>
              </li>
              <li>
                <a href="#;"><fai icon="expand-arrows-alt"/></a>
              </li>
            </ul>
          </div>
          <div class="card__body settings">
            <div class="row">
              <div class="settings__item col-lg-6 m-0">
                <label for="cost">Стоимость занятия:</label>
                <input id="cost" class="input" type="number" :class="[configData.defaultCost_check?'':'alert-danger']" v-model.trim="configData.defaultCost">                            
              </div>
              <div class="settings__item col-lg-6 m-lg-0">
                <label for="min_students">Минимальное количество студентов в группе: </label>
                <input id="min_students" class="input" type="number" :class="[configData.min_students_check?'':'alert-danger']" v-model.trim="configData.min_students">
              </div>
              <div class="settings__item col-lg-6">
                <label for="trial">Премия за проданный пробный: </label>
                <input id="trial" class="input" type="number" :class="[configData.goodTrial_check?'':'alert-danger']" v-model.trim="configData.goodTrial">
              </div>
              <div class="settings__item col-lg-6">
                <label for="group">Максимальное количество одновременных занятий: </label>
                <input id="group" class="input" type="number" :class="[configData.groups_check?'':'alert-danger']" v-model.trim="configData.max_groups">
              </div>
              <div class="settings__item col-lg-6">
                <label for="default_cost">Стоимость пробного:</label>
                <input id="default_cost" class="input" type="number" :class="[configData.trialDefaultCost_check?'':'alert-danger']" v-model.trim="configData.trialDefaultCost">
              </div>
              <div class="settings__item col-lg-6">
                <label for="max_students">Максимальное количество студентов в группе: </label>
                <input id="max_students" class="input" type="number" :class="[configData.students_check?'':'alert-danger']" v-model.trim="configData.max_students">
              </div>
              <div class="settings__item col-lg-6">
                <label for="teacher">Принимает срочные заявки: </label>
                <select id="teacher" class="select" :class="[configData.quickTeacher_check?'':'alert-danger']" v-model.trim="configData.quickTeacher">
                  <option v-for="item in configData.teachers" :value="item.teacher_id">{{item.fio}}</option>
                </select>
              </div>

            </div>
	          <div class="row">
	        		<div class="settings__item settings__item_pass col-lg-6">
	              <label>Пароль: </label>
	              <button @click="editPass = true" class="btn">
	              	<fai icon="pencil-alt"/> Поменять пароль
	              </button>
	            </div>
              <div class="popup" v-if="editPass">
              </div>
              <transition name="popup-content-fade">
                <div class="popup transparent" v-if="editPass" @click="closePopup">
                  <div class="popup-content" v-if="editPass">
                    <div class="col-lg-12 m-0 p-0"></div>
                    <div class="settings__item col-lg-12">
                      <label class="settings__item" for="old_pass">Старый пароль:</label>
                      <input id="old_pass" class="input" type="password" v-model.trim="oldPass" :class="[oldPass_check?'':'alert-danger']">
                    </div>
                    <div class="settings__item col-lg-12">
                      <label class="settings__item" for="first_new_pass">Новый пароль:</label>
                      <input id="first_new_pass" class="input" type="password" v-model.trim="newPass" :class="[newPass_check?'':'alert-danger']">
                    </div>
                    <div class="col-lg-12 m-0 p-0"></div>
                    <div class="settings__item col-lg-12">
                      <label class="settings__item" for="second_new_pass">Подтвердите пароль:</label>
                      <input id="second_new_pass" class="input" type="password" v-model.trim="confirmNewPass" :class="[confirmNewPass_check?'':'alert-danger']">
                    </div>
                    <div class="card__footer pt-4">
                      <button @click="sendForm" class="btn ml-4">Сохранить</button>
                      <button @click="editPass = false" class="btn ml-4">Отмена</button>
                    </div>
                  </div>
                </div>
              </transition>
	          </div>
          </div>
          <div class="card__footer">
          	<button @click="sendForm" class="btn ml-4">Сохранить</button>
          	<button @click="resetForm" class="btn ml-4">Обновить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
 
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
    	configData: '',
    	configDataOld: '',
      configDropdownShow: false,
      editPass: false,
      oldPass: '',
      newPass: '',
      confirmNewPass: '',
      oldPass_check: true,
      newPass_check: true,
      confirmNewPass_check: true
    }
  },
  created() {
    this.getConfigData();
  },
  methods: {
    closePopup(e){
      if(e.target.classList[0] === "popup")
        this.editPass = false
    },
    closeDropdown() {
      this.configDropdownShow = false;
    },
    getConfigData() {
      this.$http.post(`/api`, `method=GET-SETTINGS`)
      .then(async (response) => {
        console.log('config',response)
        if (response.data.status == 200) {
        	let data = Object.assign({
        		pass_check: true, 
        		students_check: true, 
        		min_students_check: true, 
        		groups_check: true, 
        		quickTeacher_check: true, 
        		defaultCost_check: true, 
        		trialDefaultCost_check: true, 
        		goodTrial_check: true
        	}, response.data.result)
         	this.configDataOld = JSON.parse(JSON.stringify(data));
         	this.configData = data;
        } else { throw new Error(response.statusText); }
      })
      .catch(e => { console.log(e) })
    },
    resetForm() {
    	this.configData = JSON.parse(JSON.stringify(this.configDataOld));
    	this.oldPass = '';
      this.newPass = '';
      this.confirmNewPass = '';    
    },
    clearInputColor() {
      if(this.editPass){
        this.confirmNewPass_check = true;
        this.newPass_check = true;
        this.oldPass_check = true;
      }else{
      this.configData.defaultCost_check = true;
      this.configData.goodTrial_check = true;
      this.configData.groups_check = true;
      this.configData.min_students_check = true;
      this.configData.quickTeacher_check = true;
      this.configData.trialDefaultCost_check = true;
      this.configData.students_check = true;
      }
    },
    validateForm() {
    	let validate = true;

      this.clearInputColor();

      if (this.editPass) {
        if (!this.oldPass.length || !this.newPass.length || !this.confirmNewPass.length) {
          if (!this.oldPass.length) { 
            this.oldPass_check = false;
            validate = false
          }
          if (!this.newPass.length) { 
            this.newPass_check = false;
            validate = false
          }
          if (!this.confirmNewPass.length) { 
            this.confirmNewPass_check = false;
            validate = false
          }      
        } else {
          if (this.newPass != this.confirmNewPass) {
            this.confirmNewPass_check = false;

            if (!validate) {
              this.$swal({
                type: 'error',
                title: 'Ошибка!',
                text: `Правильно заполните все поля, поля не должны быть пустым, пароли не совпадают!`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              });
            } else {
              this.$swal({
                type: 'error',
                title: 'Ошибка!',
                text: `Пароли не совпадают!`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              });
            }

            return false;
          } 
        }
      }else{

        if (!String(this.configData.defaultCost).length)      { this.configData.defaultCost_check = false; validate = false }
        if (!String(this.configData.goodTrial).length)        { this.configData.goodTrial_check = false; validate = false }
        if (!String(this.configData.groups).length)           { this.configData.groups_check = false; validate = false }
        if (!String(this.configData.min_students).length)     { this.configData.min_students_check = false; validate = false }
        if (!String(this.configData.quickTeacher).length)     { this.configData.quickTeacher_check = false; validate = false }
        if (!String(this.configData.trialDefaultCost).length) { this.configData.trialDefaultCost_check = false; validate = false }
        if (!String(this.configData.students).length)         { this.configData.students_check = false; validate = false }

        if (!validate) {
          this.$swal({
            type: 'error',
            title: 'Ошибка!',
            text: `Правильно заполните все поля, поля не должны быть пустым`,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        }

      }

    	return validate;
    },
    sendForm() {
    	let validate = this.validateForm();

    	if (validate) {

        let data = this.configData;
        console.log(data)

        this.$http.post(`/api`, `${this.editPass ? 'method=UPDATE-PASSWORD&new_pass=' + this.newPass + '&old_pass=' + this.oldPass 
                                                 : 'method=UPDATE-SETTINGS&data=' + JSON.stringify(data)}`)
        .then(response => {
          if (response.status == 200) {
            this.$swal({
              type: 'success',
              title: 'Успешно!',
              text: `Данные успешно сохранены`,
              buttonsStyling: false,
              confirmButtonClass: 'swal-btn swal-btn__confirm'
            });
            this.editPass = false;
            this.configDataOld = JSON.parse(JSON.stringify(this.configData));
            console.log(this.configData)

          } else throw new Error(response.statusText);
        })
        .catch(e => {
          this.$swal({
            type: 'error',
            title: 'Ошибка!',
            text: `${this.editPass ? 'Неверный пароль' : 'Правильно заполните все поля'}`,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        })
    	}
    }
  }
}
</script>
<style src="@/assets/styles/pages/settings.css" scoped></style>
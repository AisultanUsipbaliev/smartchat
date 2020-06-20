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
                <label for="cost">Дефолтная цена занятий: sdqqqqqqqq</label>
                <input id="cost" class="input" type="phone" v-model="configData.defaultCost">                            
              </div>
              <div class="settings__item col-lg-6 m-lg-0">
                <label for="trial">Цена проданного преподавателем занятий: </label>
                <input id="trial" class="input" type="phone" v-model="configData.goodTrial">
              </div>
              <div class="settings__item col-lg-6">
                <label for="group">Максимальное количество групп в одно время: </label>
                <input id="group" class="input" type="phone" v-model="configData.groups">
              </div>
              <div class="settings__item col-lg-6">
                <label for="min_students">Минимальное количество студентов в группе: </label>
                <input id="min_students" class="input" type="phone" v-model="configData.min_students">
              </div>
              <div class="settings__item col-lg-6">
                <label for="teacher">Хз что это: </label>
                <input id="teacher" class="input" type="phone" v-model="configData.quickTeacher">
              </div>
              <div class="settings__item col-lg-6">
                <label for="login">Логин админа: </label>
                <input id="login" class="input" type="phone" v-model="configData.login">
              </div>
              <div class="settings__item col-lg-6">
                <label for="default_cost">Цена пробного : </label>
                <input id="default_cost" class="input" type="phone" v-model="configData.trialDefaultCost">
              </div>
              <div class="settings__item col-lg-6">
                <label for="max_students">Максимальное количество студентов в руппе: </label>
                <input id="max_students" class="input" type="phone" v-model="configData.students">
              </div>
            </div>
	          <div class="row">
	        		<div class="settings__item settings__item_pass col-lg-6">
	              <label>Пароль: </label>
	              <button v-if="editPass" @click="editPass = false;" class="btn">
	              	<fai icon="times" />
	              	Скрыть пароль
	              </button>
	              <button v-else @click="editPass = true;" class="btn">
	              	<fai icon="pencil-alt" />
	              	Поменять пароль
	              </button>
	            </div>
	            <div v-if="editPass" class="col-lg-6 m-0 p-0"></div>
	            <div v-if="editPass" class="settings__item col-lg-6">
	              <label class="settings__item" for="old_pass">Старый пароль:</label>
	              <input id="old_pass" class="input" type="text" v-model="oldPass">
	            </div>
	            <div v-if="editPass" class="settings__item col-lg-6">
	              <label class="settings__item" for="first_new_pass">Новый пароль:</label>
	              <input id="first_new_pass" class="input" type="text" v-model="newPass">
	            </div>
	            <div v-if="editPass" class="col-lg-6 m-0 p-0"></div>
	            <div v-if="editPass" class="settings__item col-lg-6">
	              <label class="settings__item" for="second_new_pass">Новай пароль:</label>
	              <input id="second_new_pass" class="input" type="text" v-model="confirmNewPass">
	            </div>
	          </div>
          </div>
          <div class="card__footer">
          	<button @click="resetForm" class="btn ml-4">Обновить</button>
          	<button @click="sendForm" class="btn ml-4">Сохранить</button>
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
      confirmNewPass: ''
    }
  },
  created() {
    this.getConfigData();
  },
  methods: {
    closeDropdown: function () {
      this.configDropdownShow = false;
    },
    getConfigData: function () {
      this.$http.post(`/account`, `method=GET-CONFIG`)
      .then(async (response) => {
        console.log('config',response)
        if (response.data.status == 200) {
        	let data = Object.assign({
        		login_check: true, 
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
    resetForm: function () {
    	this.configData = JSON.parse(JSON.stringify(this.configDataOld));
    	this.oldPass = '';
      this.newPass = '';
      this.confirmNewPass = '';    
    },
    validateForm: function () {
    	let validate = true;

    	this.configData

    	return validate;
    },
    sendForm: function () {
    	let validate = this.validateForm();

    	if (validate) {

    		// ...

    	} else {

    		// ...
    		
    	}
    }
  }
}
</script>
<style src="@/assets/styles/pages/settings.css" scoped></style>
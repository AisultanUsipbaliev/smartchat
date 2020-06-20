<template>
	<transition name="fade">
        <div class="content_settings" v-if="block_id > 4 && block_id < 10 ">
            <p class="page_title">НАСТРОЙКИ</p>
                <div class="blocks" :class="{'zix':block_id == 5 || block_id == 6}">
                    <div class="settings_head"><span>Основная информация</span></div>
                    <div class="settings_body">
                        <div class="avatar_div">
                            <img :src="$tutorialUrl+'images/avatar.jpg'" class="avatar">
                        </div>
                        <div class="input_div">
                            <label for="name">Имя</label>
                            <input class="input_in_settings" id="name" type="text" value="Асылжан">
                            <label for="lastname">Фамилия</label>
                            <input class="input_in_settings" type="text" id="lastname" value="Мухтаров">
                            <label for="born">Дата рождения</label>
                            <input class="input_in_settings" id="born" type="text" value="20.04.1998">
                            <label for="mail">E-Mail</label>
                            <input class="input_in_settings" id="mail" type="email" value="Asylzhan89@gmai.com">
                        </div>
                    </div>
                    <div class="settings_buttons">
                        <button class="btn_setting" @click="nextSlide()" :class="{'zis':block_id == 6}">Поменять пароль</button>
                        <button class="btn_setting">Сохранить</button>
                        <button class="btn_setting">Отмена</button>
                    </div>
                </div>
        <div class="change_pass zix" v-if="block_id == 7">
            <span class="change_pass_title">Поменять пароль</span>
            <label class="label_change_pass" for="old_pass" >Старый пароль</label>
            <input class="change_pass_input" type="text" v-if="standard_pass == true" value="smartchat" disabled id="old_pass">
            <input class="change_pass_input" type="text" v-if="standard_pass == false" id="old_pass">
            <label class="label_change_pass" for="new_pass">Новый пароль</label>
            <input class="change_pass_input" type="password" id="new_pass">
            <label class="label_change_pass" for="repeat_pass">Повторите новый пароль</label>
            <input class="change_pass_input" type="password" id="repeat_pass">
            <button class="btn_change_pass" @click="plusId()">Сохранить</button>
        </div>
        </div>

    </transition>
</template>

<script>
export default {
	name: 'settings',
	data () {
		return {
			standard_pass: true
		}
	},
	methods:{
		nextSlide(){
			if(this.block_id == 6){
				this.plusId();
			}
		},
		plusId(){
            this.$emit('plusId')    
        }
	},
	props: ['block_id']
}
</script>
<style>
  @import url(../../../assets/tutorial_styles/settings.css);
</style>
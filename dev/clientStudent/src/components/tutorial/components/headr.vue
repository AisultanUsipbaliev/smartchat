<template>
	<div>
		<header>
	        <img :src="$tutorialUrl+'images/logo.png'" class="logo" >
	        <div class="left_header_div">
	          <div class="bell">
	            <img :src="$tutorialUrl+'images/bell.png'" class="bell_icon">
	            <span class="bell_count">3</span>
	          </div>
	          <div class="profile" :class= "{'zis':block_id==3}" @click="plusId()">
	            <img :src="$tutorialUrl+'images/avatar.jpg'" class="header_profile">
	            <span class="username">Асылжан Мухтаров</span>
	            <img :src="$tutorialUrl+'images/if_down_1167972.png'" class="all_settings">
	          </div>
	        </div>
	    </header>

	    <transition name="fade">
	        <div class="settings_profile" id="settings_profile" v-if="menu_header" :class="{'zis':block_id == 4}">
	            <a>Профиль</a>
	            <a @click="plusId()">Настройки</a>
	            <a>Выйти</a>
	        </div>
	    </transition>

	    <div class="sidebar">
        <ul class="menu_ul">
            <li :class="{'active_li_side': block_id == 8, 'active': block_id < 8}" tool="Профиль"><a><fai icon="user"/></a></li>
            <li :class="{'active_li_side': block_id == 9, 'active': block_id > 9 && block_id < 16}" @click="plusId()" tool="Тарифы"><a><fai icon="graduation-cap"/></a></li>
            <li :class="{'active_li_side': block_id == 16, 'active': block_id > 16 && block_id < 18}" @click="plusId()" tool="Расписание"><a><fai icon="calendar-alt"/></a></li>
            <li :class="{'active_li_side': block_id == 18, 'active': block_id > 19 && block_id < 25}" @click="plusId()" tool="Чат"><a><fai icon="comments"/></a></li>
            <li :class="{'active_li_side': block_id == 29, 'active': block_id > 29 && block_id < 31}" @click="plusId()" tool="Тесты"><a><fai icon="tasks"/></a></li>
            <li :class="{'active_li_side': block_id == 31, 'active': block_id > 31 && block_id < 34}" @click="plusId()" tool="Домашнее задание"><a><fai icon="home"/></a></li>
            <li tool="Отзыв" :class="{'active_li_side': block_id == 34}" @click="plusId()"><a><fai icon="thumbs-up"/></a></li>
            <li tool="FAQ"><a><fai icon="question"/></a></li>
        </ul>
    </div> 
	</div>
</template>

<script type="text/javascript">
export default {
	name: 'headr',
	props: ['block_id', 'menu_header'],

	data () {
		return {
		}
	},
	methods:{
		plusId() {
            this.$emit('plusId')    
        },
	},
	watch: {
		menu_header(v) {
			console.log('AAA: ', v)
		}
	}
}
</script>
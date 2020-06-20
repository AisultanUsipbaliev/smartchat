<template>
	<header class="app-header">
	  <a class="app-header__logo">Smart Chat</a>
	  <a class="app-sidebar__toggle" v-on:click="sidebarToggled()">
	  	<fai icon="bars" size="lg"/>
	  </a>
	  <ul class="app-nav">
	    <li class="app-search">
	      <input class="app-search__input" type="search" placeholder="Search">
	      <button class="app-search__button"><fai icon="search"/></button>
	    </li>
	    <li class="dropdown">
	      <a class="app-nav__item pos-relative" href="#" data-toggle="dropdown" @click="swapBells()" aria-label="Show notifications">
	        <fai icon="bell" size="lg"/>
	        <div class="new-messages" v-if="notices.length && newMessages">{{notices.length < 100 ? notices.length : '99+'}}</div>
	      </a>
	    </li>
	    <li class="dropdown"><a class="app-nav__item" href="#" data-toggle="dropdown" aria-label="Open Profile Menu">
	      <fai icon="sign-out-alt" size="lg"/>
	    </a>
	    </li>
	  </ul>
		<div class="bells" v-show="bells">
			<span class="notific_count" v-if="notices.length">У вас {{notices.length}} {{checkNoticeLength()}}!</span>
			<div class="messages">
				<p class="nope-notification" v-if="!notices.length">У вас нет новых уведомлений</p>
				<p class="notification" v-for="notice in notices">{{notice}}</p>
			</div>
			<div class="all_nots" @click="goToJournal()">Посмотреть все уведомления!</div>
		</div>
	</header>

</template>

<script>
export default {
  name: 'Header',
  data(){
  	return{
  		bells: false,
  		newMessages: true,
  		notices: ['Hello']
  	}
  },
  methods: {
  	goToJournal(){
			this.bells = false;  		
			this.$router.replace({ path: '/journal' })
  	},
  	swapBells(){
  		if(this.bells === true)
  			this.notices = [];
  		this.newMessages = !this.newMessages;
  		this.bells = !this.bells;
  	},
  	checkNoticeLength(){
  		let length = this.notices.length, str;
  		if(length % 10 === 1)
  			str = 'уведомление'
  		else if(length % 10 < 5)
  			str = 'уведомления'
  		else
  			str = 'уведомлений'
  		return str;
  	},
  	sidebarToggled(e) { 
  		document.body.classList.toggle('sidenav-toggled') 
  	}
  }
}
</script>

<style scoped>
.bells{
	font-weight: 200;
	position: absolute;
	right: 75px;
	top: 55px;
	background-color: #fff;
	color: black;
	border-radius: 2px;
	box-shadow: 0 0  5px black;
	overflow: hidden;
	font-size: 16px;
	z-index: 999;
}
.notific_count{
	text-align: center;
    display: block;
    padding: 8px;
    background:  rgba(0, 150, 136);
    cursor: default;
    color: white;
}
.notification{
	margin: 0;
	padding: 5px 10px;
	display: block;
	font-size: 16px;
	background-color: #f7f7f7;
	cursor: pointer;
}
.notification:hover{
	background-color: #e0e0e0;
}
#background{
	position: fixed;
	width: 100%;
	height: 100vh;
	top: 0;
	z-index: 998;
	left: 0;
	display: none;
}
.messages{
    height: 140px;
    overflow-y: scroll;
}
::-webkit-scrollbar{
    width: 8px;
}
::-webkit-scrollbar-thumb{
    border-width:1px 1px 1px 2px;
    border-color: #777;
    background-color: teal;
    border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover{
    border-width: 1px 1px 1px 2px;
    border-color: #555;
    background-color: #777;
}
::-webkit-scrollbar-track{
    border-width:0;
    background-color: #aaa;
}
.all_nots{
	display: block;
  text-align: center;
  padding: 8px 0;
  background:  rgba(0, 150, 136);
  color: white;
  text-decoration: none;
  cursor: pointer;
}
.all_notice{
	display: flex;
	flex-wrap: wrap;
	user-select: none;
}
.notice{
	border-radius: 10px;
  background: #dadada;
  overflow: hidden;
  margin-bottom: 20px;
	cursor: pointer;
	width: 48%;
	margin: 1%;
}
.notice_head{
	margin: 0;
	padding: 10px;
	display: flex;
  justify-content: space-between;
	background:  rgba(0, 150, 136);
}
.notice_text{
	padding: 10px;
	margin: 0;
}
.nope-notification{
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
	color: #e5e5e5;
}
.pos-relative{
	position: relative;
}
.new-messages{
	position: absolute;
	left: 25px;
	top: 4px;
	background-color: #f00;
	color: #fff;
	font-size: 12px;
	width: auto;
	padding: 1px;
	min-width: 15px;
	height: 15px;
	font-weight: 600;
	border-radius: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>





<template>
	<div id="app">
		<v-header></v-header>
		<div :class="[state? 'minContent': 'maxContent']">
			<router-view/>
		</div>
	</div>
</template>

<script>
import Header from '@/components/Header'
export default {
	name: 'App',
	data() {
		return {
			state: true
		}
	},
	components:{
		vHeader: Header
	},
	created() {
		this.$root.move = 0;
		// let e = a;
	},
	computed: {
		getState() {
			return this.$store.getters['state/GET_STATE']
		}
	},
	watch: {
		getState(newState) {
			this.state = newState.state
			this.toogleSidebar()
			// console.log('Новое ', newState.state)
		}
	},
	methods: {
		toogleSidebar(){
			let side_web = document.getElementById('side_web')
			if(side_web) side_web.style.width = this.state? '200px' : '50px'
		},
	}
}
</script>
<style>
	@media screen and (min-width: 768px){
		::-webkit-scrollbar {
		  width: 7px;
		  height: 7px;
		}
		::-webkit-scrollbar-button {
		  width: 0px;
		  height: 0px;
		}
		::-webkit-scrollbar-thumb {
		  background: #d8d8d8;
		  border: 0px none #ffffff;
		  border-radius: 50px;
		}
		::-webkit-scrollbar-thumb:hover {
		  background: #c0c0c0;
		}
		::-webkit-scrollbar-thumb:active {
		  background: #c0c0c0;
		}
		::-webkit-scrollbar-track {
		  background: transparent;
		  border: 0px none #ffffff;
		  border-radius: 50px;
		}
		::-webkit-scrollbar-track:hover {
		  background: #eaeaea;
		}
		::-webkit-scrollbar-track:active {
		  background: #eaeaea;
		}
		::-webkit-scrollbar-corner {
		  background: transparent;
		}
	}
	.nothing-content{
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  background-color: transparent;
	  color: #1e83d4;
	  width: 100%;
	  height: 100%;
	  font-size: 2em;
	}
	@media screen and (max-width: 768px){
		body{
			overflow: hidden;
			overflow-y: hidden;
			overflow-x: hidden;
		}
		.sidebar{
			display: none;
		}
		.content{
			width: 100vw;
			left: 0;
			height: calc(100vh - 50px);
			box-sizing: border-box;
			overflow: hidden;
			overflow-y: scroll;
			padding-bottom: 40px;
		}
		*{
			cursor: default!important;
			outline: none!important;
		}
	}
@media screen and (min-width: 768px){
	.minContent #content {
		/*открытое меню*/
		width: calc(100% - 200px);
		left: 200px;
		transition: .3s ease;
		position: absolute;
	}

	.maxContent #content {
		/*закрытое меню*/
		transition: .3s ease;
		left: 50px;
		width: calc(100% - 50px);
		position: absolute;
	}
}
</style>
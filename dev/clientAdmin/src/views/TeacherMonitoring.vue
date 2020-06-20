<template>
  <div class="main_now">
    <div class="first">
    	<div class="status"></div>
		<div class="online">
			<p class="name_st w3">111</p>
			<p class="tarif_st w3">tarif</p>
		</div>
	</div>

	<div class="second">
		<div class="online">
			<p class="name_pr w3">111</p>
			<p class="tarif_pr w3">Онлайн</p>
		</div>
	</div>

	<div class="third">
		<div class="online">
			<p class="name_td w3">111</p>
			<p class="tarif_td w3">tarif</p>
			<p class="time_td w3">11:00 - 12:00</p>
		</div>
	</div>

	<div class="forth">
		<div class="online">
			<p class="name_sc w3">111</p>
			<p class="tarif_sc w3">tarif</p>
			<p class="time_sc w3">11:00</p>
		</div>
	</div>
  </div>
</template>

<script>
export default {
  name: 'TeacherMonitoring',
  data () {
    return {
      msg: 'TeacherMonitoring'
    }
  }
}
</script>

<style scoped>
.main_now{
	z-index: 9999;
	position: absolute;
	left: 0;
	top: 0;
}
.first{
	position: absolute;
	height: 50vh;
	background-color: #c1edff;
	width: 50vw;
	left: 0;
	top: 0;
}
.second{
	left: 50vw;
	height: 50vh;
	width: 50vw;
	background-color: #fffabd;
	top: 0;
	position: absolute;
}
.third{
	left: 0;
	top: 50vh;
	position: absolute;
	background-color: #c1ffbd;
	height: 50vh;
	width: 50vw;
}
.forth{
	left: 50vw;
	top: 50vh;
	position: absolute;
	background-color: #ffbdc3;
	height: 50vh;
	width: 50vw;
}
.w3{
	font-size: 18px;
	width: 100%;
	display: flex;
	justify-content: center;;
}
.online{
	display: flex;
	padding: 10px;
	border-bottom: 1px solid gray;
	font-size: 18px;
	width: 100%;
}
</style>
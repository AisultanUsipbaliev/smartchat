<template>
	<div class="faq">
		<div class="schedule_title"><span>Задания</span></div>
    <div class="schedule_body">
      <div v-for="item in homework" class="homework_schedule_link">
        <router-link :to="{ path:'homework', query: { id: item.id } }" class="homework_schedule" tag="div">
          <p v-line-clamp:20="2" class="task_title_a">{{item.content}}</p>
          <p class="task_time">{{ dateIsoToLocal(item.dt) }}</p>
        </router-link>
      </div>
    </div>
    <router-link :to="{ path:'homeworks' }" class="schedule_footer">
      <a class="all_schedule">Все задания</a>
    </router-link>
	</div>
</template> 

<script>

export default {
  name: 'homeworkProfile',
  props:['homework'],
  methods: {
    dateIsoToLocal: function (date) { return new Date(date).toLocaleString().split(",")[0]; },
  }
}

</script>
<style type="text/css" scoped>
  @import url(../../../assets/styles/pages/web/profile.css) (min-width: 768px);
  @import url(../../../assets/styles/pages/mobile/profile.css) (max-width: 768px);
</style>
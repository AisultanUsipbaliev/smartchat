<template>
	<div class="block">
   <p class="homework_title">Задания</p>
    <div class="schedule_body">
      <div class="homework_schedule_link" v-for="item in homework">
        <router-link :to="{ path:'homework', query: { id: item.id } }" class="homework_schedule" tag="div">
          <p v-line-clamp:20="2" class="task_title_a">{{item.content}}</p>
          <p class="task_time">{{ dateIsoToLocal(item.dt) }}</p>
        </router-link>
      </div>
    </div>
    <router-link :to="{ name:'Homework' }" class="schedule_footer">
      <p class="all_schedule all_schedule_btn">Все задания</p>
    </router-link> 
  </div>
</template> 

<script>
  export default {
    name: 'mHomeworkProfile',
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
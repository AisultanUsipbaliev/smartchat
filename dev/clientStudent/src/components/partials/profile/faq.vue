<template>
	<div class="faq">
    <div class="schedule_title"><span>FAQ</span></div>
    <div class="schedule_body">
      <div class="homework_schedule_link" v-for="item in faq">
        <router-link :to="{ name:'Faq', query: { id: item.id } }" class="homework_schedule" tag="p">
          <p v-line-clamp:20="2"  class="task_title_a">{{item.question}}</p>
          <p class="task_time">{{item.counter}} человек посчитали этот ответ полезным</p>
        </router-link>
      </div>
    </div>
    <router-link :to="{ name:'Faq' }" class="schedule_footer">
      <p class="all_schedule">Все вопросы</p>
    </router-link>
	</div>
</template> 

<script>

export default {
  name: 'faqProfile',
  props:['faq']
}

</script>
<style type="text/css" scoped>
  @import url(../../../assets/styles/pages/web/profile.css) (min-width: 768px);
  @import url(../../../assets/styles/pages/mobile/profile.css) (max-width: 768px);
</style>
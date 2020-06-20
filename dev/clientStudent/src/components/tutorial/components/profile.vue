<template>
	 <transition name="fade">
        <div class="content" v-if="block_id < 5">
            <p class="page_title">ПРОФИЛЬ</p>
            <div class="blocks2">
                <div class="info_profile2" :class="{'zix':block_id == 1}">
                    <div class="about_user2">
                        <p class="level_title">Beginner</p>
                        <div class="about_user_block2">
                            <img :src="$tutorialUrl+'images/avatar.jpg'" class="profile_avatar">
                            <p class="profile_name">Асылжан Мухтаров</p>
                            <p class="age">20 лет</p>
                            <p class="number">+7 (747) 125 44 13</p>
                            <button class="sign_up">Записаться на занятия</button>
                            <div>
                                <p class="end_courses2">Сертификаты:</p>
                                <div class="scroll_downloads2">
                                    <div class="end_course_title">
                                        <p class="downloadType">Индивидуальный</p><i class="fas fa-download downloadIcon"></i>
                                    </div>
                                    <div class="end_course_title">
                                        <p class="downloadType">Индивидуальный</p><i class="fas fa-download downloadIcon"></i>
                                    </div>
                                    <div class="end_course_title">
                                        <p class="downloadType">Индивидуальный</p><i class="fas fa-download downloadIcon"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="faq" :class="{'zix':block_id==2}">
                    <div class="schedule_title"><span>FAQ</span>
                    </div>

                    <div class="schedule_body">
                        <div class="homework_schedule">
                            <p class="task_title">Как определяется ваш уровень?</p>
                            <p class="task_time">120 человек посчитали этот ответ полезным</p>
                        </div>
                        <div class="homework_schedule">
                            <p class="task_title">Как определяется ваш уровень?</p>
                            <p class="task_time">120 человек посчитали этот ответ полезным</p>
                        </div>
                        <div class="homework_schedule">
                            <p class="task_title">Как определяется ваш уровень?</p>
                            <p class="task_time">120 человек посчитали этот ответ полезным</p>
                        </div>
                        <div class="homework_schedule">
                            <p class="task_title">Как определяется ваш уровень?</p>
                            <p class="task_time">120 человек посчитали этот ответ полезным</p>
                        </div>
                        <div class="homework_schedule">
                            <p class="task_title">Как определяется ваш уровень?</p>
                            <p class="task_time">120 человек посчитали этот ответ полезным</p>
                        </div>
                    </div>
                    <div class="schedule_footer">
                        <a class="all_schedule">Все вопросы</a>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
	name: 'profile',
	data () {
		return {
			
		}
	},
	props: ['block_id']
}
</script>
<style>
  @import url(../../../assets/tutorial_styles/profile.css);
</style>
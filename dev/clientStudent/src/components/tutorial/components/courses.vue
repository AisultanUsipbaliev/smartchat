<template>
	<div>
		<transition name="fade">
	        <div class="content" v-if="block_id > 9 && block_id < 12">
	            <p class="page_title">ТАРИФЫ</p>
	            <div class="courses">
	                <div class="course" :class="{'zix': block_id == 10}">
	                    <div class="head_course">
	                        <img :src="$tutorialUrl+'images/study-1968077_1920.jpg'" class="course_img">
	                    </div>
	                    <div class="body_course">
	                        <p class="course_name">Пробное занятие</p>
	                        <p class="text_course">Один бесплатный урок с преподавателем.</p>
	                        <p class="time_course">1 час</p>
	                        <p class="group_type">Индивидуально</p>
	                        <p class="old_cost">1000 тг</p>
	                        <p class="new_cost">0 тг</p>
	                    </div>
	                    <div class="footer_course">
	                        <a class="course_request" @click="plusId()">Записаться</a>
	                    </div>
	                </div>

	                <div class="course">
	                    <div class="head_course">
	                        <img :src="$tutorialUrl+'images/Noticia-206135-hombre-escribiendo.jpg'" class="course_img">
	                    </div>
	                    <div class="body_course">
	                        <p class="course_name">Индивидуальные занятия</p>
	                        <p class="text_course">Обучение проходит 12 раз в месяц, в обговоренное с учеником время по общей программе.</p>
	                        <p class="time_course">12 часов</p>
	                        <p class="group_type">Индивидуально</p>
	                        <p class="old_cost">9000 тг</p>
	                        <p class="new_cost">7000 тг</p>
	                    </div>
	                    <div class="footer_course">
	                        <a class="course_request" >Записаться</a>
	                    </div>
	                </div>
	            </div>
	        </div>
		</transition>

	        <div class="course_time" v-if="block_id == 11">
	            <h2 class="course_time_title">Выберите удобное время</h2>
	            <p class="course_time_about">Вы можете записаться на ближайшее время, либо выбрать удобное для вас в любой день недели! Ближайшее занятие: <strong style="font-weight: 600;">Четверг c 8:00 до 9:00</strong></p>
	            <div>
	                <button class="btn_course_time">Ближайшее время</button>
	                <button class="btn_course_time" @click="plusId()">Выбрать самому</button>
	            </div>
	        </div>

	         <div class="content_time" v-if="block_id == 12" >
	            <div class="blocks_time" :class="{'zix':block_id == 12}">
	                <div class="head_choose">
	                    <p class="choose_course">Курс "Пробное занятие"</p>
	                    <p class="warning_course">Укажите удобное для вас время для прохождения занятия:</p>
	                </div>
	                <div class="body_choose">
	                    <div class="day_row">
	                        <div class="w-20">
	                            <span class="week_day">Понедельник</span>
	                        </div>
	                        <div class="w-80">
	                            <div class="lesson_count">
	                                <select class="noborder" value="0">
	                                    <option value="0">00:00</option>
	                                </select>
	                                -
	                                <select value="0" class="noborder">
	                                    <option value="0">00:00</option>
	                                </select>
	                            </div>
	                            <img :src="$tutorialUrl+'images/tab_plus.png'" class="plus_button">
	                        </div>

	                    </div>
	                    <div class="day_row">
	                        <div class="w-20">
	                            <span class="week_day">Вторник</span>
	                        </div>
	                        <div class="w-80">
	                            <div class="lesson_count">
	                                <select class="noborder" value="0">
	                                    <option value="0">00:00</option>
	                                </select>
	                                -
	                                <select value="0" class="noborder">
	                                    <option value="0">00:00</option>
	                                </select>
	                            </div>
	                            <img :src="$tutorialUrl+'images/tab_plus.png'" class="plus_button">
	                        </div>

	                    </div>
	                    <div class="day_row">
	                        <div class="w-20">
	                            <span class="week_day">Среда</span>
	                        </div>
	                        <div class="w-80">
	                            <div class="lesson_count">
	                                <select class="noborder" value="0">
	                                    <option value="0">00:00</option>
	                                </select>
	                                -
	                                <select value="0" class="noborder">
	                                    <option value="0">00:00</option>
	                                </select>
	                            </div>
	                            <img :src="$tutorialUrl+'images/tab_plus.png'" class="plus_button">
	                        </div>

	                    </div>
	                    <div class="day_row">
	                        <div class="w-20">
	                            <span class="week_day">Четверг</span>
	                        </div>
	                        <div class="w-80">
	                            <div class="lesson_count">
	                                <select class="noborder" value="0">
	                                    <option value="0">00:00</option>
	                                </select>
	                                -
	                                <select value="0" class="noborder">
	                                    <option value="0">00:00</option>
	                                </select>
	                            </div>
	                            <img :src="$tutorialUrl+'images/tab_plus.png'" class="plus_button">
	                        </div>

	                    </div>
	                    <div class="day_row">
	                        <div class="w-20">
	                            <span class="week_day">Пятница</span>
	                        </div>
	                        <div class="w-80">
	                            <div class="lesson_count">
	                                <select class="noborder" value="0">
	                                    <option value="0">00:00</option>
	                                </select>
	                                -
	                                <select value="0" class="noborder">
	                                    <option value="0">00:00</option>
	                                </select>
	                            </div>
	                            <img :src="$tutorialUrl+'images/tab_plus.png'" class="plus_button">
	                        </div>

	                    </div>
	                    <div class="day_row">
	                        <div class="w-20">
	                            <span class="week_day">Суббота</span>
	                        </div>
	                        <div class="w-80">
	                            <div class="lesson_count">
	                                <select class="noborder" value="0">
	                                    <option value="0">00:00</option>
	                                </select>
	                                -
	                                <select value="0" class="noborder">
	                                    <option value="0">00:00</option>
	                                </select>
	                            </div>
	                            <img :src="$tutorialUrl+'images/tab_plus.png'" class="plus_button">
	                        </div>

	                    </div>
	                    <div class="day_row">
	                        <div class="w-20">
	                            <span class="week_day">Воскресенье</span>
	                        </div>
	                        <div class="w-80">
	                            <div class="lesson_count">
	                                <select class="noborder" value="0">
	                                    <option value="0">00:00</option>
	                                </select>
	                                -
	                                <select value="0" class="noborder">
	                                    <option value="0">00:00</option>
	                                </select>
	                            </div>
	                            <img :src="$tutorialUrl+'images/tab_plus.png'" class="plus_button">
	                        </div>
	                    </div>
	                </div>

	                <div class="foot_choose">
	                    <a class="ready" @click="plusId()">Готово</a>  
	                </div>
	            </div>
	        </div>

	        <div class="content_teacher" v-if="block_id > 12 && block_id < 17">
	            <p class="page_title">ПРЕПОДАВАТЕЛЬ</p>
	            <div class="blocks_teacher" :class="{'zix' : block_id == 13}">
	                <p class="teacher_choose">По вашему запросу найдены преподаватели:</p>
	                <div class="choose_body">
	                    <div class="recommend">
	                        <span class="bb">Выберите преподавателя:</span>
	                        <div class="rec_div">
	                            <p class="teacher_name">Анвар Шер</p>
	                            <div class="stars">
	                                <img :src="$tutorialUrl+'images/star.png'" class="star" alt="">
	                                <img :src="$tutorialUrl+'images/star.png'" class="star" alt="">
	                                <img :src="$tutorialUrl+'images/star.png'" class="star" alt="">
	                                <img :src="$tutorialUrl+'images/star.png'" class="star" alt="">
	                                <img :src="$tutorialUrl+'images/star.png'" class="star" alt="">
	                            </div>
	                            <div class="choose_button">
	                                <button class="choose" @click="plusId()">Выбрать</button>
	                            </div>
	                        </div>
	                    </div>      
	                </div>
	            </div>
	        </div>

	        <div class="course_time" v-if="block_id == 14">
	            <h2 class="course_time_title">Ваша заявка принята</h2>
	            <p class="course_time_about">Ваша заявка принята, ждите подтверждения!</p>
	            <button class="btn_course_time" @click="plusId()">Хорошо</button>
	        </div>

	        <div class="notification_tutorial" v-if="block_id == 15">
	            <p class="notification_title">Уведомление</p>
	            <div class="notificate_body">
	                <img :src="$tutorialUrl+'images/iconfinder_icon-6-mail-envelope-closed_314900.png'" class="notificate_mail">
	                <p class="confirmed_mail">Преподаватель подтвердил вашу заявку!</p>
	            </div>
	        </div>
	</div>
</template>

<script>
export default {
	name: 'courses',
	data () {
		return {
			
		}
	},
	methods:{
		 plusId() {
            this.$emit('plusId')    
        }
	},
	props: ['block_id']

}
</script>
<style scoped>
  @import url(../../../assets/tutorial_styles/courses.css);
</style>
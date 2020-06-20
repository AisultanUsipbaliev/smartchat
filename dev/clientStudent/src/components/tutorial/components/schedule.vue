<template>
	<transition name="fade">
        <div class="content_schedule" v-if="block_id == 17 || block_id == 18">
            <p class="page_title">РАСПИСАНИЕ</p>
                    <div class="month">
                        <img :src="$tutorialUrl+'images/if_Left_arrow_2202280.png'" class="left_arrow arrow">
                        <span>Январь</span>
                        <img :src="$tutorialUrl+'images/if_Right_arrow_2202241.png'" class="right_arrow arrow">
                        <button class="today_lessons">Что сегодня?</button>
                    </div>
            <div class="block_schedule" :class="{'zix': block_id == 17}">
                <div class="calendar">
                    <table class="week_days">
                        <tr class="week_name">
                            <th>Пн</th>
                            <th>Вт</th>
                            <th>Ср</th>
                            <th>Чт</th>
                            <th>Пт</th>
                            <th>Сб</th>
                            <th>Вс</th>
                        </tr>
                    </table>

                    <div class="calendar_content">
                        <table class="calendar_table">
                            <tr class="days">
                                <td class="td_bgc"><div class="day another_month"><p class="day_number">31</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">1</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">2</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">3</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">4</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">5</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">6</p></div></td>
                            </tr>
                            <tr class="days">
                                <td class="td_bgc"><div class="day"><p class="day_number">7</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number current_day">8</p>
                                    <div class="about_lesson_in_calendar">
                                        <p>Занятие</p> 
                                        <p>12:00 - 14:00</p>
                                    </div>
                                </div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">9</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">10</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">11</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">12</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">13</p></div></td>
                            </tr>
                            <tr class="days">
                                <td class="td_bgc"><div class="day"><p class="day_number">14</p></div></td>
                                <td class="td_bgc lesson_have"><div class="day"><p class="day_number">15</p>
                                    <div class="about_lesson_in_calendar">
                                        <p>Занятие</p> 
                                        <p>3 задания</p>
                                    </div>
                                </div>
                                <div class="tasks_modal">
                                    <span>Написать эссе</span>
                                    <span>Написать эссе</span>
                                    <span>Написать эссе</span>  
                                </div>
                                </td>
                                <td class="td_bgc"><div class="day"><p class="day_number">16</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">17</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">18</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">19</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">20</p></div></td>
                            </tr>
                            <tr class="days">
                                <td class="td_bgc"><div class="day"><p class="day_number">21</p>
                                    <div class="about_lesson_in_calendar">
                                        <p>Занятие</p> 
                                        <p>12:00 - 14:00</p>
                                    </div>
                                </div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">22</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">23</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">24</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">25</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">26</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">27</p></div></td>
                            </tr>
                            <tr class="days">
                                <td class="td_bgc"><div class="day"><p class="day_number">28</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">29</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">30</p></div></td>
                                <td class="td_bgc"><div class="day"><p class="day_number">31</p></div></td>
                                <td class="td_bgc"><div class="day another_month"><p class="day_number">1</p></div></td>
                                <td class="td_bgc"><div class="day another_month"><p class="day_number">2</p></div></td>
                                <td class="td_bgc"><div class="day another_month"><p class="day_number">3</p></div></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
	name: 'schedule',
	data () {
		return {
			
		}
	},
	props: ['block_id']
}
</script>
<style scoped>
  @import url(../../../assets/tutorial_styles/schedule.css);
</style>
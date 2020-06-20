<template>
    <div>
        <!-- header -->
    <header>
        <img src="../../../static/tutorial/images/logo.png" class="logo">
        <div class="left_header_div">
          <div class="bell">
            <img src="../../../static/tutorial/images/bell.png" class="bell_icon">
            <span class="bell_count">3</span>
          </div>
          <div class="profile" :class= "{'zis':block_id==3}" @click="plusId()">
            <img src="../../../static/tutorial/images/avatar.jpg" class="header_profile">
            <span class="username">Асылжан Мухтаров</span>
            <img src="../../../static/tutorial/images/if_down_1167972.png" class="all_settings">
          </div>
        </div>
    </header>
    
    <!-- sidebar -->
    <div class="sidebar">
        <ul class="menu_ul">
            <li :class="{'active_li_side': block_id == 8, 'active': block_id < 8}" tool="Профиль"><a><fai icon="user"/></a></li>
            <li :class="{'active_li_side': block_id == 9, 'active': block_id > 9 && block_id < 16}" @click="plusId()" tool="Тарифы"><a><fai icon="graduation-cap"/></a></li>
            <li :class="{'active_li_side': block_id == 16}" @click="plusId()" tool="Расписание"><a><fai icon="calendar-alt"/></a></li>
            <li tool="Чат"><a><fai icon="comments"/></a></li>
            <li tool="Тесты"><a><fai icon="tasks"/></a></li>
            <li tool="Домашнее задание"><a><fai icon="home"/></a></li>
            <li tool="Отзыв"><a><fai icon="thumbs-up"/></a></li>
            <li tool="FAQ"><a><fai icon="question"/></a></li>
        </ul>
    </div>
    
    <!-- modal_settings -->
    <div class="settings_profile" id="settings_profile" v-show="menu_header" :class="{'zis':block_id == 4}">
        <a>Профиль</a>
        <a @click="plusId()">Настройки</a>
        <a>Выйти</a>
    </div>
        
    <!-- profile -->
    <div class="content" v-if="block_id < 5">
        <p class="page_title">ПРОФИЛЬ</p>
        <div class="blocks2">
            <div class="info_profile2" :class="{'zix':block_id == 1}">
                <div class="about_user2">
                    <p class="level_title">Beginner</p>
                    <div class="about_user_block2">
                        <img src="../../../static/tutorial/images/avatar.jpg" class="profile_avatar">
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
                <div onclick="openRate()" class="schedule_footer">
                    <a class="all_schedule" href="faq.html">Все вопросы</a>
                </div>
            </div>
        </div>
    </div>
    
    <!-- settings -->
    <div class="content_settings" v-if="block_id > 4 && block_id < 10 ">
        <p class="page_title">НАСТРОЙКИ</p>
            <div class="blocks" :class="{'zix':block_id == 5 || block_id == 6}">
                <div class="settings_head"><span>Основная информация</span></div>
                <div class="settings_body">
                    <div class="avatar_div">
                        <img src="../../../static/tutorial/images/avatar.jpg" class="avatar">
                        <div class="feedback">
                            <input id="sms" type="checkbox" checked class="checkbox"><label for="sms">SMS уведомления</label><br><br>
                            <input id="email" type="checkbox" class="checkbox"><label for="email">Email уведомления</label>
                        </div>
                    </div>
                    <div class="input_div">
                        <label for="name">Имя</label>
                        <input class="input_in_settings" id="name" type="text" value="Асылжан">
                        <label for="lastname">Фамилия</label>
                        <input class="input_in_settings" type="text" id="lastname" value="Мухтаров">
                        <label for="born">Дата рождения</label>
                        <input class="input_in_settings" id="born" type="text" value="20.04.1998">
                        <label for="mail">E-Mail</label>
                        <input class="input_in_settings" id="mail" type="email" value="Asylzhan89@gmai.com">
                    </div>
                </div>
                <div class="settings_buttons">
                    <button class="btn_setting" @click="plusId()" :class="{'zis':block_id == 6}">Поменять пароль</button>
                    <button class="btn_setting">Сохранить</button>
                    <button class="btn_setting">Отмена</button>
                </div>
            </div>
    </div>
    
    <!-- change_pass -->
    <div class="change_pass zix" v-if="block_id == 7">
        <span class="change_pass_title">Поменять пароль</span>
        <label class="label_change_pass" for="old_pass">Старый пароль</label>
        <input class="change_pass_input" type="password" id="old_pass">
        <label class="label_change_pass" for="new_pass">Новый пароль</label>
        <input class="change_pass_input" type="password" id="new_pass">
        <label class="label_change_pass" for="repeat_pass">Повторите новый пароль</label>
        <input class="change_pass_input" type="password" id="repeat_pass">
        <button class="btn_change_pass" @click="plusId()">Сохранить</button>
    </div>
    
    <!-- courses -->
    <div class="content" v-if="block_id > 9 && block_id < 12">
        <p class="page_title">ТАРИФЫ</p>
        <div class="courses">
            <div class="course" :class="{'zix': block_id == 10}">
                <div class="head_course">
                    <img src="../../../static/tutorial/images/study-1968077_1920.jpg" class="course_img">
                </div>
                <div class="body_course">
                    <p class="course_name">Пробное занятие</p>
                    <p class="text_course">Один бесплатный урок с преподавателем.</p>
                    <p class="time_course">1 час</p>
                    <p class="group_type">Индивидуально</p>
                    <p class="old_cost">7000 тг</p>
                    <p class="new_cost">0 тг</p>
                </div>
                <div class="footer_course">
                    <a class="course_request" @click="plusId()">Записаться</a>
                </div>
            </div>

            <div class="course">
                <div class="head_course">
                    <img src="../../../static/tutorial/images/Noticia-206135-hombre-escribiendo.jpg" class="course_img">
                </div>
                <div class="body_course">
                    <p class="course_name">Индивидуальные занятия</p>
                    <p class="text_course">Обучение проходит 12 раз в месяц, в обговоренное с учеником время по общей программе.</p>
                    <p class="time_course">12 часов</p>
                    <p class="group_type">Индивидуально</p>
                    <p class="old_cost">7000 тг</p>
                    <p class="new_cost">5000 тг</p>
                </div>
                <div class="footer_course">
                    <a class="course_request" >Записаться</a>
                </div>
            </div>
        </div>
    </div>

    <!-- course_time -->
    <div class="course_time" v-if="block_id == 11">
        <h2 class="course_time_title">Выберите удобное время</h2>
        <p class="course_time_about">Вы можете записаться на ближайшее время, либо выбрать удобное для вас в любой день недели! Ближайшее занятие: <strong style="font-weight: 600;">Четверг c 8:00 до 9:00</strong></p>
        <div>
            <button class="btn_course_time">Ближайшее время</button>
            <button class="btn_course_time" @click="plusId()">Выбрать самому</button>
        </div>
    </div>
    
    <!-- add_time -->
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
                        <img src="../../../static/tutorial/images/tab_plus.png" class="plus_button">
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
                        <img src="../../../static/tutorial/images/tab_plus.png" class="plus_button">
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
                        <img src="../../../static/tutorial/images/tab_plus.png" class="plus_button">
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
                        <img src="../../../static/tutorial/images/tab_plus.png" class="plus_button">
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
                        <img src="../../../static/tutorial/images/tab_plus.png" class="plus_button">
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
                        <img src="../../../static/tutorial/images/tab_plus.png" class="plus_button">
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
                        <img src="../../../static/tutorial/images/tab_plus.png" class="plus_button">
                    </div>

                </div>
            </div>

            <div class="foot_choose">
                <a class="ready" @click="plusId()">Готово</a>  
            </div>
        </div>
    </div>

    <!-- choose teacher -->
    <div class="content_teacher" v-if="block_id > 12 && block_id < 17">
        <p class="page_title">ПРЕПОДАВАТЕЛЬ</p>
        <div class="blocks_teacher" :class="{'zix' : block_id == 13}">
            <p class="teacher_choose">По вашему запросу найдены преподаватели:</p>
            <div class="choose_body">
                <div class="recommend">
                    <span class="bb">Рекомендованный преподаватель:</span>
                    <div class="rec_div">
                        <p class="teacher_name">Анвар Шер</p>
                        <div class="stars">
                            <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                            <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                            <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                            <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                            <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                        </div>
                        <div class="choose_button">
                            <button class="choose">Выбрать</button>
                        </div>
                    </div>
                </div>
                
                <div class="others">
                    <div class="other">
                        <span class="bb">Другие преподователи:</span>
                        <div class="rec_div">
                            <p class="teacher_name">Анар Кошенова</p>
                            <div class="stars">
                                <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                                <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                                <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                                <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                                <img src="../../../static/tutorial/images/halfstar.png" class="star" alt="">
                            </div>
                            <div class="choose_button">
                                <button class="choose">Выбрать</button>
                            </div>
                        </div>

                        <div class="rec_div">
                            <p class="teacher_name">Бексултан Нурбеков</p>
                            <div class="stars">
                                <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                                <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                                <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                                <img src="../../../static/tutorial/images/star.png" class="star" alt="">
                                <img src="../../../static/tutorial/images/emptystar.png" class="star" alt="">
                            </div>
                            <div class="choose_button">
                                <button class="choose">Выбрать</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>

    <!-- request done -->
    <div class="course_time" v-if="block_id == 14">
        <h2 class="course_time_title">Ваша заявка принята</h2>
        <p class="course_time_about">Ваша заявка принята, ждите подтверждения!</p>
        <button class="btn_course_time" @click="plusId()">Хорошо</button>
    </div>

    <!-- Уведомления -->
    <div class="notification_tutorial" v-if="block_id == 15">
        <p class="notification_title">Уведомление</p>
        <div class="notificate_body">
            <img src="../../../static/tutorial/images/iconfinder_icon-6-mail-envelope-closed_314900.png" class="notificate_mail">
            <p class="confirmed_mail">Преподаватель подтвердил вашу заявку!</p>
        </div>
    </div>
    
    <!-- schedule -->
    <div class="content_schedule" v-if="block_id == 17">
        <p class="page_title">Расписание</p>
                <div class="month">
                    <img src="static/img/if_Left_arrow_2202280.png" class="left_arrow arrow" @click="changeMonth(-1)">
                    <span>{{month}}</span>
                    <img src="static/img/if_Right_arrow_2202241.png" class="right_arrow arrow" @click="changeMonth(1)">
                    <button class="today_lessons" @click="getToday()">Что сегодня?</button>
                </div>
        <div class="block_schedule" :class="{'zix': block_id == 17}">

            <div class="calendar">
                <table class="week_days">
                    <tr class="week_name">
                        <th>Понедельник</th>
                        <th>Вторник</th>
                        <th>Среда</th>
                        <th>Четверг</th>
                        <th>Пятница</th>
                        <th>Суббота</th>
                        <th>Вс</th>
                    </tr>
                </table>

                <div class="calendar_content">
                    <table class="calendar_table">
                        <tr class="days" v-for="(week, key) in days" :key="key">
                            <td class="td_bgc" v-for="day in week"  :style="tr_style">
                                <div class="day" :class="day.last ? 'another_month' : ''">
                                    <p class="day_number" :class="day.today ? 'current_day' : ''">{{day.date}}</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <!-- tutorial -->
    <div class="tutorial" v-show="tutorial_body"></div>
        <span class="skip">Пропустить</span>
        <img src="../../../static/tutorial/images/arrow_down_white.png" :class="arrow_side">

        <transition name="fade">
            <div class="profile_t1" id="t1">
                <img src="../../../static/tutorial/images/smarti.png" class="smarti" :class="smarti">
                <div class="text_block" :class="text_block">
                    <img src="../../../static/tutorial/images/tale.png" class="tale" :class="tale">
                    <span class="text_content">{{text_content}}</span>
                    <div class="buttons_block">
                        <span class="next_prev" @click="minusId()" :class="{'disb':block_id == 1}">Пред.</span>
                        <span>{{block_id}}/{{all_id}}</span>
                        <span class="next_prev" @click="plusId()" :class="{'disb':!next_btn == false || standart_pass == true || block_id == 12}">След.</span>
                    </div>

                </div>
            </div>
        </transition>

    </div>
</template>

<script>
export default {
  name: 'Tutorial',
  data () {
    return {
        tutorial_body: true, 
        block_id: 15, all_id: 29, 
        arrow_side: '',
        menu_header: false, 
        next_btn: false,
        text_content: '', 
        tale: '', smarti: '', text_block: '',
        standart_pass: false,
        days: [],
        global_date: new Date(),
        month: '',
        tr_style: {height: '20%'},
        start_month: null,
        end_month: null,
        charts: {},
    }
  },
  created(){
  	
  },
  methods:{
  	chooseSlide(){        
        this.next_btn = false;
        this.arrow_side = "disb";

        if(this.block_id == 1){
            this.text_block = 'profile_text';
            this.smarti = 'profile_smarti';
            this.tale = 'profile_tale';
            this.text_content = 'Здесь вы можете увидеть информацию о вас и сертификатах, когда закончите обучение.'; 
        }
        else if(this.block_id == 2){
            this.text_block = 'faq_text';
            this.smarti = 'faq_smarti';
            this.tale = 'faq_tale';
            this.text_content = 'Здесь вы можете узнать ответы на часто задаваемые вопросы!'; 
        }
        else if(this.block_id == 3){
            this.next_btn = true;
            this.menu_header = false;
            this.text_block = 'header_text';
            this.smarti = 'header_smarti';
            this.tale = 'header_tale';
            this.text_content = 'Нажмите на меню, чтобы открыть меню'; 
        }
        else if(this.block_id == 4){
            this.menu_header = true;
            this.text_block = 'header_text';
            this.smarti = 'header_smarti';
            this.tale = 'header_tale';
            this.text_content = 'Теперь нажмите на “Настройки” здесь вы сможете изменить ваши данные и пароль.'; 
        }
        else if(this.block_id == 5){
            this.menu_header = false;
            this.text_block = 'settings_text';
            this.smarti = 'settings_smarti';
            this.tale = 'settings_tale';
            this.text_content = 'Здесь вы редактируете данные о себе. Указывайте свои настоящие данные, по окончанию курса вы получите сертификат с этими данными. Если хотите изменить ваши данные, то измените и нажмите кнопку "Сохранить". '; 
        }
        else if(this.block_id == 6){
            this.text_block = 'settings_text';
            this.smarti = 'settings_smarti';
            this.tale = 'settings_tale';
            this.text_content = 'Нажмите на кнопку "Поменять пароль" '; 
        }
        else if(this.block_id == 7){
            this.text_block = 'settings_text';
            this.smarti = 'settings_smarti';
            this.tale = 'settings_tale';
            this.text_content = 'Тут введите свой пароль, который у вас стоит на данный момент'; 
            this.arrow_side = "disb";
        }
        else if(this.block_id == 8){
            this.text_block = 'sidebar_text';
            this.smarti = 'sidebar_smarti';
            this.tale = 'sidebar_tale';
            this.text_content = 'Это страница профиля, где мы были до этого'; 
            this.arrow_side = "arrow_profile";
        }
        else if(this.block_id == 9){
            this.text_block = 'sidebar_text';
            this.smarti = 'sidebar_smarti';
            this.tale = 'sidebar_tale';
            this.text_content = 'Тарифы - здесь вы можете записаться на подходящий вам курс и оплатить его'; 
            this.arrow_side = "arrow_courses";
        }
        else if(this.block_id == 10){
            this.text_block = 'profile_text';
            this.smarti = 'profile_smarti';
            this.tale = 'profile_tale';
            this.text_content = 'Нажав на кнопку “Записаться” вы можете записаться на подходящий вам тариф.'; 
        }
        else if(this.block_id == 11){
            this.text_block = 'profile_text';
            this.smarti = 'profile_smarti';
            this.tale = 'profile_tale';
            this.text_content = 'Нажмите на "Выбрать самому".'; 
        }
        else if(this.block_id == 12){
            this.text_block = 'time_text';
            this.smarti = 'time_smarti';
            this.tale = 'time_tale';
            this.text_content = 'Нажимая на кнопку “+”, вы сможете добавить до трех удобных для вас интервалов времени.'; 
        }
        else if(this.block_id == 13){
            this.text_block = 'time_text';
            this.smarti = 'time_smarti';
            this.tale = 'time_tale';
            this.text_content = 'Здесь вам нужно выбрать преподавателя и нажать “Выбрать”'; 
        }
        else if(this.block_id == 14){
            this.text_block = 'time_text';
            this.smarti = 'time_smarti';
            this.tale = 'time_tale';
            this.text_content = 'Теперь ожидайте подтверждение'; 
        }
        else if(this.block_id == 15){
            this.text_block = 'time_text';
            this.smarti = 'time_smarti';
            this.tale = 'time_tale';
            this.text_content = 'Смотрите, преподаватель принял вашу заявку'; 
        }
        else if(this.block_id == 16){
            this.text_block = 'time_text';
            this.smarti = 'time_smarti';
            this.tale = 'time_tale';
            this.text_content = 'Расписание - тут вы можете увидеть расписание выбранного вами курса. Нажмите на него,чтобы перейти.'; 
            this.arrow_side = "arrow_schedule";
        }
        else if(this.block_id == 17){
            this.text_block = 'time_text';
            this.smarti = 'time_smarti';
            this.tale = 'time_tale';
            this.text_content = 'В расписании будут отмечаны дни и время ваших занятии.'; 
        }
        else if(this.block_id == 18){
            this.text_block = 'time_text';
            this.smarti = 'time_smarti';
            this.tale = 'time_tale';
            this.text_content = 'Также при наведении задания, вы сможете увидеть список занятиии нажав на задание можно сразу перейти настраницу с объяснением.'; 
        }
    },
    minusId(){
        this.block_id--;
        this.chooseSlide();
    },
    plusId(){
        this.block_id++;
        this.chooseSlide();
    },
    monthName(){
        let current_month = this.global_date.getMonth();
        switch(current_month){
            case 0: this.month = 'Январь'; break;
            case 1: this.month = 'Февраль'; break;
            case 2: this.month = 'Март'; break;
            case 3: this.month = 'Апрель'; break;
            case 4: this.month = 'Май'; break;
            case 5: this.month = 'Июнь'; break;
            case 6: this.month = 'Июль'; break;
            case 7: this.month = 'Август'; break;
            case 8: this.month = 'Сентябрь'; break;
            case 9: this.month = 'Октябрь'; break;
            case 10: this.month = 'Ноябрь'; break;
            case 11: this.month = 'Декабрь'; break;
        }
    },
    paintCalendar(){
        this.days = [];
        this.monthName();
        let date = new Date(this.global_date);
            let current_month = date.getMonth();
            let i = 0;
            let mas = [];
            date = new Date(date.setDate(1));
            while(date.getDay() != 1){
                date = new Date(date.setDate(date.getDate() - 1))
            }
            this.start_month = new Date(date.getTime() - date.getTime() % 86400000).valueOf();
            while(date.getMonth() <= current_month || (date.getMonth() == 11 && current_month == 0)){
                if(date.getMonth() == 0 && current_month == 11) break;
                if(date.getMonth() == current_month && date.getDate() == new Date().getDate() && date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth())
                    mas.push({date:date.getDate(), today:true})
                else if(date.getMonth() != current_month)
                    mas.push({date:date.getDate(), last:true})
                else mas.push({date:date.getDate(), last:false})
                if(date.getDay() == 0) {
                    this.days.push(mas);
                    mas = [];
                }
                date = new Date(date.setDate(date.getDate() + 1))
            }
            date = new Date(date.setDate(date.getDate() - 1))
            while(date.getDay() != 0){
                date = new Date(date.setDate(date.getDate() + 1))
                mas.push({date:date.getDate(), last:true})
            }
            this.end_month = new Date(date.getTime() - date.getTime() % 86400000).valueOf();
            if(mas[0])
            this.days.push(mas);
            this.tr_style = {height: `calc(100% / ${this.days.length})`};
            this.$http.post('/api', `method=GET-CHART&&begin=${this.start_month}&&end=${this.end_month}`)
            .then(res =>{
                this.charts = {};
                if(res.data.status === 200){
                    this.charts = res.data.chart;
                    let data = this.charts[0];
                    data.hw = this.getHW();
                    console.log(data)
                    this.charts.splice(0,1, data)
                }
            })
            .catch(err => console.log(err))
        },
        changeMonth(num){
            this.global_date = new Date(this.global_date.setDate(1))
            this.global_date = new Date(this.global_date.setMonth(this.global_date.getMonth() + num));
            this.paintCalendar();
        },
        getToday(){
            this.global_date = new Date();
            this.paintCalendar();
        },
        getHW(){
            this.$http.post('/api', `method=GET-HOMEWORK`)
            .then(res =>{ return {data: res.data} })
            .catch(err => console.log(err));
        },
        ifDate(dt1, dt2){
            dt1 = new Date(dt1);
            dt2 = new Date(dt2);
        }
  },
  mounted(){
    this.paintCalendar();
    this.chooseSlide();
  }
}
</script>
<style type="text/css">
  @import url(../../assets/tutorial_styles/profile.css);
  @import url(../../assets/tutorial_styles/tutorial.css);
  @import url(../../assets/tutorial_styles/settings.css);
  @import url(../../assets/tutorial_styles/courses.css);
  @import url(../../assets/tutorial_styles/schedule.css);
</style>
<template>
  <div class="content">
    <div class="container-fluid">   

      <div class="row" v-if="groupList.length==0">
        <div class="p-3 col-lg-4">
          <div class="card m-0">
            <div class="card__body profile-main-info profile-main-info_v1">
              <div class="profile-main-info__image">
                <img v-if="teacher.ava" v-bind:src="avaUrlComputed" alt="avatar">
                <img v-else style="" src="/static/img/user.svg" alt="avatar">
              </div>
              <div class="profile-main-info__text">
                <div><strong>{{teacher.login}}</strong> {{teacher.lastname}}</div>
                <div><span>Преподаватель</span></div>
              </div>
              <div class="profile-main-info__button">
                <button @click="resetThePassword" class="btn">Сбросить пароль</button>
              </div>                            
            </div>
          </div>
        </div>
        <div class="col-lg-8 m-xl-0 m-sm-0 m-md-0 p-3" style="position: sticky; top: 30px;">
          <div class="card">
            <div>
              <div class="card__header ">
                <h2>Общая информация</h2>
                <ul class="card__action">
                  <li> 
                    <a href="#;"><fai icon="sync-alt"/></a>
                  </li>
                  <li>
                    <a href="#;"><fai icon="expand-arrows-alt"/></a>
                  </li>
                </ul>
              </div>
              <div class="card__body profile-more-info ">
                <div class="row">
                  <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                    <small>Почта: </small>
                    <p v-if="teacher.email">{{teacher.email}}</p>                            
                    <p v-else>-</p>                            
                    <hr>
                  </div>
                  <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                    <small>Телефон: </small>
                    <p v-if="teacher.phone">{{teacher.phone}}</p>
                    <p v-else>-</p>                            
                    <hr>
                  </div>
                  <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                    <small>Рейтинг </small>
                    <p v-if="teacher.rating">{{teacher.rating}}</p>
                    <p v-else>-</p>                            
                    <hr>
                  </div>
                  <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                    <small>Количество проведенных уроков </small>
                    <p v-if="teacher.les_count">{{teacher.les_count}}</p>
                    <p v-else>-</p>                            
                    <hr>
                  </div>
                  <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                    <small>Заработанно </small>
                    <p v-if="teacher.amount">{{teacher.amount}}{{teacher.currency}}</p>
                    <p v-else>-</p>                            
                    <hr>
                  </div>
                </div>
                <div class="row">

                  <div class="checkbox__toggle col-lg-6 col-md-12">
                    <input type="checkbox" name="teacher_activate" id="teacher_activate" @click="togglePhoneActivated" v-model="teacher.activated">
                    <label for="teacher_activate"><small>Номер активирован : </small></label>
                    <hr>
                  </div>
                  <hr>
                  <div class="checkbox__toggle col-lg-6 col-md-12">
                    <input type="checkbox" name="teacher_email_activate" id="teacher_email_activate" @click="toggleEmailActivated" v-model="teacher.is_active">
                    <label for="teacher_email_activate"><small>Email активирован: </small></label>
                    <hr>
                  </div>
                  <hr>
                  <div class="checkbox__toggle col-lg-6 col-md-12">
                    <input type="checkbox" name="teacher_sms_on" id="teacher_sms_on" @click="toggleSmsOn" v-model="teacher.smsOn">
                    <label for="teacher_sms_on"><small>Cмс уведомления: </small></label>
                    <hr>
                  </div>
                  <hr>
                  <div class="checkbox__toggle col-lg-6 col-md-12">
                    <input type="checkbox" name="teacher_email_on" id="teacher_email_on" @click="toggleEmailOn" v-model="teacher.mailOn">
                    <label for="teacher_email_on"><small>Email уведомления: </small></label>
                    <hr>
                  </div>
                  <div class="checkbox__toggle col-lg-6 col-md-12">
                    <input type="checkbox" name="teacher_blocked" id="teacher_blocked" @click="toggleBlocked" v-model="teacher.blocked">
                    <label for="teacher_blocked"><small>Заблокирован: </small></label>
                    <hr>
                  </div>
                  <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6 col-md-12">
                    <small>Был в сети: </small>
                    <p v-if="teacher.lastVisit">{{teacher.lastVisit}}</p>
                    <p v-else>-</p>                            
                    <hr>
                  </div>
                </div>
                <div class="profile-more-info__text">
                  <small>Уровень: </small>
                  <div class="profile-more-info__level">
                    <span v-if="!levelEditing" class="pr-1">{{teacher.lvl_name}}</span>
                    <div v-if="levelEditing" class="custom-select">
                      <select name="selected_level" v-model="temp_level_id">
                        <option v-for="level in selectedLevel" :value="level.lvl_id">{{level.lvl_name}}</option>
                      </select> 
                    </div>
                    <div class="profile-more-info__level-button">
                      <button v-if="!levelEditing" class="btn" title="Изменить" @click="levelEnableEditing">
                        <fai icon="pencil-alt"/>
                      </button>
                      <button v-if="levelEditing" class="btn" title="Сохранить" @click="levelSaveEdit">
                        <fai icon="save"/>
                      </button>
                      <button v-if="levelEditing" class="btn" title="Отменить" @click="levelDisableEditing">
                        <fai icon="times"/>
                      </button>
                    </div>
                  </div>
                </div>
                <hr>
                <div class="profile-more-info__text">
                  <small>Дата регистрации: </small>
                  <p v-if="teacher.regDate">{{teacher.regDate}}</p>
                  <p v-else>-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-else>
        <div class="col-lg-4">
          <div class="row p-3">
            <div class="card col-lg-12">
              <div class="card__body profile-main-info" ref="account">
                <div class="profile-main-info__image">
                  <img v-if="teacher.ava" v-bind:src="avaUrlComputed" alt="avatar">
                  <img v-else style="" src="/static/img/user.svg" alt="avatar">
                </div>
                <div class="profile-main-info__text">
                  <div><strong>{{teacher.login}}</strong> {{teacher.lastname}}</div>
                  <div><span>Преподаватель</span></div>
                </div>
                <div class="profile-main-info__button">
                  <button @click="resetThePassword" class="btn">Сбросить пароль</button>
<!--                   <button class="btn">Пуш</button>
                  <button class="btn">Смс</button> -->
                </div>                            
              </div>
            </div>
            <div class="card col-lg-12 m-xl-0 m-sm-0 m-md-0" ref="left_side">
              <div>
                <div class="card__header ">
                  <h2>Общая информация</h2>
                  <ul class="card__action">
                    <li> 
                      <a href="#;"><fai icon="sync-alt"/></a>
                    </li>
                    <li>
                      <a href="#;"><fai icon="expand-arrows-alt"/></a>
                    </li>
                  </ul>
                </div>
                <div class="card__body profile-more-info">
                  <div class="profile-more-info__text">
                    <small>Почта: </small>
                    <p v-if="teacher.email">{{teacher.email}}</p>                            
                    <p v-else>-</p>                            
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Телефон: </small>
                    <p v-if="teacher.phone">{{teacher.phone}}</p>
                    <p v-else>-</p>                            
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Рейтинг </small>
                    <p v-if="teacher.rating">{{teacher.rating}}</p>
                    <p v-else>-</p>                            
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Количество проведенных уроков </small>
                    <p v-if="teacher.les_count">{{teacher.les_count}}</p>
                    <p v-else>-</p>                            
                  </div>
                  <div class="profile-more-info__text">
                    <small>Заработанно </small>
                    <p v-if="teacher.amount">{{teacher.amount}}{{teacher.currency}}</p>
                    <p v-else>-</p>                            
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Был в сети: </small>
                    <p v-if="teacher.lastVisit">{{teacher.lastVisit}}</p>
                    <p v-else>-</p>                            
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Уровень: </small>
                    <div class="profile-more-info__level">
                      <span v-if="!levelEditing" class="pr-1">{{teacher.lvl_name}}</span>
                      <div v-if="levelEditing" class="custom-select">
                        <select name="selected_level" v-model="temp_level_id">
                          <option v-for="level in selectedLevel" :value="level.lvl_id">{{level.lvl_name}}</option>
                        </select> 
                      </div>
                      <div class="profile-more-info__level-button">
                        <button v-if="!levelEditing" class="btn" title="Изменить" @click="levelEnableEditing">
                          <fai icon="pencil-alt"/>
                        </button>
                        <button v-if="levelEditing" class="btn" title="Сохранить" @click="levelSaveEdit">
                          <fai icon="save"/>
                        </button>
                        <button v-if="levelEditing" class="btn" title="Отменить" @click="levelDisableEditing">
                          <fai icon="times"/>
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr>
                  <div class="checkbox__toggle">
                    <input type="checkbox" name="teacher_activate" id="teacher_activate" @click="togglePhoneActivated" v-model="teacher.activated">
                    <label for="teacher_activate"><small>Номер активирован : </small></label>
                  </div>
                  <hr>
                  <div class="checkbox__toggle">
                    <input type="checkbox" name="teacher_email_activate" id="teacher_email_activate" @click="toggleEmailActivated" v-model="teacher.is_active">
                    <label for="teacher_email_activate"><small>Email активирован: </small></label>
                  </div>
                  <hr>
                  <div class="checkbox__toggle">
                    <input type="checkbox" name="teacher_sms_on" id="teacher_sms_on" @click="toggleSmsOn" v-model="teacher.smsOn">
                    <label for="teacher_sms_on"><small>Cмс уведомления: </small></label>
                  </div>
                  <hr>
                  <div class="checkbox__toggle">
                    <input type="checkbox" name="teacher_email_on" id="teacher_mail_on" @click="toggleEmailOn" v-model="teacher.mailOn">
                    <label for="teacher_mail_on"><small>Email уведомления: </small></label>
                  </div>
                  <hr>
                  <div class="checkbox__toggle">
                    <input type="checkbox" name="teacher_blocked" id="teacher_blocked" @click="toggleBlocked" v-model="teacher.blocked">
                    <label for="teacher_blocked"><small>Заблокирован: </small></label>
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Дата регистрации: </small>
                    <p v-if="teacher.regDate">{{teacher.regDate}}</p>
                    <p v-else>-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 



<!-- -->        
        <div class="col-lg-8">
          <div class="row p-3" ref="schedule">
            <div class="card col-12">
              <div class="card__header ">
                <h2>График</h2>
                <ul class="card__action">
                  <li> 
                    <a href="#;"><fai icon="sync-alt"/></a>
                  </li>
                  <li>
                    <a href="#;"><fai icon="expand-arrows-alt"/></a>
                  </li>
                </ul>
              </div>
              <div class="card__body">
                  <div class="card__action p-1">
                      <button v-if="!editingShedule" @click="editShedule()" class="group-toggle-text-block__button-edit">
                        <fai icon="pencil-alt" class="mr-2"/>Изменить
                      </button>
                      <button v-if="editingShedule" @click="saveShedule()" class="group-toggle-text-block__button-edit">
                        <fai icon="save" class="mr-2"/>Сохранить
                      </button>
                      <button v-if="editingShedule" @click="cancelShedule()" class="group-toggle-text-block__button-edit">
                        <fai icon="times" class="mr-2"/>Отменить
                      </button>
                  </div>
                <div class="col-12 table-responsive">
                   <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Начало</th>
                        <th>Конец</th>
                        <th>День недели</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="day in 7">
                        <td>
                          <div class="row m-0 mb-2" v-if="editingShedule">
                            <select class="select table_select col-sm-12" v-model="shedule[day-1].start">
                              <option v-for="time in sheduleTime" :value="time">{{getWorckingHours(time)}}</option>
                            </select> 
                          </div>
                          <div v-if="!editingShedule">
                            <div>{{getWorckingHours(shedule[day-1].start)}}</div>
                          </div>
                        </td>
                        <td>
                          <div class="row m-0 mb-2" v-if="editingShedule">
                            <select class="select table_select col-sm-12" v-model="shedule[day-1].end">
                              <option v-for="time in sheduleTime" :value="time">{{getWorckingHours(time)}}</option>
                            </select> 
                          </div>
                          <div v-if="!editingShedule">
                            <div>{{getWorckingHours(shedule[day-1].end)}}</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div>{{$getFullWeekDayName(day - 1)}}</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


<!-- -->
          <div class="row p-3">
            <div class="card col-12" style="max-height: 476px">
              <div class="card__header ">
                <h2>Биллинг</h2>
                <ul class="card__action">
                  <li> 
                    <a href="#;"><fai icon="sync-alt"/></a>
                  </li>
                  <li>
                    <a href="#;"><fai icon="expand-arrows-alt"/></a>
                  </li>
                </ul>
              </div>
              <div class="card__body">
                <div class="col-12 table-responsive">
                   <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Подпись</th>
                        <th>Цена</th>
                        <th>Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in billing">
                        <td>
                          <div>{{item.comment}}</div>
                        </td>
                        <td>
                          <div>{{item.amount}}{{item.currency}}</div>
                        </td>
                        <td>
                          <div>{{getDt(new Date(item.dt))}}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            </div>
                
            <div class="row p-3">
            <!-- <div class="row p-3"> -->
              <div class="card col-12">
                <div class="card__header ">
                  <h2>Расписание</h2>
                  <ul class="card__action">
                    <li> 
                      <a href="#;"><fai icon="sync-alt"/></a>
                    </li>
                    <li>
                      <a href="#;"><fai icon="expand-arrows-alt"/></a>
                    </li>
                  </ul>
                </div>
                <div class="card__body">
                  <div class="row">

                    <div class="col-12">
                      <div class="row m-0 profile-group">
                        <div class="col-12 p-0 table-responsive">
                           <table class="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>Группа</th>
                                <th>Номер урока</th>
                                <th>Начало урока</th>
                                <th>Конец урока</th>
                                <th>Настройки</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(item, index) in groupList">
                                <td>{{item.group_name}}</td>
                                <td>
                                  <div v-if="!item.editing">{{item.lesson}}</div>
                                  <div v-if="item.editing">
                                    <select class="select table_select col-sm-12" v-model="item.temp_lesson">
                                      <option v-for="lesson in item.lessons" :value="lesson">{{lesson}}</option>
                                    </select> 
                                  </div>
                                </td>
                                
                                <td>
                                  <div class="row m-0 mb-2" v-if="item.editing">
                                    <select class="select table_select col-sm-12" v-model="item.temp_start_time">
                                      <option v-for="time in selectedTime" :value="time">{{time}}</option>
                                    </select> 
                                  </div>
                                  <div class="row m-0" v-if="item.editing">
                                    <input type="date" value="item.start_day" class="input col-sm-12" v-model="item.temp_start_day">
                                  </div>
                                  <div v-if="!item.editing">
                                    <div><span>Время : </span><span >{{item.start_time}}</span></div>
                                    <div><span>День : </span><span>{{dateIsoToLocal(item.start_day)}}</span></div>
                                  </div>
                                </td>
                                
                                <td>
                                  <div class="row m-0 mb-2" v-if="item.editing">
                                    <select class="select table_select col-sm-12" v-model="item.temp_finish_time">
                                      <option v-for="time in selectedTime" :value="time">{{time}}</option>
                                    </select> 
                                  </div>
                                  <div class="row m-0" v-if="item.editing">
                                    <input type="date" value="item.finish_day" class="input col-sm-12" v-model="item.temp_finish_day">
                                  </div>
                                  <div v-if="!item.editing">
                                    <div><span>Время : </span><span>{{item.finish_time}}</span></div>
                                    <div><span>День : </span><span>{{dateIsoToLocal(item.finish_day)}}</span></div>
                                  </div>
                                </td>
                                
                                <td class="table__btn-container">
                                  <button v-if="!item.editing" class="btn" title="Изменить" @click="chartEnableEditing(index)">
                                    <fai icon="pencil-alt"/>
                                  </button>
                                  <button v-if="item.editing && !item.loading" class="btn" title="Сохранить" @click="chartPreSaveEdit(index)">
                                    <fai icon="save"/>
                                  </button>
                                  <button v-if="item.loading" class="btn" title="Изменить" :disabled="item.loading">
                                    <fai icon="spinner" pulse/>
                                  </button>
                                  <button v-if="item.editing" :disabled="item.loading" class="btn" title="Отменить" @click="chartDisableEditing(index)">
                                    <fai icon="times"/>
                                  </button>
                                  <button v-if="!item.editing" class="btn" title="Удалить" @click="chartDelete(index)">
                                    <fai icon="trash-alt"/>
                                  </button>
                                </td>
                                
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            <!-- </div> -->
          </div>
        </div>



<!---->
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherDetail',
  data () {
    return {
      teacher_id: this.$route.params.id,
      teacher: '',
      levelEditing: 0,
      temp_level_id: null,
      selectedLevel: '',
      groupList: '',
      selectedTime: [],

      // shedule
      shedule: '',
      oldShedule: '',
      editingShedule: false,
      sheduleTime: ['',0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],

      //billing
      billing: [],
    }
  },
  created() {
    this.getTeacherAllInfo();
  },
  beforeRouteLeave(to, from, next){
    window.onscroll = () => {};
    next(true)
  },
  mounted(){
    this.changeFixed();
  },
  computed: {
    avaUrlComputed() { return `${ this.$commonPhotoUrl }${ this.teacher.ava }` }
  },
  methods: {
    changeFixed(){
      window.onscroll = () => {
        this.scrollF();
      }
    },
    scrollF(){
      let left_side = this.$refs['left_side'];
      let account = this.$refs['account'];
      let schedule = this.$refs['schedule'];
      if(account && left_side && schedule){
      let account_position = account.getBoundingClientRect();
      let schedule_position = schedule.getBoundingClientRect();
      let position = left_side.getBoundingClientRect();
      left_side.style.maxWidth = account_position.width + 'px';
        if(schedule_position.width != account_position.width + 34){
          if(account_position.height - 21 >= Math.abs(account_position.top))
            left_side.classList.remove('stop')
          else
            left_side.classList.add('stop')
        }else left_side.classList.remove('stop')
      }
    },
    getTeacherAllInfo() {
      this.$http.post(`/api`, `method=GET-TEACHER&teacher_id=${this.teacher_id}`)
      .then(async (response) => {
        if (response.data.status == 200) {
          this.teacher = response.data.teacher;
          this.selectedLevel = response.data.level;
          this.groupList = this.groupChartDateParse(response.data.group);
          this.shedule = this.getShedule(response.data.shedule);
          this.billing = response.data.balance;
          this.billing.sort((a,b)=>{
            return new Date(a.dt).valueOf() - new Date(b.dt).valueOf();
          })
          this.generateSelectedTime();
        } else { throw new Error(response.statusText); }
      })
      .catch(e => { console.log(e) })
    },

  // billing
    getDt(dt){
      let day = '';
      day += this.checkMonth(new Date(dt).getMonth()) + ' '; 
      day +=new Date(dt).getDate() + ', '; 
      day += this.checkDay(new Date(dt).getDay()) + ', ';
      day +=new Date(dt).getFullYear();
      return day;
    },
    checkDay(dt){
      switch(dt){
        case 1: return 'Понедельник'; break;
        case 2: return 'Вторник'; break;
        case 3: return 'Среда'; break;
        case 4: return 'Четверг'; break;
        case 5: return 'Пятница'; break;
        case 6: return 'Суббота'; break;
        case 0: return 'Воскресенье'; break;
      }
    },
    checkMonth(dt){
      switch(dt){
        case 0: return 'Январь'; break;
        case 1: return 'Февраль'; break;
        case 2: return 'Март'; break;
        case 3: return 'Апрель'; break;
        case 4: return 'Май'; break;
        case 5: return 'Июнь'; break;
        case 6: return 'Июль'; break;
        case 7: return 'Август'; break;
        case 8: return 'Сентябрь'; break;
        case 9: return 'Октябрь'; break;
        case 10: return 'Ноябрь'; break;
        case 11: return 'Декабрь'; break;
      }
    },
  // shedule
    cancelShedule(){
      this.editingShedule = false; 
      this.shedule = this.oldShedule;
    },
    editShedule(){
      this.editingShedule = true; 
      this.oldShedule = JSON.parse(JSON.stringify(this.shedule));
    },
    getShedule(lieData, flag){
      let data = JSON.parse(JSON.stringify(lieData));
      let dataEnd = [];
      for(let i = 0; i < data.length; i++){
        if(!flag) data[i] = this.$toClient([data[i].start_time, data[i].finish_time ? data[i].finish_time : data[i].end, data[i].nday])
        else data[i] = this.$toServer([data[i].start_time, data[i].finish_time ? data[i].finish_time : data[i].end, data[i].nday])
        for(let j = 0; j < data[i].length; j++)
          dataEnd.push(data[i][j])
      }
      for(let i = 0; i < dataEnd.length - 3; i += 3) {
        for(let j = i + 3; j < dataEnd.length ; j += 3)
          if(!flag)
            if(dataEnd[i + 2] === dataEnd[j + 2])
              if(dataEnd[i] === dataEnd[j + 1]){
                dataEnd[i] = dataEnd[j]
                dataEnd.splice(j, 3);
                j -= 3;
              }else if(dataEnd[j] === dataEnd[i + 1]){
                dataEnd[i + 1] = dataEnd[j + 1]
                dataEnd.splice(j, 3);
                j -= 3;
              }
          else
            if(dataEnd[i + 2] === dataEnd[j + 2])
              if(dataEnd[i + 1] === dataEnd[j]){
                dataEnd[i + 1] = dataEnd[j + 1]
                dataEnd.splice(j, 3);
                j -= 3;
              }else if(dataEnd[j + 1] === dataEnd[i]){
                dataEnd[i] = dataEnd[j]
                dataEnd.splice(j, 3);
                j -= 3;
              }
      }
      let ending = []
      for(let i = 0; i < dataEnd.length; i += 3)
        ending.push({start: dataEnd[i], end: dataEnd[i+1], nday: dataEnd[i+2]})
      for(let i = 0; i < ending.length - 1; i++)
        for(let j = i + 1; j < ending.length; j++)
          if(ending[i] == ending[j]){
            ending.splice(j, 1)
            j--;
          }
      if(ending.length < 7)
        for(let i = 0; i < 7; i++){
          let nope = true;
          for(let j = 0; j < ending.length; j++)
            if(ending[j].nday == i) {
              nope = false;
              break;
            }
            if(nope) ending.push({start: '', end: '', nday: i})
        }
      ending.sort((a,b)=> {return a.nday - b.nday});
      return ending;
    },
    getWorckingHours(time){
      if(time === '') return 'нет'
      return time < 10 ? '0' + time + ':00' : time + ':00'
    },
    saveShedule(){
      let chance = true
      for(let i = 0; i < this.shedule.length; i++)
        if((this.shedule[i].start >= this.shedule[i].end && this.shedule[i].start !== '' && this.shedule[i].end !== '') 
            || (this.shedule[i].start === '' && this.shedule[i].end) || (this.shedule[i].start && this.shedule[i].end === '')){
          chance = false;
          this.$swal({
            type: 'error',
            title: 'Ошибка!',
            text: `${this.$getFullWeekDayName(this.shedule[i].nday)}: неправильно указанно время ${this.getWorckingHours(this.shedule[i].start)} - ${this.getWorckingHours(this.shedule[i].end)}`,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
          break;
        }
      if(chance){
        let shedule = this.getShedule(this.shedule, true);
        this.$http.post(`/api`, `method=UPDATE-TEACHER-SHEDULE&teacher_id=${this.teacher_id}&graph=${JSON.stringify(shedule)}`)
        .then(response => {
          this.$swal({
            type: 'success',
            title: 'График успешно изменён!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
          this.editingShedule = false;
        })
        .catch(e => {
          this.$swal({
            type: 'error',
            title: 'Ошибка!',
            text: `${e}`,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        })
      }
    },
    resetThePassword() {
      this.$swal({
        title: `Сбросить пароль данного пользователя?`,
        text: "Данная операция не обратима!",
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: 'Сбросить!',
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          return this.$http.post(`/api`, `method=RESET-PASSWORD&teacher_id=${ this.teacher_id }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        }
      })
      .catch((error) => {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${error}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })
    },
    dateIsoToLocal(date) { return new Date(date).toLocaleString().split(",")[0]; },
    generateSelectedTime() {
      let dt = new Date(1970, 0, 1, 0, 0, 0, 0), rc = [];
      while (dt.getDate() == 1) {
        rc.push(dt.toTimeString().match(/(\d\d:\d\d)/)[0]);
        dt.setMinutes(dt.getMinutes() + 30);
      }
      this.selectedTime = rc;
    },
    groupChartDateParse(data) {
      if (data.length>0) {
        for (let i = 0; i < data.length; i++) {
          let s = new Date(data[i].start);
          delete data[i].start;
          data[i].start_day = s.toLocaleString('en-us', {
                                                          year: 'numeric', 
                                                          month: '2-digit', 
                                                          day: '2-digit'
                                                        }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

          data[i].start_time = s.toTimeString().match(/(\d\d:\d\d)/)[0];
          let f = new Date(data[i].finish);
          delete data[i].finish;
          data[i].finish_day = f.toLocaleString('en-us', {
                                                          year: 'numeric', 
                                                          month: '2-digit', 
                                                          day: '2-digit'
                                                        }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

          data[i].finish_time = f.toTimeString().match(/(\d\d:\d\d)/)[0];
        }
        return data;
      } else { return [] }
    },
    chartEnableEditing: function(index) {
      this.groupList[index].temp_lesson = this.groupList[index].lesson;
      this.groupList[index].temp_start_time = this.groupList[index].start_time;
      this.groupList[index].temp_start_day = this.groupList[index].start_day;
      this.groupList[index].temp_finish_time = this.groupList[index].finish_time;
      this.groupList[index].temp_finish_day = this.groupList[index].finish_day;
      this.groupList[index].editing = 1;
    },
    chartDisableEditing: function(index) {
      this.groupList[index].temp_lesson = null;
      this.groupList[index].temp_start_time = null;
      this.groupList[index].temp_start_day = null;
      this.groupList[index].temp_finish_time = null;
      this.groupList[index].temp_finish_day = null;
      this.groupList[index].editing = 0;
    },
    chartSaveEdit: function(index) {
      this.groupList[index].lesson = this.groupList[index].temp_lesson;
      this.groupList[index].start_time = this.groupList[index].temp_start_time;
      this.groupList[index].start_day = this.groupList[index].temp_start_day;
      this.groupList[index].finish_time = this.groupList[index].temp_finish_time;
      this.groupList[index].finish_day = this.groupList[index].temp_finish_day;
      this.chartDisableEditing(index);
    },
    chartPreSaveEdit: function(index) {

      let current_start_date = new Date( `${this.groupList[index].start_day} 
                                  ${this.groupList[index].start_time}`).valueOf();
      let current_finish_date = new Date(`${this.groupList[index].finish_day} 
                                  ${this.groupList[index].finish_time}`).valueOf();

      let start_date = new Date( `${this.groupList[index].temp_start_day} 
                                  ${this.groupList[index].temp_start_time}`).valueOf();
      let finish_date = new Date(`${this.groupList[index].temp_finish_day} 
                                  ${this.groupList[index].temp_finish_time}`).valueOf();
      let data = {
        chart_id: this.groupList[index].chart_id,
        start: start_date,
        finish: finish_date,
        lesson: this.groupList[index].temp_lesson
      } 
      if (this.groupList[index].temp_start_day.length == 0 &&
          this.groupList[index].temp_finish_day.length == 0) {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `Заполните все поля!`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        })
      } else if (this.groupList[index].temp_start_day.length == 0) {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `Дата начало урока не заполнено!`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        })
      } else if (this.groupList[index].temp_finish_day.length == 0) {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `Дата конца урока не заполнено!`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        })
      } else if (current_start_date == start_date && current_finish_date == finish_date) {
        this.chartSaveEdit(index);
        this.$swal({
          type: 'info',
          text: `Расписание не изменено!`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        })
      } else {
        if (start_date < finish_date) {

          this.groupList[index].loading = true;

          this.$http.post(`/api`, `method=CREATE-OR-UPDATE-CHART&chart_id=${data.chart_id}&start=${data.start}&finish=${data.finish}&lesson=${data.lesson}`)
          .then(async (response) => {
            if (response.data.status == 200) {
              this.groupList[index].loading = false;
              this.chartSaveEdit(index);
              this.$swal({
                type: 'success',
                title: 'Успешно!',
                text: `Расписание изменено!`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              });
            } else { throw new Error(response.statusText); }
          })
          .catch(e => { 
            this.groupList[index].loading = false;
            this.$swal({
              type: 'error',
              title: 'Ошибка!',
              text: `${e}`,
              buttonsStyling: false,
              confirmButtonClass: 'swal-btn swal-btn__confirm'
            }) 
          })
        } else {
          this.$swal({
            type: 'error',
            title: 'Ошибка!',
            text: `Начало урока не должен быть больше чем конец урока!`,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          })
        }
      }
    },
    chartDelete(index) {//-
      let chart_id = this.groupList[index].chart_id;
      this.$swal({
        title: `Удалить занятие?`,
        text: "Данная операция не обратима!",
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: 'Удалить!',
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          return this.$http.post(`/api`, `method=DELETE-STUDENT-CHART&chart_id=${chart_id}`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
          this.groupList.splice(index, 1); 
        }
      })
      .catch((error) => {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${error}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })
    },
    toggleEmailOn(event) {
      event.preventDefault();
      let title='',text='',confirmButtonText='';
      if (this.teacher.mailOn) { title='Отключить email уведомления?';text='Email уведомления отключен!';confirmButtonText='Отключить' }
      else                    { title='Включить email уведомления?';text='Email уведомления включен!';confirmButtonText='Включить' }
      this.$swal({
        title: title,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/api`, `method=EMAIL-ON&teacher_id=${ this.teacher_id }&value=${ this.teacher.mailOn ? 0 : 1 }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.teacher.mailOn = this.teacher.mailOn ? 0 : 1;
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        }
      })
      .catch((error) => {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${error}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })
    },
    toggleSmsOn(event) {
      event.preventDefault();
      let title='',text='',confirmButtonText='';
      if (this.teacher.smsOn) { title='Отключить смс уведомления?';text='Смс уведомления отключен!';confirmButtonText='Отключить' }
      else                    { title='Включить смс уведомления?';text='Смс уведомления включен!';confirmButtonText='Включить' }
      this.$swal({
        title: title,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/api`, `method=SMS-ON&teacher_id=${ this.teacher_id }&value=${ this.teacher.smsOn ? 0 : 1 }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.teacher.smsOn = this.teacher.smsOn ? 0 : 1;
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        }
      })
      .catch((error) => {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${error}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })
    },
    togglePhoneActivated(event) {
      event.preventDefault();
      let title='',text='',confirmButtonText='';
      if (this.teacher.activated) { title='Деактивировать номер?';text='Номер деактивирован!';confirmButtonText='Деактивировать' }
      else                        { title='Активировать номер?';text='Номер активирован!';confirmButtonText='Активировать' }
      this.$swal({
        title: title,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/api`, `method=PHONE-STATUS&teacher_id=${ this.teacher_id }&activate_phone=${ this.teacher.activated ? 0 : 1 }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.teacher.activated = this.teacher.activated ? 0 : 1;
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        }
      })
      .catch((error) => {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${error}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })
    },
    toggleEmailActivated(event) {
      event.preventDefault();
      let title='',text='',confirmButtonText='';
      if (this.teacher.is_active) { title='Деактивировать email?';text='Email деактивирован!';confirmButtonText='Деактивировать' }
      else                        { title='Активировать email?';text='Email активирован!';confirmButtonText='Активировать' }
      this.$swal({
        title: title,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/api`, `method=EMAIL-STATUS&teacher_id=${ this.teacher_id }&activate_email=${ this.teacher.is_active ? 0 : 1 }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.teacher.is_active = this.teacher.is_active ? 0 : 1;
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        }
      })
      .catch((error) => {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${error}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })
    },
    toggleBlocked(event) {
      event.preventDefault();
      let title='',text='',confirmButtonText='';
      if (this.teacher.blocked) { title='Разблокировать аккаунт?';text='Преподаватель разблокирован!';confirmButtonText='Разблокировать' } 
      else                      { title='Заблокировать аккаунт?';text='Преподаватель заблокирован!';confirmButtonText='Заблокировать' }
      this.$swal({
        title: title,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/api`, `method=BLOCK-USER&teacher_id=${ this.teacher_id }&block=${ this.teacher.blocked ? 0 : 1 }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.teacher.blocked = this.teacher.blocked ? 0 : 1;
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        }
      })
      .catch((error) => {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${error}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })
    },
    levelEnableEditing() {
      this.levelEditing = 1;
      this.temp_level_id = this.teacher.lvl_id;
    },
    levelSaveEdit() {
      this.$swal({
        title: 'Вы уверены что хотите изменить уровень?',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: 'Изменить',
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/api`, `method=CHANGE-LEVEL&teacher_id=${ this.teacher_id }&level_id=${ this.temp_level_id }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          let afterLevelName = this.teacher.lvl_name;
          let beforeLevelName = null;
          this.teacher.lvl_id = this.temp_level_id;
          for (let i = 0; i < this.selectedLevel.length; i++) {
            if(this.selectedLevel[i].lvl_id == this.teacher.lvl_id) { 
              this.teacher.lvl_name = this.selectedLevel[i].lvl_name; 
              beforeLevelName = this.selectedLevel[i].lvl_name;
              break; 
            }
          }
          this.levelDisableEditing();
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            text: `Уровень изменен с ${afterLevelName} на ${beforeLevelName}`,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        }
      })
      .catch((error) => {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${error}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      });
    },
    levelDisableEditing() {
      this.levelEditing = 0;
      this.temp_level_id = null;
    }
  }
}
</script>
<style src="@/assets/styles/pages/studentdetail.css" scoped></style>
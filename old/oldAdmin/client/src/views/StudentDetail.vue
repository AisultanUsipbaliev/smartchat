<template> 
  <div class="content">
    <div class="container-fluid">    

      <div class="row" v-if="learningProcessMainInfo || regMainInfo">
        <div class="col-lg-4">
          <div class="row p-3">
            <div class="card col-lg-12">

              <div class="card__header">
                <h2>Профиль</h2>
                <ul class="card__action">
                  <li> 
                    <fai @click="profileDropdownShow = !profileDropdownShow" v-on-clickaway="closeDropdown" icon="ellipsis-h"/>
                    <ul :class="[{'card__dropdown_animated':!profileDropdownShow}, 'card__dropdown']">
                      <li @click="clipboardUrl">Копировать ссылку</li>
                      <li>
                        <a v-if="student.guide" :href="studentSignUrlComputed" target="_blank" rel="noopener noreferrer">Вход</a>
                      </li>
                      <li @click="resetThePassword">Сбросить пароль</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div class="card__body profile-main-info">
                <div class="profile-main-info__image">
                  <img v-if="student.ava" v-bind:src="avaUrlComputed" alt="avatar">
                  <img v-else style="" src="/static/img/user.svg" alt="avatar">
                </div>
                <div class="profile-main-info__text">
                  <div><strong>{{student.firstname}}</strong> {{student.lastname}}</div>
                  <div><span>Студент</span></div>
                </div>
                <!-- <div class="profile-main-info__button">
                  <button @click="resetThePassword" class="btn">Сбросить пароль</button> 
                  <a v-if="student.guide" :href="studentSignUrlComputed" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Вход</a> -->
                   <!-- <button class="btn btn-primary">Пуш</button>
                  <button class="btn btn-outline-secondary">Смс</button> -->
               <!--  </div>    -->                         
              </div>
            </div>
            <div class="card col-lg-12 m-xl-0 m-sm-0 m-md-0">
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
                    <p v-if="student.email">{{student.email}}</p>                            
                    <p v-else>-</p>                            
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Телефон: </small>
                    <p v-if="student.phone">{{student.phone}}</p>
                    <p v-else>-</p>                            
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Дата рождения: </small>
                    <p v-if="student.birthday">{{student.birthday}}</p>
                    <p v-else>-</p>                            
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Был в сети: </small>
                    <p v-if="student.lastVisit">{{student.lastVisit}}</p>
                    <p v-else>-</p>                            
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Часовой пояс: </small>
                    <p v-if="student.timeDifference">{{student.timeDifference}}</p>
                    <p v-else>-</p>                            
                  </div>
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Уровень: </small>
                    <div class="profile-more-info__level">
                      <span v-if="!levelEditing" class="pr-1">{{student.lvl_name}}</span>
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
                    <input type="checkbox" name="student_blocked" id="student_blocked" @click="toggleBlocked" v-model="student.blocked">
                    <label for="student_blocked"><small>Заблокирован: </small></label>
                  </div>
                  <hr>
                  <div class="checkbox__toggle">
                    <input type="checkbox" name="student_stream" id="student_stream" @click="toggleStream" v-model="student.stream">
                    <label for="student_stream"><small>Stream : </small></label>
                  </div>
                  <hr>
                  <div class="checkbox__toggle">
                    <input type="checkbox" name="teacher_sms_on" id="teacher_sms_on" @click="toggleSmsOn" v-model="student.smsOn">
                    <label for="teacher_sms_on"><small>Cмс уведомления: </small></label>
                  </div>
                  <hr>
                  <div class="checkbox__toggle">
                    <input type="checkbox" name="teacher_email_on" id="teacher_mail_on" @click="toggleEmailOn" v-model="student.mailOn">
                    <label for="teacher_mail_on"><small>Email уведомления: </small></label>
                  </div>
                  <hr>
                  <div class="checkbox__toggle">
                    <input type="checkbox" name="student_activate" id="student_activate" @click="togglePhoneActivated" v-model="student.is_active">
                    <label for="student_activate"><small>Номер активирован : </small></label>
                  </div>
                  <hr>
                  <div class="checkbox__toggle">
                    <input type="checkbox" name="student_is_active" id="student_is_active" @click="toggleEmailActivated" v-model="student.activated">
                    <label for="student_is_active"><small>Email активирован: </small></label>
                  </div>  
                  <hr>
                  <div class="profile-more-info__text">
                    <small>Дата регистрации: </small>
                    <p v-if="student.regDate">{{student.regDate}}</p>
                    <p v-else>-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
        <div class="col-lg-8">
          <div class="row p-3">

            <div class="card col-12" v-if="learningProcessMainInfo">
              <div class="card__header ">
                <h2>Учебный процесс</h2>
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
                    <div class="row profile-group">
                      <div class="col-md-6 col-sm-12 profile-group__title" v-if="!learningProcessMainInfo.group_type">Группа</div>
                      <div class="col-md-6 col-sm-12 profile-group__text group-toggle-text-block">
                        <div class="row m-0" v-if="!learningProcessMainInfo.group_type">
                          <span class="text-link group-toggle-text-block__text mr-2">{{learningProcessMainInfo.group_name}}</span>
                          <button @click="showEditGroupPopup" class="group-toggle-text-block__button-edit">
                            <fai icon="pencil-alt" class="mr-2"/>Изменить
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="row profile-group">
                      <div class="col-md-6 col-sm-12 profile-group__title">Преподаватель</div>
                      <div class="col-md-6 col-sm-12 profile-group__text">
                        <span>
                          <router-link :to="{ name:'TeacherDetail', params:{id:learningProcessMainInfo.teacher_id} }" class="text-link">
                            {{learningProcessMainInfo.teacher_name}}
                          </router-link>
                        </span>
                        <button @click="showEditRateTeacherPopup" class="group-toggle-text-block__button-edit">
                          <fai icon="pencil-alt" class="mr-2"/>Изменить
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="row profile-group">
                      <div class="col-md-6 col-sm-12 profile-group__title">Тариф</div>
                      <div class="col-md-6 col-sm-12 profile-group__text">
                        <span class="text-link">
                          <router-link :to="{ name:'RateDetail', params:{id:learningProcessMainInfo.rate_id} }" class="text-link">
                            {{learningProcessMainInfo.rate_name}}
                          </router-link>
                        </span>
                        <button @click="showEditRatePopup" class="group-toggle-text-block__button-edit">
                          <fai icon="pencil-alt" class="mr-2"/>Изменить
                        </button>
                      </div>
                    </div>
                    <hr>
                  </div>
                  <div class="col-12">
                    <div class="row m-0 profile-group">
                      <div class="col-12 p-0 profile-group__title">
                        <div class="row m-0 d-flex justify-content-between d-flex align-items-center">
                          <div class="col-md-3 p-0">Расписание</div>
                          <div class="col-md-9 d-flex justify-content-end align-items-center pr-md-3">
                              
                            <div class="row">
                              <div v-if="editingChart" class=" d-flex justify-content-between align-items-center pr-md-1">
                                <span class="profile-more-info__text_span">Начало с</span>
                                <div class="pl-md-2 pr-md-2">
                                  <select class="select table_select profile-more-info__text_select col-sm-12 m-1 " v-model="minChartLesson" :disabled="loadingChart">
                                    <option v-for="lesson in learningProcessMainInfo.lessons" :value="lesson">{{lesson}}</option>
                                  </select> 
                                </div>
                              </div>
                              <div class="d-flex align-items-center">
                                <button v-if="!editingChart" @click="editingAllCharts" class="group-toggle-text-block__button-edit">
                                  <fai icon="pencil-alt" class="mr-2"/>Изменить
                                </button>
                                <button v-if="editingChart && !loadingChart" @click="addChart" class="group-toggle-text-block__button-edit">
                                  <fai icon="plus-square" class="mr-2"/>Добавить
                                </button>
                                <button v-if="editingChart && loadingChart" @click="addChart" class="group-toggle-text-block__button-edit" :disabled="loadingChart">
                                  <fai icon="spinner" class="mr-2" pulse/>Добавить
                                </button>
                                <button v-if="editingChart && !loadingChart" @click="disableEditingAllCharts" class="group-toggle-text-block__button-edit">
                                  <fai icon="times" class="mr-2"/>Отменить
                                </button>
                                <button v-if="loadingChart && editingChart" class="btn group-toggle-text-block__button-edit" :disabled="loadingChart">
                                  <fai icon="spinner" class="mr-2" pulse/>Отменить
                                </button>
                                <button v-if="editingChart && !loadingChart" @click="saveAllCharts" class="group-toggle-text-block__button-edit">
                                  <fai icon="save" class="mr-2"/>Сохранить
                                </button>
                                <button v-if="loadingChart && editingChart" class="btn group-toggle-text-block__button-edit" :disabled="loadingChart?'disabled':''">
                                  <fai icon="spinner" class="mr-2" pulse/>Сохранить
                                </button>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                      <div class="col-12 p-0 table-responsive">
                         <table class="table table-bordered table-hover">
                          <thead>
                            <tr>
                              <th v-if="!editingChart">Номер урока</th>
                              <th>Начало урока</th>
                              <th>Конец урока</th>
                              <th v-if="editingChart" >Настройки</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in learningProcessChartInfo">
                              <td v-if="!editingChart">
                                <div>{{item.lesson}}</div>
                              </td>
                              <td>
                                <div class="row m-0 mb-2" v-if="item.editing">
                                  <select v-bind:style="{ backgroundColor: item.start_time_color }" class="select table_select col-sm-12" v-model="item.start_time">
                                    <option v-for="time in selectedTime" :value="time">{{time}}</option>
                                  </select> 
                                </div>
                                <div class="row m-0" v-if="item.editing">
                                  <input v-bind:style="{ backgroundColor: item.start_day_color }" type="date" value="item.start_day" class="input col-sm-12" v-model="item.start_day">
                                </div>
                                <div v-if="!item.editing">
                                  <div><span>Время : </span><span >{{item.start_time}}</span></div>
                                  <div><span>День : </span><span>{{dateIsoToLocal(item.start_day)}}</span></div>
                                </div>
                              </td>
                              <td>
                                <div class="row m-0 mb-2" v-if="item.editing">
                                  <select v-bind:style="{ backgroundColor: item.finish_time_color }" class="select table_select col-sm-12" v-model="item.finish_time">
                                    <option v-for="time in selectedTime" :value="time">{{time}}</option>
                                  </select> 
                                </div>
                                <div class="row m-0" v-if="item.editing">
                                  <input v-bind:style="{ backgroundColor: item.finish_day_color }" type="date" value="item.finish_day" class="input col-sm-12" v-model="item.finish_day">
                                </div>
                                <div v-if="!item.editing">
                                  <div><span>Время : </span><span>{{item.finish_time}}</span></div>
                                  <div><span>День : </span><span>{{dateIsoToLocal(item.finish_day)}}</span></div>
                                </div>
                              </td>
                              <td v-if="editingChart" class="table__btn-container">
                                <button v-if="editingChart" class="btn" title="Удалить" @click="spliceChart(index)">
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

            <div class="card col-12" v-if="regMainInfo">
              <div class="card__header ">
                <h2>Заявка</h2>
                <ul class="card__action">
                  <li> 
                    <a href="#"><fai icon="sync-alt"/></a>
                  </li>
                  <li>
                    <a href="#"><fai icon="expand-arrows-alt"/></a>
                  </li>
                </ul>
              </div>

              <div class="card__body">
                <div class="row">
                  <div class="col-12">
                    <div class="row profile-group">
                      <div class="col-md-6 col-sm-12 profile-group__title">Преподаватель</div>
                      <div class="col-md-6 col-sm-12 profile-group__text group-toggle-text-block">
                        <div class="row m-0">
                          <span class="text-link group-toggle-text-block__text mr-2">
                            <router-link :to="{ name:'TeacherDetail', params:{id:regMainInfo.teacher_id} }" class="text-link">
                              {{regMainInfo.teacher_name}}
                            </router-link>
                          </span>
                          <button @click="showEditReqPopup" class="group-toggle-text-block__button-edit">
                            <fai icon="pencil-alt" class="mr-2"/>Изменить
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="row profile-group">
                      <div class="col-md-6 col-xs-12 profile-group__title flex-wrap">Тариф</div>
                      <div class="col-md-6 col-xs-12 profile-group__text">
                        <router-link :to="{ name:'RateDetail', params:{id:regMainInfo.rate_id} }" class="text-link">
                          {{regMainInfo.rate_name}}
                        </router-link>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="row profile-group">
                      <div class="col-6 profile-group__title">Когда был отправлен заявка</div>
                      <div class="col-6 profile-group__text">
                        <span>
                          {{regMainInfo.req_dt}}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <hr>
                    <div class="row m-0 profile-group">
                      <div class="col-12 p-0 profile-group__title">Расписание</div>
                      <div class="col-12 p-0 table-responsive">
                         <table class="table table-bordered table-hover">
                          <thead>
                            <tr>
                              <th>День недели</th>
                              <th>Начало урока</th>
                              <th>Конец урока</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in regSheduleInfo">
                              <td>{{item.weekday}}</td>
                              <td>
                                <tr v-for="time in item.time">{{time.start_time}}</tr>
                              </td>
                              <td>
                                <tr v-for="time in item.time">{{time.finish_time}}</tr>
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

            <div class="card col-lg-12" v-if="visitHistory.length">
              <div class="card__header ">
                <h2>История посещения</h2>
                <ul class="card__action">
                  <li>
                    <a href="#;"><fai icon="expand-arrows-alt"/></a>
                  </li>
                </ul>
              </div>
              <div class="card__body">
               <!--  <div class="table-filter-block">
                  <div class="row">
                    <div class="col-md-12 col-sm-12">
                      <label for="select">Показать по : </label>
                      <select id="select" v-model="visitHistoryTo" @change="getVisitHistory()" class="select form-control-sm">
                        <option :value="10">10</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                      </select>
                    </div>
                  </div>
                </div> -->
                <div class="table-responsive" v-dragscroll>
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th @click="getVisitHistory()">
                          <div class="table__sort">
                            <span>Дата</span>
                            <div class="table__sort-icons">
                              <fai icon="sort-up" v-bind:class="[!visitHistoryOrderDesc ? 'text-dark' : 'text-muted']"/>
                              <fai icon="sort-down" v-bind:class="[visitHistoryOrderDesc ? 'text-dark' : 'text-muted']"/>
                            </div>
                          </div>
                        </th>
                        <th> 
                          <span>Ip</span>
                        </th>
                        <th> 
                          <span>Информация об устройстве</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in visitHistory" :key="index">
                        <td>{{item.dt}}</td>
                        <td>{{item.ip}}</td>
                        <td>{{item.agent}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                  <div class="row table-footer-btn-block m-0" v-if="visitHistoryPagination" @click="getVisitHistory(true)">
                    <button class="col-12 btn mt-2">Показать еще</button>
                  </div>
              </div>
              
            </div>

          </div>
        </div>
      </div>

      <div class="row p-3" v-else>
        <div class="col-lg-4 col-md-12 p-3">
          <div class="card__header">
            <h2>Профиль</h2>
            <ul class="card__action">
              <li> 
                <fai @click="profileDropdownShow = !profileDropdownShow" v-on-clickaway="closeDropdown" icon="ellipsis-h"/>
                <ul :class="[{'card__dropdown_animated':!profileDropdownShow}, 'card__dropdown']">
                  <li @click="clipboardUrl">Копировать ссылку</li>
                  <li>
                    <a v-if="student.guide" :href="studentSignUrlComputed" target="_blank" rel="noopener noreferrer">Вход</a>
                  </li>
                  <li @click="resetThePassword">Сбросить пароль</li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="card__body profile-main-info profile-main-info_v0">
            <div class="profile-main-info__image">
              <img v-if="student.ava" v-bind:src="avaUrlComputed" alt="avatar">
              <img v-else style="" src="/static/img/user.svg" alt="avatar">
            </div>
            <div class="profile-main-info__text">
              <div><strong>{{student.firstname}}</strong> {{student.lastname}}</div>
              <div><span>Студент</span></div>
            </div>
          </div>
        </div>
        <div class="col-lg-8 col-md-12 p-3">
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

              <div class="row">
                <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                  <small>Почта: </small>
                  <p v-if="student.email">{{student.email}}</p>                            
                  <p v-else>-</p>                            
                  <hr>
                </div>
                <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                  <small>Часовой пояс: </small>
                  <p v-if="student.timeDifference">{{student.timeDifference}}</p>
                  <p v-else>-</p>                            
                  <hr>
                </div>
                <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                  <small>Телефон: </small>
                  <p v-if="student.phone">{{student.phone}}</p>
                  <p v-else>-</p>                            
                  <hr> 
                </div>
                <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                  <small>Дата рождения: </small>
                  <p v-if="student.birthday">{{student.birthday}}</p>
                  <p v-else>-</p>                            
                  <hr>
                </div>

                <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                  <small>Уровень: </small>
                  <div class="profile-more-info__level">
                    <span v-if="!levelEditing" class="pr-1">{{student.lvl_name}}</span>
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
                  <hr>
                </div>

                <div class="profile-more-info__text profile-more-info__text_v0 col-lg-6">
                  <small>Был в сети: </small>
                  <p v-if="student.lastVisit">{{student.lastVisit}}</p>
                  <p v-else>-</p>                            
                  <hr>
                </div>
              </div>

              <div class="row">
                <div class="checkbox__toggle col-lg-6 col-md-12">
                  <input type="checkbox" name="student_blocked" id="student_blocked" @click="toggleBlocked" v-model="student.blocked">
                  <label for="student_blocked"><small>Заблокирован: </small></label>
                  <hr>
                </div>
                <div class="checkbox__toggle col-lg-6 col-md-12">
                  <input type="checkbox" name="student_stream" id="student_stream" @click="toggleStream" v-model="student.stream">
                  <label for="student_stream"><small>Stream : </small></label>
                  <hr>
                </div>
                <div class="checkbox__toggle col-lg-6 col-md-12">
                  <input type="checkbox" name="teacher_sms_on" id="teacher_sms_on" @click="toggleSmsOn" v-model="student.smsOn">
                  <label for="teacher_sms_on"><small>Cмс уведомления: </small></label>
                  <hr>
                </div>
                <div class="checkbox__toggle col-lg-6 col-md-12">
                  <input type="checkbox" name="student_activate" id="student_activate" @click="togglePhoneActivated" v-model="student.is_active">
                  <label for="student_activate"><small>Номер активирован : </small></label>
                  <hr>
                </div>
                <div class="checkbox__toggle col-lg-6 col-md-12">
                  <input type="checkbox" name="teacher_email_on" id="teacher_mail_on" @click="toggleEmailOn" v-model="student.mailOn">
                  <label for="teacher_mail_on"><small>Email уведомления: </small></label>
                  <hr>
                </div>
                <div class="checkbox__toggle col-lg-6 col-md-12">
                  <input type="checkbox" name="student_is_active" id="student_is_active" @click="toggleEmailActivated" v-model="student.activated">
                  <label for="student_is_active"><small>Email активирован: </small></label>
                  <hr>
                </div>
              </div>

              <div class="profile-more-info__text">
                <small>Дата регистрации: </small>
                <p v-if="student.regDate">{{student.regDate}}</p>
                <p v-else>-</p>
              </div>
              <hr>
    
            </div>
          
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway';
export default {
  name: 'StudentDetail',
  data () {
    return {
      student_id: this.$route.params.id,
      student: '',
      learningProcessMainInfo: '',
      learningProcessChartInfo: '',
      regMainInfo: '',
      regSheduleInfo: '',
      selectedGroup: '',
      selectedLevel: '',
      selectedTeacher: '',
      selectedRate: '',
      selectSuitableGroup: 0,
      selectedTime: [],
      levelEditing: 0,
      temp_level_id: null,
      visitHistory: [],
      visitHistoryOrderDesc: 0,
      visitHistoryTo: 10,
      visitHistoryFrom: 0,
      visitHistoryPagination: false,
      editingChart: false,
      loadingChart: false,
      learningProcessChartInfoOld: '',
      minChartLesson: 1,
      profileDropdownShow: false
    }
  },
  directives: {
    onClickaway: onClickaway,
  },
  created() {
    this.getStudentAllInfo(this.student_id);
    this.getVisitHistory();
  },
  computed: {
    avaUrlComputed: function(){return this.student.ava.indexOf("/") == -1?`${this.$commonPhotoUrl}${this.student.ava}`:this.student.ava},
    studentSignUrlComputed: function () { return `${ this.$webSmartchatUrl }guide?code=${ this.student.guide }` }
  },
  methods: {
    closeDropdown: function () {
      console.log('popal')
      this.profileDropdownShow = false;
    },
    clipboardUrl: function () {
      let str = `${ this.$webSmartchatUrl }guide?code=${ this.student.guide }`
      this.$clipboard(str);
      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        type: 'success',
        title: 'Текст скопирован',
      })
    },
    chartEnableEditing: function(index) {
      this.learningProcessChartInfo[index].editing = true;
    },
    chartDisableEditing: function(index) {
      this.learningProcessChartInfo[index].editing = false;
    },
    resetChartColor: function (index) {
      this.learningProcessChartInfo[index].start_day_color = 'white';
      this.learningProcessChartInfo[index].finish_day_color = 'white';
      this.learningProcessChartInfo[index].start_time_color = 'white';
      this.learningProcessChartInfo[index].finish_time_color = 'white';
    },
    chartValidate: function (index) {
      this.resetChartColor(index);
      let start_date = new Date( `${this.learningProcessChartInfo[index].start_day} 
                                  ${this.learningProcessChartInfo[index].start_time}`).valueOf();
      let finish_date = new Date(`${this.learningProcessChartInfo[index].finish_day} 
                                  ${this.learningProcessChartInfo[index].finish_time}`).valueOf();
      let flag = false;
      if (!this.learningProcessChartInfo[index].finish_day || 
          !this.learningProcessChartInfo[index].start_day || 
          !start_date || !finish_date) {
        if (!this.learningProcessChartInfo[index].finish_day) {
          this.learningProcessChartInfo[index].finish_day_color = 'linen';
        } 
        if (!this.learningProcessChartInfo[index].start_day) {
          this.learningProcessChartInfo[index].start_day_color = 'linen';
        } 
        if(!start_date) {
          this.learningProcessChartInfo[index].start_time_color = 'linen';
        } 
        if(!finish_date) {
          this.learningProcessChartInfo[index].finish_time_color = 'linen';
        } 
        flag = true;
      } else {
        let sdt = new Date( `${this.learningProcessChartInfo[index].start_day}`).valueOf();
        let fdt = new Date( `${this.learningProcessChartInfo[index].finish_day}`).valueOf();

        if (sdt>fdt) {
          this.learningProcessChartInfo[index].start_day_color = 'linen';
          this.learningProcessChartInfo[index].finish_day_color = 'linen';
          flag = true;
        } else if (sdt == fdt) {
          if (start_date>finish_date) {
            this.learningProcessChartInfo[index].start_time_color = 'linen';
            this.learningProcessChartInfo[index].finish_time_color = 'linen';
            flag = true;
          } 
        } 
      }
      return flag;
    },
    editingAllCharts: function () {
      this.editingChart = true;
      this.learningProcessChartInfoOld = JSON.parse(JSON.stringify(this.learningProcessChartInfo))

      if (this.learningProcessChartInfoOld.length) {
        let len = this.learningProcessChartInfoOld.length, min = Infinity;

        while (len--) {
          if (this.learningProcessChartInfoOld[len].lesson < min) {
            min = this.learningProcessChartInfoOld[len].lesson;
          }
        }

        this.minChartLesson = min

        for (let i = 0; i < this.learningProcessChartInfoOld.length; i++) {
          this.resetChartColor(i);
          this.chartEnableEditing(i);
        }
      } 
    },
    disableEditingAllCharts: function () {
      this.editingChart = false;
      this.learningProcessChartInfo = this.learningProcessChartInfoOld;
      this.learningProcessChartInfoOld = '';
    },
    createSendingCharts: function () {
      let oldData =  JSON.parse(JSON.stringify(this.learningProcessChartInfoOld));
      let newData = JSON.parse(JSON.stringify(this.learningProcessChartInfo))

      if (!oldData.length && !newData.length) {
        return [];
      }

      let data = [];

      if (newData.length) {
        let newCharts = [];
        for (var i = 0; i < newData.length; i++) {
          if (!newData[i].chart_id) {
            let start_date = new Date( `${newData[i].start_day} ${newData[i].start_time}`).valueOf();
            let finish_date = new Date(`${newData[i].finish_day} ${newData[i].finish_time}`).valueOf();
            newCharts.push({
              chart_id: false,
              start: start_date,
              finish: finish_date,
              deleted: false
            })
          }
        }
        if (oldData.length) {
          let filteredNewData = newData.filter( data => data.chart_id );
          for (let i = 0; i < oldData.length; i++) {
            let deletedChart = true; 
            for (let j = 0; j < filteredNewData.length; j++) {
              if (oldData[i].chart_id === filteredNewData[j].chart_id) {
                let start_date = new Date( `${filteredNewData[j].start_day} ${filteredNewData[j].start_time}`).valueOf();
                let finish_date = new Date(`${filteredNewData[j].finish_day} ${filteredNewData[j].finish_time}`).valueOf();
                data.push({
                  chart_id: filteredNewData[j].chart_id,
                  start: start_date,
                  finish: finish_date,
                  deleted: false
                })
                deletedChart = false
              } 
            }
            if (deletedChart) {
              data.push({
                chart_id: oldData[i].chart_id,
                deleted: true
              }) 
            }
          }
          if (newCharts.length) {
            data = data.concat(newCharts)
          } 
        } else {
          data = newCharts;
        }
        
        data.sort(function (a, b) {
          if (!a.start) {
            a.start = 0;
          }
          if (!b.start) {
            b.start = 0;
          }
          if (a.start > b.start) {
            return 1;
          }
          if (a.start < b.start) {
            return -1;
          }
          return 0;
        });

        let counter = 0;

        for (let i = 0; i < data.length; i++) {
          if (!data[i].deleted) {
            data[i].lesson = this.minChartLesson+counter;
            counter++;
          } else {
            delete data[i].start;
          }
        }
      } else {
        for (let i = 0; i < oldData.length; i++) {
          data.push({
            chart_id: oldData[i].chart_id,
            deleted: true
          }) 
        }
      }

      return data;
    },
    saveAllCharts: function () {
      this.loadingChart = true;
      let flag = false;
      for (let i = 0; i < this.learningProcessChartInfo.length; i++) {
        let value = this.chartValidate(i);
        if (value) {
          flag = true;
        }
      }
      if (!flag) {
        let data = this.createSendingCharts();
        console.log('data', data)
        
        if (data.length) {
          this.$http.post(`/student`, `method=UPDATE-STUDENT-ALL-CHARTS&data=${JSON.stringify(data)}&&group_id=${this.learningProcessMainInfo.group_id}`)
          .then(async (response) => {
            if (response.data.status == 200) {
              this.loadingChart = false;
              this.editingChart = false;
              this.learningProcessChartInfoOld = '';
              this.$swal({
                type: 'success',
                title: 'Успешно!',
                text: `Расписание изменено!`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              });
              this.getLearningProcess();
            } else { throw new Error(response.statusText); }
          })
          .catch(e => { 
            this.loadingChart = false;
            this.$swal({
              type: 'error',
              title: 'Ошибка!',
              text: `${e}`,
              buttonsStyling: false,
              confirmButtonClass: 'swal-btn swal-btn__confirm'
            }) 
          })
        } else {
          this.loadingChart = false;
          this.editingChart = false;   
        }
      } else {
        this.loadingChart = false;
        this.$swal({
          type: 'error',
          title: 'Правильно заполните все поля!',
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        }) 
      }
    },
    addChart: function () {
      let arr = JSON.parse(JSON.stringify(this.learningProcessChartInfo))
      let len = arr.length, max = this.minChartLesson;

      while (len--) {
        if (arr[len].lesson > max) {
          max = arr[len].lesson;
        }
      }
      
      max += 1;

      this.learningProcessChartInfo.unshift({
        chart_id: null,
        lesson: max,
        lesson_color:'white',
        start_day:null,
        start_day_color:'white',
        finish_day:null,
        finish_day_color:'white',
        start_time:null,
        start_time_color:'white',
        finish_time:null,
        finish_time_color:'white',
        editing:1,
      })
    },
    spliceChart: function (index) {
      this.learningProcessChartInfo.splice(index, 1);
    },
    learningProcessChartInfoParse: function (data) {
      if (data.length) {
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
      } else { 
        return [];
      }
    },
    getClientInterval: function(data) {
      let newData = [];

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].time.length; j++) {
          newData = newData.concat([data[i].time[j].start_time, data[i].time[j].finish_time, data[i].nday]);
        }
      }

      newData = this.$toClient(newData);

      let newArr = [];

      for(let i = 2; i < newData.length; i+=3) {
        let start = newData[i-2]<10?'0'+newData[i-2]+':00':newData[i-2]+':00'
        let finish = newData[i-1]<10?'0'+newData[i-1]+':00':newData[i-1]+':00'
        newArr.push({nday: newData[i], time: [{start_time: start, finish_time: finish}]})
      }

      for(let i = 0; i < newArr.length - 1; i++){
        for(let j = i+1; j < newArr.length; j++) {
          if(newArr[i].nday === newArr[j].nday){
            newArr[i].weekday = this.$getFullWeekDayName(newArr[i].nday);
            newArr[i].time.push(newArr[j].time[0]);
            newArr.splice(j, 1);
            j--;
          }
        }
      }

      return newArr;
    },
    getVisitHistory: function (flag) {
      if (flag) {
        this.$http.post(`/student`, `method=GET-VISIT-HISTORY&student_id=${this.student_id}&&order=${this.visitHistoryOrderDesc}&&from=${this.visitHistoryFrom}&&to=${this.visitHistoryTo}`)
        .then(async (response) => {
          console.log('visitHistory',response.data)
          if (response.data.status == 200) {
            this.visitHistoryFrom += response.data.visitHistory.length;
            if (response.data.visitHistory.length < this.visitHistoryTo) this.visitHistoryPagination = false;
            else this.visitHistoryPagination = true;
            this.visitHistory = this.visitHistory.concat(response.data.visitHistory);
          } else if (response.status == 204) { this.visitHistoryPagination = false; } else { throw new Error(response.statusText); }
        })
        .catch(e => { console.log(e) })
        
      } else {
        this.visitHistoryFrom = 0;
        this.$http.post(`/student`, `method=GET-VISIT-HISTORY&student_id=${this.student_id}&&order=${this.visitHistoryOrderDesc}&&from=${this.visitHistoryFrom}&&to=${this.visitHistoryTo}`)
        .then(async (response) => {
          console.log('visitHistory',response.data.visitHistory)
          if (response.data.status == 200) {
            if (this.visitHistoryOrderDesc) {
              this.visitHistoryOrderDesc = 0;
            } else {
              this.visitHistoryOrderDesc = 1;
            }
            if (response.data.visitHistory.length < this.visitHistoryTo) this.visitHistoryPagination = false;
            else this.visitHistoryPagination = true;
            this.visitHistory = response.data.visitHistory;
          } else { throw new Error(response.statusText); }
        })
        .catch(e => { console.log(e) })
      }
    },
    resetThePassword: function () {
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
          return this.$http.post(`/student`, `method=UPDATE-STUDENT-PASSWORD&student_id=${ this.student_id }`)
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
    levelEnableEditing: function () {
      this.levelEditing = 1;
      this.temp_level_id = this.student.lvl_id;
    },
    levelSaveEdit: function () {
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
          return this.$http.post(`/student`, `method=UPDATE-STUDENT-LEVEL&student_id=${ this.student_id }&level_id=${ this.temp_level_id }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          let afterLevelName = this.student.lvl_name;
          let beforeLevelName = null;
          this.student.lvl_id = this.temp_level_id;
          for (let i = 0; i < this.selectedLevel.length; i++) {
            if(this.selectedLevel[i].lvl_id == this.student.lvl_id) { 
              this.student.lvl_name = this.selectedLevel[i].lvl_name; 
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
    levelDisableEditing: function () {
      this.levelEditing = 0;
      this.temp_level_id = null;
    },
    toggleEmailOn: function (event) {
      event.preventDefault();
      let title='',text='',confirmButtonText='';
      if (this.student.mailOn)  { title='Отключить email уведомления?';text='Email уведомления отключен!';confirmButtonText='Отключить' }
      else                      { title='Включить email уведомления?';text='Email уведомления включен!';confirmButtonText='Включить' }
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
          return this.$http.post(`/student`, `method=UPDATE-STUDENT-MAIL-ON&student_id=${ this.student_id }&value=${ this.student.mailOn ? 0 : 1 }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.student.mailOn = this.student.mailOn ? 0 : 1;
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
    toggleSmsOn: function (event) {
      event.preventDefault();
      let title='',text='',confirmButtonText='';
      if (this.student.smsOn) { title='Отключить смс уведомления?';text='Смс уведомления отключен!';confirmButtonText='Отключить' }
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
          return this.$http.post(`/student`, `method=UPDATE-STUDENT-SMS-ON&student_id=${ this.student_id }&value=${ this.student.smsOn ? 0 : 1 }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.student.smsOn = this.student.smsOn ? 0 : 1;
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
    toggleEmailActivated: function (event) {
      event.preventDefault();
      let title='',text='',confirmButtonText='';
      if (this.student.activated) { title='Деактивировать email?';text='Email деактивирован!';confirmButtonText='Деактивировать' }
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
          return this.$http.post(`/student`, `method=UPDATE-STUDENT-EMAIL-ACTIVATE&student_id=${ this.student_id }&value=${ this.student.activated }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.student.activated = this.student.activated ? 0 : 1;
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
    togglePhoneActivated: function (event) {
      event.preventDefault();
      let title='',text='',confirmButtonText='';
      if (this.student.is_active) { title='Деактивировать номер?';text='Номер деактивирован!';confirmButtonText='Деактивировать' }
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
          return this.$http.post(`/student`, `method=UPDATE-STUDENT-PHONE-ACTIVATE&student_id=${ this.student_id }&value=${ this.student.is_active }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.student.is_active = this.student.is_active ? 0 : 1;
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
    toggleBlocked: function (event) {
      event.preventDefault();
      let title='',text='',confirmButtonText='';
      if (this.student.blocked) { title='Разблокировать аккаунт?';text='Студент разблокирован!';confirmButtonText='Разблокировать' } 
      else                      { title='Заблокировать аккаунт?';text='Студент заблокирован!';confirmButtonText='Заблокировать' }
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
          return this.$http.post(`/student`, `method=BLOCK&student_id=${ this.student_id }&block=${ this.student.blocked ? 0 : 1 }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.student.blocked = this.student.blocked ? 0 : 1;
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
    toggleStream: function (event) {
      event.preventDefault();
      let title = '', text = '', confirmButtonText = '';
      if (this.student.stream)  { title = 'Закрыть стрим?'; text = 'Стрим закрыт!'; confirmButtonText = 'Закрыть' } 
      else                      { title = 'Открыть стрим?'; text = 'Стрим открыт!'; confirmButtonText = 'Открыт' }
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
        preConfirm: () => {
          return this.$http.post(`/student`, `method=STREAM&student_id=${ this.student_id }&stream=${ this.student.stream ? 0 : 1 }`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.student.stream = this.student.stream ? 0 : 1;
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            text: text,
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
    dateIsoToLocal: function (date) { return new Date(date).toLocaleString().split(",")[0]; },
    generateSelectedTime: function () {
      let dt = new Date(1970, 0, 1, 0, 0, 0, 0), rc = [];
      while (dt.getDate() == 1) {
        rc.push(dt.toTimeString().match(/(\d\d:\d\d)/)[0]);
        dt.setMinutes(dt.getMinutes() + 30);
      }
      this.selectedTime = rc;
    },
    getStudentAllInfo: function () {
      this.$http.post(`/student`, `method=GET-STUDENT-ALL-INFO&student_id=${this.student_id}`)
      .then(async (response) => {
        console.log('allInfo',response)
        if (response.data.status == 200) {
          this.student = response.data.student;
          console.log(this.student)
          this.selectedLevel = response.data.level;
          this.learningProcessMainInfo = response.data.learningProcessMainInfo;
          this.learningProcessChartInfo = this.learningProcessChartInfoParse(response.data.learningProcessChartInfo);
          this.regMainInfo = response.data.regMainInfo;
          this.regSheduleInfo = this.getClientInterval(response.data.regSheduleInfo);
          this.generateSelectedTime();
        } else { throw new Error(response.statusText); }
      })
      .catch(e => { console.log(e) })
    },
    getStudentBasicInfo: function () {
      this.$http.post(`/student`, `method=GET-STUDENT-BASIC-INFO&student_id=${this.student_id}`)
      .then(async (response) => {
        console.log('basicInfo',response.data)
        if (response.data.status == 200) {
          this.student = response.data.student;
          this.selectedLevel = response.data.level;
        } else { throw new Error(response.statusText); }
      })
      .catch(e => { console.log(e) })
    },
    getLearningProcess: function () {
      this.$http.post(`/student`, `method=GET-LEARNING-PROCESS&student_id=${this.student_id}`)
      .then(async (response) => {
        console.log('learningProcess',response.data)
        if (response.data.status == 200) {
          this.learningProcessMainInfo = response.data.learningProcessMainInfo;
          this.learningProcessChartInfo = this.learningProcessChartInfoParse(response.data.learningProcessChartInfo);
          this.generateSelectedTime();
        } else { throw new Error(response.statusText); }
      })
      .catch(e => { console.log(e) })
    },
    getRegInfo: function () {
      this.$http.post(`/student`, `method=GET-REG-INFO&student_id=${this.student_id}`)
      .then(async (response) => {
        console.log('reqInfo',response.data)
        if (response.data.status == 200) {
          this.regMainInfo = response.data.regMainInfo;
          this.regSheduleInfo = this.getClientInterval(response.data.regSheduleInfo);
        } else { throw new Error(response.statusText); }
      })
      .catch(e => { console.log(e) })
    },
    showEditRatePopup: function () {
      let vm = this;
      vm.$http.post(`/student`, `method=GET-SELECTED-RATE`)
      .then(async (response) => {
        let title = 'Все преподаватели';
        if (response.status == 200) {
          vm.GetSelectedRate = response.data;
          let inputOptions = {};
          for (var i = 0; i < vm.GetSelectedRate.rate.length; i++) {
            inputOptions[vm.GetSelectedRate.rate[i].rate_id] = `
              <div class="row"> 
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Тариф : </small>
                    <p class="col-12">
                      <a class="text-link" href="/teacher/${vm.GetSelectedRate.rate[i].rate_id}">
                        ${vm.GetSelectedRate.rate[i].rate_name}
                      </a>
                    </p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Информация : </small>
                    <p class="col-12">
                      <span>
                        ${vm.GetSelectedRate.rate[i].rate_title}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            `;
          };
          vm.$swal({
            title: title,
            input: 'radio',
            inputClass: 'swal-radio',
            customClass: 'swal-radio-container',
            inputOptions: inputOptions,
            inputValue: vm.learningProcessMainInfo.rate_id,
            inputValidator: (value) => { return !value && 'Выберите преподавателя!' },
            showCancelButton: true,
            reverseButtons: true,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm',
            cancelButtonClass: 'swal-btn swal-btn__cancel',
            confirmButtonText: 'Изменить',
            cancelButtonText: 'Отмена',
            showLoaderOnConfirm: true,
            preConfirm: (key) => {
              if (key) { 
                if (+key == vm.learningProcessMainInfo.rate_id) {
                  return -1;
                } else {
                  return vm.$http.post(`/student`, `method=UPDATE-STUDENT-GROUP-RATE&rate_id=${key}&group_id=${vm.learningProcessMainInfo.group_id}`)
                  .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
                  .catch(e => { throw new Error(response.statusText); })
                }
              }
            },
            allowOutsideClick: () => !this.$swal.isLoading()
          })
          .then((result) => {
            console.log(result)
            if (result.value && result.value !== -1) {
              vm.$swal({
                type: 'success',
                title: 'Успешно!',
                text: `Тариф изменен!`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              });
              vm.getLearningProcess()
            } else if (result.value && result.value === -1) {
              vm.$swal({
                type: 'info',
                title: 'Вы выбрали текущий тариф, тариф не изменен!',
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              })
            }
          })
          .catch(e => { 
              vm.$swal({
                type: 'error',
                title: 'Ошибка!',
                text: `${e}`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              })
          })
        } else if (response.status == 204) {
          vm.$swal({
            type: 'info',
            title: 'Тарифы не найдены!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          })
        } else { throw new Error(response.statusText); }
      })
      .catch(e => {
        console.log(e)
        vm.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${e}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        })
      })
    },
    showEditRateTeacherPopup: function () {
      let vm = this;
      vm.$http.post(`/student`, `method=GET-SELECTED-TEACHER&student_id=${vm.student_id}`)
      .then(async (response) => {
        let title = 'Все преподаватели';
        if (response.status == 200) {
          vm.selectedTeacher = response.data;
          let inputOptions = {};
          for (var i = 0; i < vm.selectedTeacher.teacher.length; i++) {
            inputOptions[vm.selectedTeacher.teacher[i].teacher_id] = `
              <div class="row"> 
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Преподаватель : </small>
                    <p class="col-12">
                      <a class="text-link" href="/teacher/${vm.selectedTeacher.teacher[i].teacher_id}">
                        ${vm.selectedTeacher.teacher[i].fio}
                      </a>
                    </p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Количество групп : </small>
                    <p class="col-12">
                      <span>
                        ${vm.selectedTeacher.teacher[i].group_count}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            `;
          };
          vm.$swal({
            title: title,
            input: 'radio',
            inputClass: 'swal-radio',
            customClass: 'swal-radio-container',
            inputOptions: inputOptions,
            inputValue: vm.learningProcessMainInfo.teacher_id,
            inputValidator: (value) => { return !value && 'Выберите преподавателя!' },
            showCancelButton: true,
            reverseButtons: true,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm',
            cancelButtonClass: 'swal-btn swal-btn__cancel',
            confirmButtonText: 'Изменить',
            cancelButtonText: 'Отмена',
            showLoaderOnConfirm: true,
            preConfirm: (key) => {
              if (key) { 
                if (+key == vm.learningProcessMainInfo.teacher_id) {
                  return -1;
                } else {
                  return vm.$http.post(`/student`, `method=UPDATE-STUDENT-GROUP-TEACHER&teacher_id=${key}&group_id=${vm.learningProcessMainInfo.group_id}`)
                  .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
                  .catch(e => { throw new Error(response.statusText); })
                }
              }
            },
            allowOutsideClick: () => !this.$swal.isLoading()
          })
          .then((result) => {
            console.log(result)
            if (result.value && result.value !== -1) {
              vm.$swal({
                type: 'success',
                title: 'Успешно!',
                text: `Преподаватель изменен!`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              });
              vm.getLearningProcess()
            } else if (result.value === -1) {
              vm.$swal({
                type: 'info',
                title: 'Вы выбрали текущего преподавателя, преподаватель не изменен!',
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              })
            } 
          })
          .catch(e => { 
              vm.$swal({
                type: 'error',
                title: 'Ошибка!',
                text: `${e}`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              })
          })
        } else if (response.status == 204) {
          vm.$swal({
            type: 'info',
            title: 'Преподаватели не найдены!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          })
        } else { throw new Error(response.statusText); }
      })
      .catch(e => {
        console.log(e)
        vm.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${e}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        })
      })
    },
    showEditReqPopup: function () {
      let vm = this;
      vm.$http.post(`/student`, `method=GET-SELECTED-TEACHER&student_id=${vm.student_id}`)
      .then(async (response) => {
        let title = 'Все преподаватели';
        if (response.status == 200) {
          vm.selectedTeacher = response.data;
          let inputOptions = {};
          for (var i = 0; i < vm.selectedTeacher.teacher.length; i++) {
            inputOptions[vm.selectedTeacher.teacher[i].teacher_id] = `
              <div class="row"> 
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Преподаватель : </small>
                    <p class="col-12">
                      <a class="text-link" href="/teacher/${vm.selectedTeacher.teacher[i].teacher_id}">
                        ${vm.selectedTeacher.teacher[i].fio}
                      </a>
                    </p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Количество групп : </small>
                    <p class="col-12">
                      <span>
                        ${vm.selectedTeacher.teacher[i].group_count}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            `;
          };
          vm.$swal({
            title: title,
            input: 'radio',
            inputClass: 'swal-radio',
            customClass: 'swal-radio-container',
            inputOptions: inputOptions,
            inputValue: vm.regMainInfo.teacher_id,
            inputValidator: (value) => { return !value && 'Выберите преподавателя!' },
            showCancelButton: true,
            reverseButtons: true,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm',
            cancelButtonClass: 'swal-btn swal-btn__cancel',
            confirmButtonText: 'Изменить',
            cancelButtonText: 'Отмена',
            showLoaderOnConfirm: true,
            preConfirm: (key) => {
              if (key) { 
                if (+key == vm.regMainInfo.teacher_id) {
                  return -1;
                } else {
                  return vm.$http.post(`/student`, `method=UPDATE-STUDENT-REG-TEACHER&teacher_id=${key}&student_id=${vm.student_id}`)
                  .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
                  .catch(e => { throw new Error(response.statusText); })
                }
              }
            },
            allowOutsideClick: () => !this.$swal.isLoading()
          })
          .then((result) => {
            console.log(result)
            if (result.value && result.value !== -1) {
              vm.$swal({
                type: 'success',
                title: 'Успешно!',
                text: `Преподаватель изменен!`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              });
              vm.getRegInfo();
            } else if (result.value === -1) {
              vm.$swal({
                type: 'info',
                title: 'Вы выбрали текущего преподавателя, преподаватель не изменен!',
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              })
            } 
          })
          .catch(e => { 
              vm.$swal({
                type: 'error',
                title: 'Ошибка!',
                text: `${e}`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              })
          })
        } else if (response.status == 204) {
          vm.$swal({
            type: 'info',
            title: 'Преподаватели не найдены!',
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          })
        } else { throw new Error(response.statusText); }
      })
      .catch(e => {
        console.log(e)
        vm.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${e}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        })
      })
    },
    showEditGroupPopup: async function () {
      let vm = this;
      vm.$http.post(`/student`, `method=GET-SELECTED-GROUP&student_id=${vm.student_id}&all=${vm.selectSuitableGroup}`)
      .then(async (response) => {
        let footerText = '';
        let title = '';
        if (vm.selectSuitableGroup) {
          title = 'Все группы';
          footerText = '<p class="text-link" id="toggle_selected_group">Показать подходящие группы!</p>';
        } else {
          title = 'Подходящие группы';
          footerText = '<p class="text-link" id="toggle_selected_group">Показать все группы!</p>';
        };
        function toggleSelectedGroup(element) {
          element.addEventListener("click", ()=> {
            if (vm.selectSuitableGroup) {
              vm.selectSuitableGroup = 0;
              vm.showEditGroupPopup();
            } else {
              vm.selectSuitableGroup = 1;
              vm.showEditGroupPopup();
            }
          })
        };
        if (response.status == 200) {
          vm.selectedGroup = response.data;
          let inputOptions = {};
          for (let i = 0; i < vm.selectedGroup.group.length; i++) {
            inputOptions[vm.selectedGroup.group[i].group_id] = `
              <div class="row"> 
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Названия группы : </small> 
                    <p class="col-12">
                      <a class="text-link" href="/group/${vm.selectedGroup.group[i].group_id}">
                        ${vm.selectedGroup.group[i].group_name}
                      </a>
                    </p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Преподаватель : </small>
                    <p class="col-12">
                      <a class="text-link" href="/teacher/${vm.selectedGroup.group[i].teacher_id}">
                        ${vm.selectedGroup.group[i].fio}
                      </a>
                    </p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Тариф : </small>
                    <p class="col-12">
                      <a class="text-link" href="/teacher/${vm.selectedGroup.group[i].rate_id}">
                        ${vm.selectedGroup.group[i].rate_name}
                      </a>
                    </p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Количество занятий : </small>
                    <p class="col-12">
                      <span>
                        ${vm.selectedGroup.group[i].lesson_count}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            `;
          };
          vm.$swal({
            title: title,
            input: 'radio',
            inputClass: 'swal-radio',
            customClass: 'swal-radio-container',
            inputOptions: inputOptions,
            inputValue: vm.learningProcessMainInfo.group_id,
            inputValidator: (value) => { return !value && 'Выберите группу!' },
            showCancelButton: true,
            reverseButtons: true,
            buttonsStyling: false,
            footer: footerText,
            onOpen: ()=> {toggleSelectedGroup(document.getElementById('toggle_selected_group'))},
            confirmButtonClass: 'swal-btn swal-btn__confirm',
            cancelButtonClass: 'swal-btn swal-btn__cancel',
            confirmButtonText: 'Изменить',
            cancelButtonText: 'Отмена',
            showLoaderOnConfirm: true,
            preConfirm: (key) => {
              if (key) { 
                if (+key == vm.learningProcessMainInfo.group_id) {
                  return -1;
                } else {
                  return vm.$http.post(`/student`, `method=UPDATE-STUDENT-GROUP&group_id=${key}&student_id=${vm.student_id}`)
                  .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
                  .catch(e => { throw new Error(response.statusText); })
                }
              }
            },
            allowOutsideClick: () => !this.$swal.isLoading()
          })
          .then((result) => {
            if (result.value && result.value !== -1) {
              vm.$swal({
                type: 'success',
                title: 'Успешно!',
                text: `Группа изменено!`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              });
              vm.getLearningProcess();
            } else if (result.value === -1) {
              vm.$swal({
                type: 'info',
                title: 'Вы выбрали текущую группу, группа не изменена!',
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              })
            } 
          })
          .catch((error) => {
            console.log('error',error)
            this.$swal({
              type: 'error',
              title: 'Ошибка!',
              text: `${error}`,
              buttonsStyling: false,
              confirmButtonClass: 'swal-btn swal-btn__confirm'
            });
          })
        } else if (response.status == 204) {
          if (vm.selectSuitableGroup) {
            vm.$swal({
              type: 'info',
              title: 'Группы не найдены!',
              buttonsStyling: false,
              footer: footerText,
              onOpen: ()=> {toggleSelectedGroup(document.getElementById('toggle_selected_group'))},
              confirmButtonClass: 'swal-btn swal-btn__confirm'
            })
          } else {
            vm.$swal({
              type: 'info',
              title: 'Нет подходящих групп для данного студента!',
              buttonsStyling: false,
              footer: footerText,
              onOpen: ()=> {toggleSelectedGroup(document.getElementById('toggle_selected_group'))},
              confirmButtonClass: 'swal-btn swal-btn__confirm'
            })
          }
        } else { throw new Error("response.statusText"); }
      })
      .catch(e => {
        vm.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${e}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        })
      })
    }
  }
}
</script>
<style src="@/assets/styles/pages/studentdetail.css" scoped></style>
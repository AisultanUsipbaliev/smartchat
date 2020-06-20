<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card__header ">
            <h2>Список студентов</h2>
            <ul class="card__action">
              <li>
                <a href="#;"><fai icon="expand-arrows-alt"/></a>
              </li>
            </ul>
          </div>
          <div class="card__body">
            <div class="table-filter-block">
              <div class="row">
                <!-- <div class="col-md-4 col-sm-12 m-0 p-0"></div> -->
                <div class="col-md-4 col-sm-12">
                  <label for="input-student">Студент : </label>
 									<input id="input-student" list="student" type="text" v-model="student" placeholder="Введите текст" class="input form-control-sm">
 									<datalist id="student">
										<option v-for="item in student_list" :value="item.student_id">{{item.fio}}</option>
									</datalist>
                </div>
                <div class="col-md-4 col-sm-12 pl-md-2 pr-md-2">
                  <label for="input-rate">Тариф : </label>
									<input id="input-rate" list="rate" type="text" v-model="rate" placeholder="Введите текст" class="input form-control-sm">
									<datalist id="rate">
										<option v-for="item in rate_list" :value="item.rate_id">{{item.rate_name}}</option>
									</datalist>
                </div>
              </div>
            </div>
            <!-- <div class="row mt-3 mb-3 mr-0 ml-0">
              <div class="col-12 p-0 m-0 ">
                <div class="row m-0 d-flex justify-content-between d-flex align-items-center">
                  <div class="col-md-12 d-flex justify-content-end align-items-center pr-md-3">
                    <div class="row">
                      <div class="d-flex align-items-center">
                        <button v-if="!loading" @click="addShedule" class="card-body-btn">
                          <fai icon="plus-square" class="mr-2"/>Добавить
                        </button>
                        <button v-if="loading" @click="console.log('0')" class="card-body-btn" :disabled="loading">
                          <fai icon="spinner" class="mr-2" pulse/>Добавить
                        </button>
                        <button v-if="!loading" @click="console.log('0')" class="card-body-btn">
                          <fai icon="save" class="mr-2"/>Сохранить
                        </button>
                        <button v-if="loading" class="card-body-btn" :disabled="loading?'disabled':''">
                          <fai icon="spinner" class="mr-2" pulse/>Сохранить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>День недели</th>
                    <th>Начало</th>
                    <th>Конец</th>
                    <th>Настройки</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in shedule">
                    <td>
                      <div class="row m-0 mb-2">
                        <select v-bind:style="{ backgroundColor: item.start_color }" class="select table_select col-sm-12" v-model="item.weekday">
                          <option v-for="week in 6" :value="week">{{$getFullWeekDayName(week)}}</option>
                        </select> 
                      </div>
                    </td>
                    <td>
                      <div class="row m-0 mb-2">
                        <select v-bind:style="{ backgroundColor: item.start_color }" class="select table_select col-sm-12" v-model="item.start">
                          <option v-for="time in selectedTime" :value="time">{{time}}</option>
                        </select> 
                      </div>
                    </td>
                    <td>
                      <div class="row m-0 mb-2">
                        <select v-bind:style="{ backgroundColor: item.finish_color }" class="select table_select col-sm-12" v-model="item.finish">
                          <option v-for="time in selectedTime" :value="time">{{time}}</option>
                        </select> 
                      </div>
                    </td>
                    <td class="table__btn-container">
                      <button class="btn" title="Удалить" @click="console.log();">
                        <fai icon="trash-alt"/>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card__footer">
            <button @click="addShedule" class="btn ml-4">Добавить</button>
            <button @click="console.log()" class="btn ml-4">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddClasses',
  data () {
    return {
      student: '',
      teacher: '',
      rate: '',
      student_list: '',
      teacher_list: '',
      rate_list: '',
      loading: false,
      shedule: [],
      id: 0,
      selectedTime: [],
      selectedWeekday: [0,1,2,3,4,5,6]
    }
  },
  created() {
    this.generateSelectedTime();
    this.addShedule();
    // INSERT-STUDENT-SHEDULE
  	this.$http.post(`/student`, `method=GET-SRT-LIST`)
    .then(async (response) => {
      if (response.data.status == 200) {
      	console.log('response', response.data)
      	this.student_list = response.data.student_list;
	      this.teacher_list = response.data.teacher_list;
	      this.rate_list = response.data.rate_list;
      } else { 
      	throw new Error(response.statusText); 
      }
    })
    .catch(e => { 
    	console.log(e);
    })

  },
  methods: {
    generateSelectedTime: function () {
      let dt = new Date(1970, 0, 1, 0, 0, 0, 0), rc = [];
      while (dt.getDate() == 1) {
        rc.push(dt.toTimeString().match(/(\d\d:\d\d)/)[0]);
        dt.setMinutes(dt.getMinutes() + 30);
      }
      this.selectedTime = rc;
    },
    addShedule: function () {
      this.id++
      this.shedule = this.shedule.concat([{weekday: null, start: null, start_color: 'white', finish: null, finish_color: 'white', id: this.id}])
    }
  }
}
</script>

<!-- <style scoped>
	
</style>
 -->


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
										<option v-for="item in student_list" :value="item.fio"></option>
									</datalist>
                </div>
                <div class="col-md-4 col-sm-12 pl-md-2 pr-md-2">
                  <label for="input-rate">Тариф : </label>
									<input id="input-rate" list="rate" type="text" v-model="rate" placeholder="Введите текст" class="input form-control-sm">
									<datalist id="rate">
										<option v-for="item in rate_list" :value="item.rate_name"></option>
									</datalist>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>День недели</th>
                    <th>Начало</th>
                    <th>Конец</th>
                  </tr>
                </thead>
                <tbody v-for="(item, index) in shedule">
                  <selector :item="item" :start="item.start" :finish="item.finish" :selectedTime="selectedTime"></selector>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card__footer">
            <button @click="saveShedule()" class="btn ml-4" v-if="rate && student && shedule[0]">Выбрать преподователя</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Selector from '@/components/selector'
export default {
  name: 'AddClasses',
  components:{ Selector },
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
      selectedWeekday: [0,1,2,3,4,5,6],
    }
  },
  created() {
    this.generateSelectedTime();
    for(let i = 0; i < 7; i++)
      this.addShedule(i);
    console.log(this.shedule)
    this.getAll();
  },
  methods: {
    getAll(){
      this.getStudents();
      this.getRates();
    },
    saveShedule(){
      let student, rate; 
      for(let i = 0; i < this.student_list.length; i++)
        if(this.student == this.student_list[i].fio){
          student = this.student_list[i].student_id;
          break;
        }
      for(let i = 0; i < this.rate_list.length; i++){
        if(this.rate == this.rate_list[i].rate_name){
          rate = this.rate_list[i].rate_id;
          break;
        }
      }
      let data = [];
      for(let i = 0; i < this.shedule.length; i++)
        if(this.shedule[i].start.split(':')[0] && this.shedule[i].finish.split(':')[0])
          data.push(this.$toServer([this.shedule[i].start.split(':')[0], this.shedule[i].finish.split(':')[0], this.shedule[i].weekday]))

      let end = [];
      for(let i = 0; i < data.length; i++)
        for(let j = 0; j < data[i].length; j++)
          end.push(data[i][j])
        console.log(end)
      this.$http.post(`/api`, `method=SUITABLE-TEACHERS&mas=${JSON.stringify(end)}&rate=${rate}&student=${student}`)
      .then(async response => {
        console.log('teachers', response.data)
        if (response.status === 200) {
          this.teachers = response.data.teachers;
          let inputOptions = {};
          for (var i = 0; i < this.teachers.length; i++) {
            inputOptions[this.teachers[i].teacher_id] = `
              <div class="row"> 
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Преподаватель : </small>
                    <p class="col-12">
                      <a class="text-link" href="/teacher/${this.teachers[i].teacher_id}">
                        ${this.teachers[i].login + ' ' + this.teachers[i].lastname}
                      </a>
                    </p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row">
                    <small class="col-12">Рейтинг : </small>
                    <p class="col-12">
                      <span>
                        ${this.teachers[i].rating}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            `;
          };
          this.$swal({
            title: 'Все преподаватели',
            input: 'radio',
            inputClass: 'swal-radio',
            customClass: 'swal-radio-container',
            inputOptions: inputOptions,
            inputValue: 0,
            inputValidator: (value) => { return !value && 'Выберите преподавателя!' },
            showCancelButton: true,
            reverseButtons: true,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm',
            cancelButtonClass: 'swal-btn swal-btn__cancel',
            confirmButtonText: 'Выбрать',
            cancelButtonText: 'Отмена',
            showLoaderOnConfirm: true,
            preConfirm: (key) => {
              return this.$http.post(`/api`, `method=NEW-CHART&teacher_id=${key}&mas=${JSON.stringify(end)}&rate_id=${rate}&student_id=${student}`)
              .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
              .catch(e => { throw new Error(response.statusText); })
            },
            allowOutsideClick: () => !this.$swal.isLoading()
          })
          .then((result) => {
            console.log(result)
            if (result.value && result.value !== -1) {
              this.$swal({
                type: 'success',
                title: 'Успешно!',
                text: `Тариф изменен!`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              });
            } else if (result.value && result.value === -1) {
              this.$swal({
                type: 'info',
                title: 'Вы выбрали текущий тариф, тариф не изменен!',
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              })
            }
          })
          .catch(e => { 
              this.$swal({
                type: 'error',
                title: 'Ошибка!',
                text: `${e}`,
                buttonsStyling: false,
                confirmButtonClass: 'swal-btn swal-btn__confirm'
              })
          })
        }else if (response.status === 202){
          this.$swal({
            type: 'error',
            title: 'Ошибка!',
            text: `На данное время нет свободных преподователей, выберите другое время!`,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          }); 
        }else { 
          throw new Error(response.statusText); 
        }
      })
      .catch(e => { 
        console.log(e);
      })
    },
    getStudents(){
      this.$http.post(`/api`, `method=GET-STUDENTS&unblockedStudents=1`)
      .then(async response => {
          console.log(response)
        if (response.data.status == 200) {
          this.student_list = response.data.students;
        } else { 
          throw new Error(response.statusText); 
        }
      })
      .catch(e => { 
        console.log(e);
      })
    },
    getRates(){
      this.$http.post(`/api`, `method=GET-RATES&activeRates=1`)
      .then(async response => {
        if (response.data.status == 200) {
          this.rate_list = response.data.rate;
        } else { 
          throw new Error(response.statusText); 
        }
      })
      .catch(e => { 
        console.log(e);
      })
    },
    generateSelectedTime() {
      let dt = new Date(1970, 0, 1, 0, 0, 0, 0), rc = ['нет'];
      while (dt.getDate() == 1) {
        rc.push(dt.toTimeString().match(/(\d\d:\d\d)/)[0]);
        dt.setMinutes(dt.getMinutes() + 30);
      }
      this.selectedTime = rc;
    },
    addShedule(nday) {
      this.id++
      this.shedule = this.shedule.concat([{weekday: nday, start: 'нет', start_color: 'white', finish: 'нет', finish_color: 'white', id: this.id}])
      // this.$watch(this.shedule[this.shedule.length], ()=> console.log(123))
    }
  }
}
</script>

<!-- <style scoped>
	
</style>
 -->


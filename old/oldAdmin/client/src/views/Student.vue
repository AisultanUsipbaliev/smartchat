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
                <div class="col-md-4 col-sm-12">
                  <label for="select">Показать по : </label>
                  <select v-model="limit" id="select" class="select form-control-sm" @change="getData();">
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                  </select>
                </div>
                <div class="col-md-4 col-sm-12 pl-md-2 pr-md-2">
                  <label for="select_all">Показать : </label>
                  <select id="select_all" v-model="filter" class="select form-control-sm" @change="getData();">
                    <option :value="null">Всех</option>
                    <option :value="0">Активных</option>
                    <option :value="1">Заблокированных</option>
                  </select>
                </div>
                <div class="col-md-4 col-sm-12">
                  <label for="search">Поиск : </label>
                  <input id="search" type="text" v-on:keyup="getData()" v-model="search" placeholder="Введите текст" class="input form-control-sm">
                </div>
              </div>
            </div>
            <div class="table-responsive" v-dragscroll>
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th @click="toggleColumn(2);getData()">
                      <div class="table__sort">
                        <span>Студент</span>
                        <div class="table__sort-icons">
                          <fai icon="sort-up" v-bind:class="[sortIcons.fioAsc ? 'text-dark' : 'text-muted']"/>
                          <fai icon="sort-down" v-bind:class="[sortIcons.fioDesc ? 'text-dark' : 'text-muted']"/>
                        </div>
                      </div>
                    </th>
                    <th @click="toggleColumn(3);getData()"> 
                      <div class="table__sort">
                        <span>Телефон</span>
                        <div class="table__sort-icons">
                          <fai icon="sort-up" v-bind:class="[sortIcons.phoneAsc ? 'text-dark' : 'text-muted']"/>
                          <fai icon="sort-down" v-bind:class="[sortIcons.phoneDesc ? 'text-dark' : 'text-muted']"/>
                        </div>
                      </div>
                    </th>
                    <th @click="toggleColumn(4);getData()"> 
                      <div class="table__sort">
                        <span>Email</span>
                        <div class="table__sort-icons">
                          <fai icon="sort-up" v-bind:class="[sortIcons.emailDesc ? 'text-dark' : 'text-muted']"/>
                          <fai icon="sort-down" v-bind:class="[sortIcons.emailAsc ? 'text-dark' : 'text-muted']"/>
                        </div>
                      </div>
                    </th>
                    <th @click="toggleColumn(6);getData()">
                      <div class="table__sort">
                        <span>Тариф</span>
                        <div class="table__sort-icons">
                          <fai icon="sort-up" v-bind:class="[sortIcons.rateNameAsc ? 'text-dark' : 'text-muted']"/>
                          <fai icon="sort-down" v-bind:class="[sortIcons.rateNameDesc ? 'text-dark' : 'text-muted']"/>
                        </div>
                      </div> 
                    </th>
                    <th @click="toggleColumn(5);getData()">
                      <div class="table__sort">
                        <span>Преподаватель</span>
                        <div class="table__sort-icons">
                          <fai icon="sort-up" v-bind:class="[sortIcons.teacherFullNameAsc ? 'text-dark' : 'text-muted']"/>
                          <fai icon="sort-down" v-bind:class="[sortIcons.teacherFullNameDesc ? 'text-dark' : 'text-muted']"/>
                        </div>
                      </div> 
                    </th>
                    <th>Настройки</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in data" :key="index">
                    <td v-if="item.student_id">
                      <router-link :to="{ name:'StudentDetail', params:{id:item.student_id} }" class="table__link">{{item.fio}}</router-link>
                    </td>
                    <td v-else>-</td>
                    <td v-if="item.phone">{{item.phone}}</td>
                    <td v-else>-</td>
                    <td v-if="item.email">{{item.email}}</td>
                    <td v-else>-</td>
                    <td v-if="item.rate_name">{{item.rate_name}}</td>
                    <td v-else>-</td>
                    <td v-if="item.teacher_id">
                      <router-link :to="{ name:'TeacherDetail', params:{id:item.teacher_id} }" class="table__link">
                        {{item.teacher_full_name}}
                      </router-link>
                    </td>
                    <td v-else>-</td>
                    <td  class="table__btn-container">
                      <button class="btn" title="Закрыть stream" v-if="item.stream" @click="closeStudentStream(index)">
                        <fai icon="link"/>
                      </button>
                      <button class="btn" title="Открыть stream" v-else @click="openStudentStream(index)">
                        <fai icon="unlink"/>
                      </button>
                      <button class="btn" title="Разблокировать" v-if="item.blocked" @click="unblockStudent(index)">
                        <fai icon="lock"/>
                      </button>                     
                      <button class="btn" title="Блокировать" v-else  @click="blockStudent(index)">
                        <fai icon="unlock"/>
                      </button>
                      <button class="btn" title="Удалить"  @click="deleteStudent(index)">
                        <fai icon="trash-alt"/>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="row table-footer-btn-block m-0" v-if="pagination">
                <button class="col-12 btn mt-2" @click="getData(true)">Показать еще</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Student',
  data () {
    return {
      data: [],
      timerInterval: '',
      order: true,
      column: 6,
      limit: 25,
      from: 0,
      pagination: false,
      search: '',
      filter: 0,
      sortIcons: {
        fioAsc: false,
        fioDesc: false,
        teacherFullNameAsc: false,
        teacherFullNameDesc: false,
        phoneAsc: false,
        phoneDesc: false,
        emailAsc: false,
        emailDesc: false,
        rateNameAsc: true,
        rateNameDesc: false
      }
    }
  },
  created() {
    this.getData(true);
  },
  methods: {
    toggleColumn: function (column) {
      if (this.column == column) {
        this.order = !this.order;
      } else {
        this.column = column;
      }
      this.sortIconActive();
    },
    getData: function (flag) {
      if (!flag) {
        this.from = 0;
        this.data = [];
        this.$http.post(`/student`, `method=GET-STUDENT-LIST&filter=${this.filter}&column=${this.column}&order=${this.order}&from=${this.from}&limit=${this.limit}&text=${this.search}`)
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            this.from = response.data.students.length;
            if (response.data.students.length < this.limit) this.pagination = false;
            else this.pagination = true;
            this.data = response.data.students;
          } else if (response.status == 204) { this.pagination = false; this.data = []; this.from = 0; }
        })
        .catch(e => {
          console.log(e)
        })
      } else {
        this.$http.post(`/student`, `method=GET-STUDENT-LIST&filter=${this.filter}&column=${this.column}&order=${this.order}&from=${this.from}&limit=${this.limit}&text=${this.search}`)
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            this.from += response.data.students.length;
            if (response.data.students.length < this.limit) this.pagination = false;
            else this.pagination = true;
            this.data = this.data.concat(response.data.students);
          } else if (response.status == 204) { this.pagination = false; }
        })
        .catch(e => {
          console.log(e)
        })
      }
    },
    blockStudent: function (index) {
      let fio = this.data[index].fio;
      this.$swal({
        title: 'Заблокировать аккаунт?',
        type: 'warning',
        text: `Студент ${fio} будет заблокирован!`,
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: 'Заблокировать',
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/student`, `method=BLOCK&block=1&student_id=${this.data[index].student_id}`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.data[index].blocked = 1;
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            text: `Студент ${fio} заблокирован!`,
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
    unblockStudent: function (index) {
      let fio = this.data[index].fio;
      this.$swal({
        title: 'Разблокировать аккаунт?',
        type: 'warning',
        text: `Студент ${fio} будет разблокирован!`,
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: 'Разблокировать',
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/student`, `method=BLOCK&block=0&student_id=${this.data[index].student_id}`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.data[index].blocked = 0;
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            text: `Студент ${fio} разблокирован!`,
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
    openStudentStream: function (index) {
      let fio = this.data[index].fio;
      this.$swal({
        title: 'Открыть стрим?',
        type: 'warning',
        text: `Стрим для студента ${fio} будет открыть!`,
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: 'Открыть',
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/student`, `method=STREAM&stream=1&student_id=${this.data[index].student_id}`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.data[index].stream = 1;
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            text: `Стрим у студента ${fio} открыт!`,
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
    closeStudentStream: function (index) {
      let fio = this.data[index].fio;
      this.$swal({
        title: 'Закрыть стрим?',
        type: 'warning',
        text: `Стрим для студента ${fio} будет закрыт!`,
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: 'Закрыть',
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/student`, `method=STREAM&stream=0&student_id=${this.data[index].student_id}`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.data[index].stream = 0;
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            text: `Стрим у студента ${fio} закрыт!`,
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
    deleteStudent: function (index) {
      let fio = this.data[index].fio;
      this.$swal({
        title: `Удалить студента ${fio}?`,
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
          return this.$http.post(`/student`, `method=DELETE&student_id=${this.data[index].student_id}`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            text: `Студент ${fio} удален(-а)`,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
          this.data.splice(index, 1); 
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
    sortIconActive: function () {
      this.sortIconDisable();
      switch (this.column)
      {
        case 2:  
          if (this.order) this.sortIcons.fioDesc = true;
          else            this.sortIcons.fioAsc = true;
        break;
        case 5:   
          if (this.order) this.sortIcons.teacherFullNameDesc = true;
          else            this.sortIcons.teacherFullNameAsc = true;        
        break;
        case 3:  
          if (this.order) this.sortIcons.phoneDesc = true;
          else            this.sortIcons.phoneAsc = true;        
        break;
        case 4:   
          if (this.order) this.sortIcons.emailDesc = true;
          else            this.sortIcons.emailAsc = true;         
        break;
        case 6:   
          if (this.order) this.sortIcons.rateNameDesc = true;
          else            this.sortIcons.rateNameAsc = true;         
        break;
      }
    },
    sortIconDisable: function () { for (let key in this.sortIcons) { this.sortIcons[key] = false; } }
  }
}
</script>

<style src="@/assets/styles/pages/student.css" scoped></style>

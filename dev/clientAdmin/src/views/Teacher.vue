<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card__header ">
            <h2>Список преподавателей</h2>
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
                  <input id="search" type="text" v-on:keyup="getData();" v-model="search" placeholder="Введите текст" class="input form-control-sm">
                </div>
              </div>
            </div>
            <div class="table-responsive" v-dragscroll>
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th v-for="(col, c) in columns" @click="toggleColumn(c+2);getData()">
                      <div class="table__sort">
                        <span>{{col}}</span> 
                        <div class="table__sort-icons" v-if="c != columns.length - 1">
                          <fai icon="sort-up" v-bind:class="[sortIcons == (c + 2) ? 'text-dark' : 'text-muted']"/>
                          <fai icon="sort-down" v-bind:class="[sortIcons == -(c + 2) ? 'text-dark' : 'text-muted']"/>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in data" :key="index">
                    <td v-if="item.teacher_id">
                      <router-link :to="{ name:'TeacherDetail', params:{id:item.teacher_id} }" class="table__link">{{item.fio}}</router-link>
                    </td>
                    <td v-else>-</td>
                    <td v-if="item.rating">{{item.rating}}</td>
                    <td v-else>-</td>
                    <td v-if="item.phone">{{item.phone}}</td>
                    <td v-else>-</td>
                    <td v-if="item.email">{{item.email}}</td>
                    <td v-else>-</td>
                    <td  class="table__btn-container">
                      <button title="Разблокировать" class="btn" v-if="item.blocked" @click="unblockTeacher(index)">
                        <fai icon="lock"/>
                      </button>                     
                      <button title="Блокировать" class="btn" v-else @click="blockTeacher(index)">
                        <fai icon="unlock"/>
                      </button>
                      <button title="Удалить" class="btn" @click="deleteTeacher(index)">
                        <fai icon="trash-alt"/>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="row table-footer-btn-block m-0" v-if="pagination">
              <button class="col-12 btn mt-2" @click="getData(true)">Показать еще</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Teacher',
  data () {
    return {
      data: [],
      order: false,
      column: 2,
      limit: 25,
      from: 0,
      pagination: false,
      search: '',
      filter: 0,
      columns: ['Преподователь', 'Рейтинг', 'Телефон', 'Почта', 'Настройки'],
      sortIcons: 2
    }
  },
  created() {
    this.getData();
  },
  methods: {
    toggleColumn(column) {
      if (this.column == column) {
        this.order = !this.order;
        this.sortIcons *= -1;
      } else {
        this.column = column;
        this.sortIcons = column;
        this.order = false;
      }
    },
    getData(flag) {
      if (!flag) this.from = 0;
        this.$http.post(`/api`, `method=GET-TEACHERS&filter=${this.filter}&column=${this.column}&order=${this.order}&from=${this.from}&limit=${this.limit}&text=${this.search}`)
        .then(response => {
          if (response.status == 200) {
            if(flag)this.from += response.data.teachers.length;
            else    this.from = response.data.teachers.length;
            if (response.data.teachers.length < this.limit) this.pagination = false;
            else this.pagination = true;
            this.data = flag ? this.data.concat(response.data.teachers) : response.data.teachers;
          } else if (response.status == 204) {
            this.pagination = false;
            if(!flag){
              this.data = [];
              this.from = 0;
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    blockTeacher(index) { 
      let fio = this.data[index].fio;
      this.$swal({
        title: 'Заблокировать аккаунт?',
        type: 'warning',
        text: `Преподаватель ${fio} будет заблокирован!`,
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: 'Заблокировать',
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/api`, `method=BLOCK-USER&&block=1&teacher_id=${this.data[index].teacher_id}`)
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
            text: `Преподаватель ${fio} заблокирован!`,
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
    unblockTeacher(index) {
      let fio = this.data[index].fio;
      this.$swal({
        title: 'Разблокировать аккаунт?',
        type: 'warning',
        text: `Преподаватель ${fio} будет разблокирован!`,
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: 'Разблокировать',
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (r) => {
          return this.$http.post(`/api`, `method=BLOCK-USER&block=0&teacher_id=${this.data[index].teacher_id}`)
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
            text: `Преподаватель ${fio} разблокирован!`,
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
    deleteTeacher(index) {
      let fio = this.data[index].fio;
      this.$swal({
        title: `Удалить преподавателя ${fio}?`,
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
          return this.$http.post(`/api`, `method=DELETE-USER&teacher_id=${this.data[index].teacher_id}`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            text: `Преподователь ${fio} удален(-а)`,
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
  }
}

</script>

<style src="@/assets/styles/pages/teacher.css" scoped></style>
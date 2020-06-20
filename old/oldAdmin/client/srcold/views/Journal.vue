<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card__header ">
            <h2>Журнал</h2>
            <ul class="card__action">
              <li>
                <p><fai icon="expand-arrows-alt"/></p>
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
                  <label for="select_all">Показывать журнал : </label>
                  <select id="select_all" v-model="filter" class="select form-control-sm" @change="getData();">
                    <option :value="0">Все</option>
                    <option :value="1">Студента</option>
                    <option :value="2">Преподователя</option>
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
                    <th>Сообщения</th>
                    <th>Пользователь</th>
                    <th @click="eventOrder(); getData();">
                      <div class="table__sort">
                        <span>Дата</span>
                        <div class="table__sort-icons">
                          <fai icon="sort-up" v-bind:class="[order ? 'text-dark' : 'text-muted']"/>
                          <fai icon="sort-down" v-bind:class="[order ? 'text-muted' : 'text-dark']"/>
                        </div>
                      </div>
                    </th>
                    <th>Настройки</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in data" :key="index">
                    <td class="journal-message" v-if="item.act">{{item.act}}</td>
                    <td v-else>-</td>
                    <td v-if="item.isteacher == 1">Преподаватель</td>
                    <td v-else>Студент</td>
                    <td v-if="item.dt">{{item.dt}}</td>
                    <td v-else>-</td>
                    <td class="table__btn-container">
                      <button class="btn" title="Удалить" @click="removeElementInData(index)">
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
  name: 'Journal',
  data () {
    return {
      data: [],
      pagination: false,
      order: 0,
      limit: 25,
      id: 0,
      filter: 0,
      search: ''
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData: function (flag) {
      if (!flag) {
        this.id = 0;
        this.$http.post(`/register`, `method=READ&filter=${this.filter}&limit=${this.limit}&id=${this.id}&order=${this.order}&text=${this.search}`)
        .then(response => {
          if (response.status == 200) {
            if (response.data.data.length < this.limit) this.pagination = false;
            else this.pagination = true;
            if (this.order) this.id = this.getMaxId(response.data.data);
            else this.id = this.getMinId(response.data.data);
            this.data = response.data.data;
          } else if (response.status == 204) {
            this.pagination = false;
            this.data = [];
          }
        })
        .catch(e => {
          console.log(e)
        })
      } else {
        this.$http.post(`/register`, `method=READ&filter=${this.filter}&limit=${this.limit}&id=${this.id}&order=${this.order}&text=${this.search}`)
        .then(response => {
          if (response.status == 200) {
            if (response.data.data.length < this.limit) this.pagination = false;
            else this.pagination = true;
            if (this.order) this.id = this.getMaxId(response.data.data);
            else this.id = this.getMinId(response.data.data);
            this.data = this.data.concat(response.data.data);
          } 
        })
        .catch(e => {
          console.log(e)
        })
      }
    },
    // searchData: function () {
    //   if (this.search.trim().length>0) {
    //     this.$http.post(`/register`, `method=SEARCH&text=${this.search}`)
    //     .then(response => {
    //       if (response.status == 200) {
    //         this.pagination = false;
    //         this.data = response.data.data;
    //       } else {
    //         this.data = [];
    //       } 
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     })
    //   } else {
    //     this.getData();
    //   }
    // },
    removeElementInData: function (index) {
      this.$swal({
        title: `Удалить?`,
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
          return this.$http.post(`/register`, `method=DELETE&id=${this.data[index].id}`)
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
    eventOrder: function () {
      if (this.order) {
        this.order = 0;
      } else {
        this.order = 1;
      }
    },
    getMinId: function (array) {
      return array.reduce((min, p) => p.id < min ? p.id : min, array[0].id);
    },
    getMaxId: function (array) {
      return array.reduce((max, p) => p.id > max ? p.id : max, array[0].id);
    }
  }
}
</script>

<style src="@/assets/styles/pages/journal.css" scoped></style>
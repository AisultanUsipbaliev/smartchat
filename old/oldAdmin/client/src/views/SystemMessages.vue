<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card__header ">
            <h2>Системные сообщения</h2>
            <ul class="card__action">
              <li>
                <a href="#;"><fai icon="expand-arrows-alt"/></a>
              </li>
            </ul>
          </div>
          <div class="card__body">
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Сообщения</th>
                    <th>Коммент</th>
                    <th>Настройки</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in messages" :key="index">
										<td class="white-space-normal" v-if="!item.editing">{{item.message?item.message:'-'}}</td>
										<td class="white-space-normal" v-else>
											<textarea-autosize class="input" v-model="item.temp_message"></textarea-autosize>
										</td>
										<td class="white-space-normal" v-if="!item.editing">{{item.comment?item.comment:'-'}}</td>
										<td class="white-space-normal" v-else>
											<textarea-autosize class="input" v-model="item.temp_comment"></textarea-autosize>
										</td>
										<td class="table__btn-container">
						          <button v-if="!item.editing" title="Изменить" @click="editMes(index)" class="btn">
                        <fai icon="pencil-alt"/>
                      </button>
                      <button v-if="item.editing" title="Отменить" @click="disableMes(index)" class="btn" :disabled="item.loading">
                        <fai v-if="!item.loading" icon="times"/>
                        <fai v-else icon="spinner" class="mr-2" pulse/>
                      </button>
                      <button v-if="item.editing" title="Сохранить" @click="updateMes(index)" class="btn" :disabled="item.loading">
                        <fai v-if="!item.loading" icon="save"/>
                        <fai v-else icon="spinner" class="mr-2" pulse/>
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
</template>

<script>
export default {
  name: 'Student',
  data () {
    return {
      messages: []
    }
  },
  created() {
    this.getMessages();
  },
  methods: {
    getMessages: function (flag) {
      this.$http.post(`/system_messages`, `method=GET-SYSTEM-MESSAGES`)
      .then(async (response) => {
        console.log('messages',response.data)
        if (response.data.status == 200) {
	        let data = response.data.messages;
	        for (let i = 0; i < data.length; i++) {
	        	data[i].editing = false;
	        	data[i].loading = false;
	        	data[i].temp_message = '';
	        	data[i].temp_comment = '';
	        }
          this.messages = data;
        } else { 
        	throw new Error(response.statusText); 
        }
      })
      .catch(e => { console.log(e) })
    },
    editMes: function (index) {
    	this.messages[index].editing = true;
    	this.messages[index].temp_message = this.messages[index].message;
    	this.messages[index].temp_comment = this.messages[index].comment;
    },
    disableMes: function (index) {
    	this.messages[index].editing = false;
    	this.messages[index].temp_message = '';
    	this.messages[index].temp_comment = '';
    },
    updateMes: function (index) {
    	this.messages[index].loading = true;
    	this.$http.post(`/system_messages`, `method=UPDATE-SYSTEM-MESSAGE&id=${this.messages[index].id}&message=${this.messages[index].temp_message}&comment=${this.messages[index].temp_comment}`)
      .then(async (response) => {
      	this.messages[index].loading = false;
        if (response.data.status == 200) {
        	this.messages[index].message = this.messages[index].temp_message;
    			this.messages[index].comment = this.messages[index].temp_comment;
    			this.disableMes(index);
	        this.$swal({
            type: 'success',
            title: 'Успешно!',
            text: `Сообщения изменено!`,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
        } else { 
        	throw new Error(response.statusText); 
        }
      })
      .catch(e => { 
      	this.messages[index].loading = false;
      	console.log(e);
      	this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${error}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })
    }
  }
}
</script>

<!-- <style src="@/assets/styles/pages/student.css" scoped></style> -->

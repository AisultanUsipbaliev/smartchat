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
                    <th>Коммент</th>
                    <th>Сообщения</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in messages" :key="index">
                    <td class="white-space-normal">{{item.comment ? item.comment : '-'}}</td>
										<td class="white-space-normal">
											<textarea-autosize class="input" v-model="item.message" ref="item"></textarea-autosize>
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
      messages: [],
    }
  },
  created() {
    this.getMessages();
    setTimeout(()=>{
      for( let i = 0; i < this.$refs['item'].length; i++){
        let el = this.$refs['item'][i].$el;
        el.addEventListener('focusout', (e)=>{
          this.updateMes(i)
        })
      }
    }, 100)
  },
  methods: {
    checkToUpdate(e){
      console.log(132)
    },
    getMessages(flag) {
      this.$http.post(`/api`, `method=GET-MESSAGES`)
      .then(async (response) => {
        if (response.data.status == 200) {
	        let data = response.data.messages;
	        for (let i = 0; i < data.length; i++) {
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
    updateMes(index) {
    	this.$http.post(`/api`, `method=UPDATE-MESSAGES&id=${this.messages[index].id}&message=${this.messages[index].message}`)
      .then(async (response) => {
        if (response.data.status == 200) {
	        this.$swal({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            type: 'success',
            title: 'Сообщение изменено!'
          });
        } else { 
        	throw new Error(response.statusText); 
        }
      })
      .catch(e => { 
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

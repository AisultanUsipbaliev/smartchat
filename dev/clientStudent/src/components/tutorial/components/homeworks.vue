<template>
    <transition name="fade">
        <div class="content" v-if="block_id == 32">
            <p class="page_title">ЗАДАНИЯ</p>
            <div class="block_homeworks" :class="{'zix': block_id == 32}">
                <div class="head_homework">
                    <div>Курс</div>
                    <div>Статус</div>
                    <div>Дата</div>
                    <div>Оценка</div>
                    <div>Действия</div>
                </div>
                <div class="body_homework">
                    <div class="homework_row">
                        <div class="homework_row_unit">Пробное занятие</div>
                        <div class="homework_row_unit"><span class="green">Выполнено</span></div>
                        <div class="homework_row_unit">5.10.2018</div>
                        <div class="homework_row_unit"><p class="bals">5</p></div>
                        <div class="homework_row_unit"><a class="result_show">Просмотр</a></div>
                    </div>
                    <div class="homework_row">
                        <div class="homework_row_unit">Пробное занятие</div>
                        <div class="homework_row_unit"><span class="red">Не выполнено</span></div>
                        <div class="homework_row_unit">8.10.2018</div>
                        <div class="homework_row_unit"><p class="bals">-</p></div>
                        <div class="homework_row_unit"><a class="result_show" @click="plusId()">Выполнить</a></div>
                    </div>
                    <div class="homework_row">
                        <div class="homework_row_unit">Пробное занятие</div>
                        <div class="homework_row_unit"><span class="green">Выполнено</span></div>
                        <div class="homework_row_unit">10.10.2018</div>
                        <div class="homework_row_unit"><p class="bals">5</p></div>
                        <div class="homework_row_unit"><a class="result_show">Просмотр</a></div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'homework',
    data () {
        return {
            
        }
    },
    methods:{
        plusId() {
            this.$emit('plusId')    
        }
    },
    props: ['block_id']
}
</script>
<style scoped>
  @import url(../../../assets/tutorial_styles/homework.css);
</style>
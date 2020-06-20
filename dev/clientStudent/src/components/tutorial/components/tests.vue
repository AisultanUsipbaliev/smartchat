<template>
	<transition name="fade">
        <div class="content" v-if="block_id == 30 || block_id == 31">
            <p class="page_title">ТЕСТЫ</p>
            <div class="block_tests" :class="{'zix':block_id == 30}">
                <div class="head_tests">
                    <div>Тест</div>
                    <div>Статус</div>
                    <div>Дата</div>
                    <div>Результат</div>
                    <div>Действие</div>
                </div>
                <div class="body_tests">
                    <div class="test_row">
                        <div class="test_row_unit">Unit 1. Как правильно задавать вопросы </div>
                        <div class="test_row_unit"><span class="green">Выполнено</span></div>
                        <div class="test_row_unit">5.10.2018</div>
                        <div class="test_row_unit">70%</div>
                        <div class="test_row_unit"><a class="result_show">Просмотр</a></div>
                    </div>
                    <div class="test_row">
                        <div class="test_row_unit">Unit 2. Как правильно задавать вопросы </div>
                        <div class="test_row_unit"><span class="red">Не выполнено</span></div>
                        <div class="test_row_unit">5.10.2018</div>
                        <div class="test_row_unit">0%</div>
                        <div class="test_row_unit"><a class="result_show">Выполнить</a></div>
                    </div>
                    <div class="test_row">
                        <div class="test_row_unit">Unit 3. Как правильно задавать вопросы </div>
                        <div class="test_row_unit"><span class="green">Выполнено</span></div>
                        <div class="test_row_unit">5.10.2018</div>
                        <div class="test_row_unit">70%</div>
                        <div class="test_row_unit"><a class="result_show">Просмотр</a></div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
	name: 'tests',
	data () {
		return {
			
		}
	},
	props: ['block_id']
}
</script>
<style scoped>
  @import url(../../../assets/tutorial_styles/tests.css);
</style>
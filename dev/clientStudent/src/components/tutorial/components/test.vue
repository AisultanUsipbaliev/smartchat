<template>
	<transition name="fade">
        <div class="contentTest" v-if="block_id >= 25 && block_id <= 29">
            <p class="page_title">ТЕСТЫ</p>
            <div class="block_test">
                <div class="all_tests" :class="{'zix':block_id >= 27 && block_id <= 28}">
                    <div class="all_tests_head">
                        <p class="all_tests_title">Тесты</p>
                    </div>
                    <div class="all_tests_body">
                        <p class="test_name">Unit 1. Как правильно задавать вопросы </p>
                        <p class="test_name">Unit 2. Как правильно задавать вопросы </p>
                    </div>
                </div>

                <div class="test_content" :class="{'zix':block_id >= 25 && block_id <= 26}">
                    <div class="test_name_head">
                        <p class="answer_name">Unit 1. Как правильно задавать вопросы</p>
                    </div>
                    <div class="test_check_body">
                        <div class="answer_block">
                            <p class="question_number">Question 1</p>
                            <p class="question">What will you do this afternoon?</p>
                            <div class="question_row" :class="{'right_answer':block_id==26, 'noInput':block_id==26}"><input type="radio" ref="ftt" name="first_1" id="first_1"><label for="first_1">I'll play soccer.</label></div>
                            <div class="question_row"><input type="radio" ref="ftt" name="first_1" id="first_2"><label for="first_2">I was playing soccer.</label></div>
                            <div class="question_row"><input type="radio" ref="ftt" name="first_1" id="first_3"><label for="first_3">I play soccer.</label></div>
                            <div class="question_row"><input type="radio" ref="ftt" name="first_1" id="first_4"><label for="first_4">I played soccer.</label></div>
                        </div>
                        <div class="answer_block">
                            <p class="question_number">How high is Mt. Fuji?</p>
                            <p class="question">How long have you been playing the trumpet?</p>
                            <div class="question_row"><input type="radio" ref="stt" name="second_1" id="second_1"><label for="second_1">For four years.</label></div>
                            <div class="question_row" :class="{'right_answer':block_id==26}"><input type="radio" ref="stt" name="second_1" id="second_2"><label for="second_2">By myself.</label></div>
                            <div class="question_row"><input type="radio" ref="stt" name="second_1" id="second_3"><label for="second_3">In my room.</label></div>
                            <div class="question_row"><input type="radio" ref="stt" name="second_1" id="second_4"><label for="second_4">About 50 cm.</label></div>
                        </div>
                        <div class="answer_block">
                            <p class="question_number">Question 3</p>
                            <p class="question"> Did you ski last weekend?</p>
                            <div class="question_row" :class="{'wt_answer':block_id==26}"><input type="radio" ref="ttt" name="third_1" id="third_1"><label for="third_1">Yes, I skied on Sunday.</label></div>
                            <div class="question_row"><input type="radio" ref="ttt" name="third_1" id="third_2"><label for="third_2">Yes, I played on Saturday.</label></div>
                            <div class="question_row" :class="{'wrong_answer':block_id==26}"><input type="radio" ref="ttt" name="third_1" id="third_3"><label for="third_3">Yes, I played on Wednesday.</label></div>
                            <div class="question_row"><input type="radio" ref="ttt" name="third_1" id="third_4"><label for="third_4">Yes, I skied on Tuesday.</label></div>
                        </div>
                    </div>
                    <div class="footer_check_test">
                        <button class="answer_send" @click="plusId()" v-if="block_id < 26">Сдать ответы</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
	name: 'test',
	data () {
		return {
			
		}
	},
	props: ['block_id']
}
</script>
<style scoped>
  @import url(../../../assets/tutorial_styles/test.css);
</style>
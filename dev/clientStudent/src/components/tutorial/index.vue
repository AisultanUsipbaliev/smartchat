<template>
    <div>
    <profile    :block_id="block_id"></profile>
    <settings   :block_id="block_id" @plusId="plusId"></settings>     
    <courses    :block_id="block_id" @plusId="plusId"  @minusId="minusId"></courses>     
    <schedule   :block_id="block_id"></schedule>     
    <chat       :block_id="block_id" @plusId="plusId"  @minusId="minusId"></chat>     
    <test       :block_id="block_id"></test>     
    <tests      :block_id="block_id"></tests>     
    <homework   :block_id="block_id"></homework>     
    <homeworks  :block_id="block_id" @plusId="plusId"></homeworks>     
    <feedback   :block_id="block_id"></feedback>     
    <headr      :block_id="block_id" :menu_header="menu_header" @plusId="plusId"></headr> 

    <!-- tutorial -->
    <div class="tutorial" v-show="tutorial_body" :class="{'z9':skiping == true}">
        <transition name="lost">
            <div class="skip_t" v-show="skiping">
                <h2>Вы уверены что хотите пропустить обучение?</h2>
                <p>Вы можете продолжить с того места где пропустили.</p>
                <div class="btns">
                    <button @click="skiping = false, tutorial_body = false">Пропустить</button>
                    <button @click="skiping = false">Отмена</button>
                </div>
            </div>
        </transition>
    </div>
        <span class="skip" @click="skiping = true">Пропустить</span>
        <img src="../../../static/tutorial/images/arrow_down_white.png" :class="arrow_side">
        <img src="../../../static/tutorial/images/arrowblue.png" :class="arrow_blue">

        <transition name="fade">
            <div v-show="tutorial_body">
                <img src="../../../static/tutorial/images/smarti.png" class="smarti" :class="smarti">
                <div class="text_block" :class="text_block">
                    <img src="../../../static/tutorial/images/tale.png" class="tale" :class="tale">
                    <span class="text_content">{{text_content}}</span>
                    <div class="buttons_block">
                        <span class="next_prev" @click="minusId" :class="{'disb':block_id == 1}">Пред.</span>
                        <span>{{block_id}}/{{all_id}}</span>
                        <span class="next_prev" @click="plusId()" :class="{'disb':next_btn == false}">След.</span>
                    </div>

                </div>
            </div>
        </transition>
    
    </div>
</template>

<script>

import Profile      from     './components/profile'
import Headr        from     './components/headr'
import Settings     from     './components/settings'
import Courses      from     './components/courses'
import Schedule     from     './components/schedule'
import Chat         from     './components/chat'
import Test         from     './components/test'
import Tests        from     './components/tests'
import Homework     from     './components/homework'
import Homeworks    from     './components/homeworks'
import Feedback     from     './components/feedback'
import strings      from     './strings.js'

export default {
  name: 'Tutorial',
  data () {
    return {
        tutorial_body: true, skiping: false,
        block_id: 1, all_id: 36, 
        arrow_side: '', arrow_blue: '',
        menu_header: false, 
        next_btn: true,
        text_content: '', 
        tale: '', smarti: '', text_block: '',
        seconds: 0, minute: 0, interval: '', intSeconds: 0, intMinute: 0,
        standart_pass: false, record: false,
        global_date: new Date(),
        charts: {},
        myMessage: '',

        slides: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
        index: 0
        }
    },
    created(){
        this.index = this.$router.history.current.query.id? this.$router.history.current.query.id: 0
        this.block_id = this.slides[this.index]
    },
    watch: {
        index(val) {
            this.block_id = this.slides[val]
            this.chooseSlide()
        }
    },
    components: {
        Profile, 
        Headr,
        Settings,
        Courses,
        Schedule,
        Chat,
        Test,
        Tests,
        Homework,
        Homeworks,
        Feedback
    },
    methods:{
      	chooseSlide(){        
            this.arrow_side = "disb";
            this.arrow_blue = "disb";
            this.next_btn = true;
            this.menu_header = false;

            this.text_content = strings[this.block_id - 1]

            if(this.block_id == 1){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.tale = 'profile_tale';
            }
            else if(this.block_id == 2){
                this.text_block = 'faq_text';
                this.smarti = 'faq_smarti';
                this.tale = 'faq_tale';
            }
            else if(this.block_id == 3){
                this.text_block = 'header_text';
                this.smarti = 'header_smarti';
                this.tale = 'header_tale';
                this.next_btn = false;
            }
            else if(this.block_id == 4){
                this.menu_header = true;
                this.text_block = 'header_text';
                this.next_btn = false;
                this.smarti = 'header_smarti';
                this.tale = 'header_tale';
            }
            else if(this.block_id == 5){
                this.menu_header = false; 
                this.text_block = 'settings_text';
                this.smarti = 'settings_smarti';
                this.tale = 'settings_tale';
            }
            else if(this.block_id == 6){
                this.next_btn = false;
                this.text_block = 'settings_text';
                this.smarti = 'settings_smarti';
                this.tale = 'settings_tale';
            }
            else if(this.block_id == 7){
                this.text_block = 'settings_text';
                this.smarti = 'settings_smarti';
                this.next_btn = false;
                this.tale = 'settings_tale';
                this.arrow_side = "disb";
            }
            else if(this.block_id == 8){
                this.text_block = 'sidebar_text';
                this.smarti = 'sidebar_smarti';
                this.tale = 'sidebar_tale';
                this.arrow_side = "arrow_profile";
            }
            else if(this.block_id == 9){
                this.text_block = 'sidebar_text';
                this.smarti = 'sidebar_smarti';
                this.tale = 'sidebar_tale';
                this.next_btn = false;
                this.arrow_side = "arrow_courses";
            }
            else if(this.block_id == 10){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.next_btn = false;
                this.tale = 'profile_tale'; 
            }
            else if(this.block_id == 11){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.next_btn = false;
                this.tale = 'profile_tale'; 
            }
            else if(this.block_id == 12){
                this.text_block = 'time_text';
                this.smarti = 'time_smarti';
                this.next_btn = false;
                this.tale = 'time_tale'; 
            }
            else if(this.block_id == 13){
                this.text_block = 'time_text';
                this.smarti = 'time_smarti';
                this.next_btn = false;
                this.tale = 'time_tale'; 
            }
            else if(this.block_id == 14){ 
                this.text_block = 'time_text';
                this.next_btn = false;
                this.smarti = 'time_smarti';
                this.tale = 'time_tale';
            }
            else if(this.block_id == 15){
                this.text_block = 'time_text';
                this.smarti = 'time_smarti';
                this.tale = 'time_tale'; 
            }
            else if(this.block_id == 16){
                this.text_block = 'time_text';
                this.smarti = 'time_smarti';
                this.tale = 'time_tale'; 
                this.next_btn = false;
                this.arrow_side = "arrow_schedule";
            }
            else if(this.block_id == 17){
                this.text_block = 'time_text';
                this.smarti = 'time_smarti';
                this.tale = 'time_tale'; 
            }
            else if(this.block_id == 18){
                this.text_block = 'time_text';
                this.next_btn = false;
                this.smarti = 'time_smarti';
                this.tale = 'time_tale';
                this.arrow_side = "arrow_chat";
            }
            else if(this.block_id == 19){
                this.next_btn = false; 
                this.text_block = 'chat_text';
                this.smarti = 'chat_smarti';
                this.tale = 'chat_tale';
            }
            else if(this.block_id == 20){
                this.text_block = 'chat1_text';
                this.smarti = 'chat1_smarti';
                this.tale = 'chat1_tale';
                this.next_btn = false;
            }
            else if(this.block_id == 21){
                this.text_block = 'chat1_text';
                this.smarti = 'chat1_smarti';
                this.tale = 'chat1_tale';
                this.next_btn = false;
            }
            else if(this.block_id == 22){
                this.text_block = 'chat1_text';
                this.smarti = 'chat1_smarti';
                this.tale = 'chat1_tale';
            }
            else if(this.block_id == 23){
                this.text_block = 'chat1_text';
                this.smarti = 'chat1_smarti';
                this.tale = 'chat1_tale';
                this.arrow_blue = 'arrowSearch';
            }
            else if(this.block_id == 24){
                this.text_block = 'chat1_text';
                this.smarti = 'chat1_smarti';
                this.next_btn = false;
                this.tale = 'chat1_tale';
            }
            else if(this.block_id == 25){
                this.text_block = 'settings_text';
                this.smarti = 'settings_smarti';
                this.next_btn = false;
                this.tale = 'settings_tale';
            }
            else if(this.block_id == 26){
                this.text_block = 'settings_text';
                this.smarti = 'settings_smarti';
                this.tale = 'settings_tale';
            }
            else if(this.block_id == 27){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.tale = 'profile_tale';
            }
            else if(this.block_id == 28){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.tale = 'profile_tale';
            }
            else if(this.block_id == 29){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.tale = 'profile_tale';
                this.next_btn = false;
                this.arrow_side = "arrow_test";
            }
            else if(this.block_id == 30){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.tale = 'profile_tale';
            }
            else if(this.block_id == 31){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.tale = 'profile_tale';
                this.next_btn = false;
                this.arrow_side = "arrow_home";
            }
            else if(this.block_id == 32){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.next_btn = false;
                this.tale = 'profile_tale';
                this.arrow_blue = "arrow_hw";
            }
            else if(this.block_id == 33){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.tale = 'profile_tale';
            }
            else if(this.block_id == 34){
                this.text_block = 'profile_text';
                this.smarti = 'profile_smarti';
                this.tale = 'profile_tale';
                this.next_btn = false;
                this.arrow_side = "arrow_feed";
            }
            else if(this.block_id == 35){
                this.text_block = 'faq_text';
                this.smarti = 'faq_smarti';
                this.tale = 'faq_tale';
            }
            else if(this.block_id == 36){
                this.text_block = 'faq_text';
                this.smarti = 'faq_smarti';
                this.next_btn = false;
                this.tale = 'faq_tale';
            }
        },
        minusId(){
            this.index--;
            this.chooseSlide();
        },
        plusId(){
            this.index++;
            this.chooseSlide();
        }
    },
    mounted(){
        this.chooseSlide();
        this.plusId();
        this.minusId();
    }, 
    props: [this.next_btn]
}
</script>
<style type="text/css">
  @import url(../../assets/tutorial_styles/tutorial.css);
</style>
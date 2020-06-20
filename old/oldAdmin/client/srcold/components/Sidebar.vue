<template>
  <aside class="app-sidebar">
    <ul class="app-menu" id ='nav_menu'>
      <li class="treeview" v-bind:class="[treeview ? 'is-expanded' : '']">
        <span  @click="isExpanded()" class="app-menu__item" data-toggle="treeview" >
          <fai icon="chalkboard-teacher" class="app-menu__icon"/> 
          <span class="app-menu__label">Преподаватели</span>
          <fai icon="angle-right" class="treeview-indicator"/>
        </span>
        <ul class="treeview-menu">
          <li>
            <router-link to="/teacher" active-class="active" class="app-menu__item treeview-item">
              <fai icon="circle-notch" class="icon"/> 
              Список преподавателей
            </router-link>
          </li>
          <li>
            <router-link to="/monitoring" active-class="active" class="app-menu__item treeview-item">
              <fai icon="circle-notch" class="icon"/> 
              Мониторинг
            </router-link>
          </li>
        </ul>
      </li>
<!--       <li @click="treeview = false;">
          <router-link to="/rate" class="app-menu__item">
              <fai icon="newspaper" class="app-menu__icon"/>
              <span class="app-menu__label">Тарифы</span>
          </router-link>
      </li> -->
      <li @click="treeview = false;">
          <router-link to="/billing" class="app-menu__item">
              <fai icon="credit-card" class="app-menu__icon"/>
              <span class="app-menu__label">Биллинг</span>
          </router-link>
      </li>
<!--      <li @click="treeview = false;">
          <router-link to="/feedback" class="app-menu__item">
              <fai icon="comments" class="app-menu__icon"/>
              <span class="app-menu__label">Отзывы</span>
          </router-link>
      </li>
      <li @click="treeview = false;">
          <router-link to="/report" class="app-menu__item">
              <fai icon="file-alt" class="app-menu__icon"/>
              <span class="app-menu__label">Отчеты</span>
          </router-link>
      </li> -->
      <li @click="treeview = false;">
        <router-link to="/student" class="app-menu__item" active-class="active">
          <fai icon="graduation-cap" class="app-menu__icon"/> 
          <span class="app-menu__label">Студенты</span>
        </router-link>
      </li>
<!--       <li @click="treeview = false;">
        <router-link to="/teacher" class="app-menu__item" active-class="active">
          <fai icon="chalkboard-teacher" class="app-menu__icon"/> 
          <span class="app-menu__label">Преподаватели</span>
        </router-link>
      </li> -->
      <li @click="treeview = false;">
        <router-link to="/journal" class="app-menu__item" active-class="active">
          <fai icon="paste" class="app-menu__icon"/>
          <span class="app-menu__label">Журнал</span>
        </router-link>
      </li>
      <li @click="treeview = false;">
          <router-link to="/setting" class="app-menu__item">
              <fai icon="sliders-h" class="app-menu__icon"/>
              <span class="app-menu__label">Настройки</span>
          </router-link>
      </li>
    </ul>
  </aside>
</template>
 
<script>
export default {
  name: 'sidebar',
  data () {
      return {
        treeview: false
      }
  },
  methods: {
    isExpanded: function (e) {
      this.treeview = !this.treeview;
    }
  }
}
</script>

<style src="@/assets/styles/components/treeview.css" scoped></style>




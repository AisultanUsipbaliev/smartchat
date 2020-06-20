<template>
	<div>	
		<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
			<div class="infoLine">
				<div class="rechanges" v-if="!search_block">
					<router-link to="/students" class="changes"><fai v-if="$mq.phone" icon="user"/><span v-if="!$mq.phone">Студенты</span></router-link>
					<router-link to="/groups" class="changes"><fai v-if="$mq.phone" icon="users"/><span v-if="!$mq.phone">Группы</span></router-link>
				</div>
				<div class="searches" v-if="!search_block">
					<input type="text" class="search_input" placeholder="Поиск" v-if="!$mq.phone">
					<img src="/static/img/zalupa.png" v-if="$mq.phone" @click="search_block = true" class="sort">
					<img src="/static/img/sort.png" class="sort" >
				</div>
				<div class="search_block_st" v-if="search_block">
					<input type="text" class="search_input_st" placeholder="Поиск">
					<img src="/static/img/x.png" class="close_st_input" @click="search_block = false">
				</div>
			</div>
			<div class="groups_list_block">
				<div class="group">
					<div class="group_info">
						<p class="gr_name_and_type">
							<span class="gr_name">Хуйня а не группа</span>
							<span class="gr_tarif">English mix</span>
						</p>
						<p class="gr_level">Intermediate</p>
						<p class="gr_count_lessons">Осталось занятии: 5</p>
					</div>
					<div class="group_st_list">
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
					</div>
					<p class="see_all_st">Открыть список студентов</p>
				</div>
						
				<div class="group">
					<div class="group_info">
						<p class="gr_name_and_type">
							<span class="gr_name">Хуйня а не группа</span>
							<span class="gr_tarif">English mix</span>
						</p>
						<p class="gr_level">Intermediate</p>
						<p class="gr_count_lessons">Осталось занятии: 5</p>
					</div>
					<div class="group_st_list">
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
					</div>
					<p class="see_all_st">Открыть список студентов</p>
				</div>

				<div class="group">
					<div class="group_info">
						<p class="gr_name_and_type">
							<span class="gr_name">Хуйня а не группа</span>
							<span class="gr_tarif">English mix</span>
						</p>
						<p class="gr_level">Intermediate</p>
						<p class="gr_count_lessons">Осталось занятии: 5</p>
					</div>
					<div class="group_st_list">
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
						<div class="student_in_grbl">
							<img src="/static/img/starnight.jpg" class="gr_photo">
							<p class="name_student_gr">Асылжан Мухтаров</p>
						</div>
					</div>
					<p class="see_all_st">Открыть список студентов</p>
				</div>					
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Groups',
	data () {
		return {
			msg: 'groups'
		}
	}
}
</script>
<style>
	@import url(../../assets/css/groups.css);
</style>
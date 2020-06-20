let SQL = require('../apiFunctions/query')

// check data
	exports.acceptToRequest = async function(id) {
		return (await SQL('select group_id from student where student_id = ?', [id]))[0].group_id
	}

// select 
	exports.getProfile = async (id) => {
		return (await SQL(`select student_id, firstname, lastname, phone, ava, birthday, email, activated, score,
			lvl.lvl_name, group_id, smsOn, mailOn, lastVisit, blocked, stream, is_active, regDate
			from student
			join lvl on lvl.lvl_id = student.lvl 
			where student_id = ?`, [id]))[0]
	}
	exports.getFilteredStudentList = async (filter, column, order, from, limit, text) => {
		return await SQL(`	select s.student_id, concat(s.firstname, ' ', s.lastname) as fio, s.phone, s.email, concat(t.login, ' ', t.lastname) as teacher_full_name, r.rate_name,  s.blocked, s.stream, t.teacher_id from student s
							left join gr g on g.group_id = s.group_id
							left join teacher t on t.teacher_id = g.teacher_id
							left join rate r on r.rate_id = g.rate_id
							where s.blocked = ? 
							and (
								concat(t.login, ' ', t.lastname) like concat('%', ? ,'%') 
								or concat(s.firstname, ' ', s.lastname) like concat('%', ? ,'%')
								or s.email like concat('%', ? ,'%')
								or s.phone like concat('%', ? ,'%')
								or r.rate_name like concat('%', ? ,'%')
							)
							order by ? ${order} limit ?, ?`, [filter,text,text,text,text,text,column,from,limit]);
	}
	exports.getStudentList = async (column, order, from, limit, text) => {
		return await SQL(`	select s.student_id, concat(s.firstname, ' ', s.lastname) as fio, s.phone, s.email, concat(t.login, ' ', t.lastname) as teacher_full_name, r.rate_name,  s.blocked, s.stream, t.teacher_id from student s
							left join gr g on g.group_id = s.group_id
							left join teacher t on t.teacher_id = g.teacher_id
							left join rate r on r.rate_id = g.rate_id
							where (
								concat(t.login, ' ', t.lastname) like concat('%', ? ,'%') 
								or concat(s.firstname, ' ', s.lastname) like concat('%', ? ,'%')
								or s.email like concat('%', ? ,'%')
								or s.phone like concat('%', ? ,'%')
								or r.rate_name like concat('%', ? ,'%')
							)
							order by ? ${order} limit ?, ?`, [text,text,text,text,text,column,from,limit]);
	}
	exports.getUnblockedAndNoGroupStudents = async () => {
		return await SQL(`select s.student_id, concat(s.firstname, ' ', s.lastname) as fio 
											from student s
											where s.blocked = 0 
											and group_id = 0`);
	}
	exports.getChartInfo = async (student_id) => {
		return (await SQL(` select g.group_id, g.group_name, min(c.start) as start
							from student s 
							left join gr g on g.group_id = s.group_id
							left join chart c on c.group_id = s.group_id
							where s.student_id = ?;`, [student_id]))[0];
	}
	exports.getStudent = async function(id) {
		return (await SQL('select * from student where student_id = ?', [id]))[0]
	}
	exports.check = async (phone, pass) => {
		return (await SQL('select * from student where phone = ? and pass = ?', [phone, pass]))[0]
	}
	exports.findPhone = async function(phone) {
		return (await SQL('select * from student where phone = ?', [phone]))[0]
	}
	exports.findGuide = async function(guide) {
		return (await SQL('select * from student where guide = ?', [guide]))[0]
	}
	exports.findSocial = async function(socialId, socialType, socialToken) {
		return (await SQL('select * from student where socialType = ? and socialId = ? and socialToken = ?', 
			[socialType, socialId, socialToken]))[0]
	}
	exports.findSocial2 = async function(socialId, socialType) {
		return (await SQL('select * from student where socialType = ? and socialId = ?', 
			[socialType, socialId]))[0]
	}
	exports.findGroup = async function(group) {
		return await SQL('select * from student where group_id = ?', [group])
	}
	exports.findAva = async function(ava) {
		return await SQL('select * from student where ava = ? ', [ava])
	}
	exports.getStudentGroup = async function(id) {
		return (await SQL('select g.group_id, g.teacher_id, g.group_name, g.started, g.group_type, g.rate_id from student s join gr g on s.group_id = g.group_id where s.student_id = ?', [id]))[0]
	}
	exports.getStudentLevel = async function(id) {
		return (await SQL('select l.lvl_id id, l.lvl_name name from student s join lvl l on l.lvl_id = s.lvl where s.student_id = ?', [id]))[0]
	}
	exports.getStudentRate = async function(id) {
		return (await SQL(`select r.rate_id id, r.rate_name name, r.rate_title, r.rate_cost cost, r.lessons, r.group_type, r.rate_content, r.sale, r.oldCost, r.active
					from student s 
					join gr g on g.group_id = s.group_id
					join rate r on r.rate_id = g.rate_id
					where s.student_id = ?`, [id]))[0]
	}
	exports.getTeacherStudent = async (teacherId, id) => {
		return (await SQL(`select s.student_id, s.firstname, s.lastname, s.phone, s.email, s.ava, s.birthday, 
			l.lvl_name, g.group_name, g.group_type, s.lastVisit 
			from student s 
			join gr g on g.group_id = s.group_id
			join lvl l on l.lvl_id = s.lvl
			where g.teacher_id = ? and s.student_id = ?`, [teacherId, id]))
	}
	exports.getTeacherStudents = async (teacherId) => {
		return (await SQL(`select s.student_id, s.firstname, s.lastname, s.phone, s.email, s.ava, s.birthday, 
			l.lvl_name, g.group_name, g.group_type, s.lastVisit 
			from student s 
			join gr g on g.group_id = s.group_id
			join lvl l on l.lvl_id = s.lvl
			where g.teacher_id = ?`, [teacherId]))
	}

	exports.getLearningProcessChartInfo = async (studentId) => {
		return await SQL(`  select c.chart_id, c.start, c.finish, c.lesson, r.lessons,
							false as editing, 
							'white' as start_day_color, 
							'white' as finish_day_color, 
							'white' as start_time_color,
							'white' as finish_time_color
							from student s
							join chart c on c.group_id = s.group_id 
							join gr g on g.group_id = s.group_id
							join rate r on r.rate_id = g.rate_id
							where s.student_id = ? order by c.lesson`, [studentId]);
	}
	exports.getLearningProcessMainInfo = async (studentId) => {
		return (await SQL(`	select g.group_id, g.group_type, g.group_name, t.teacher_id, concat(t.login, ' ', t.lastname) as teacher_name, r.rate_id, r.rate_name, r.lessons
							from student s
							join gr g on g.group_id = s.group_id
							join teacher t on t.teacher_id = g.teacher_id
							join rate r on r.rate_id = g.rate_id
							where s.student_id = ?;`, [studentId]))[0];
	}
	exports.getVisitHistory = async (student_id, order, from, to) => {
		return await SQL(`	select agent, ip, date_format(dt,'%H:%i %d.%m.%Y') as dt
							from ingress i
							join student s on i.user = s.student_id
							where user = ? and isteacher = 0
							order by dt ${order} limit ?, ?;`, [student_id, from, to]);
	}
	exports.getStudentsByChartId = async (chart_id) => {
		return await SQL(`	select s.student_id from chart c
							join gr g on g.group_id = c.group_id
							left join student s on s.group_id = g.group_id
							where c.chart_id = ?;`, [chart_id]);
	}
// insert
	exports.addStudent = async function(phone, password, firstname, lastname) {
		return (await SQL('insert into student (phone, pass, firstname, lastname) values (?,?,?, ?)', [phone, password, firstname, lastname])).affectedRows
	}

	exports.addSocial = async function(firstname, lastname, socialId, socialToken, socialType) {
		return (await SQL('insert into student(firstname, lastname, socialId, socialToken, socialType, smsOn) values (?, ?, ?, ?, ?, 0)', 
			[firstname, lastname, socialId, socialToken, socialType])).affectedRows
	}

	exports.addToken = async function(id, token) {
		let tokens = (await SQL('select pushTokens from student where student_id = ?', [id]))[0].pushTokens
		let mas
		if(tokens) {
			mas = JSON.parse(tokens)
			for(let i = 0; i < mas.length; i++) if(mas[i] == token) return true
			mas.push(token)
		} else {
			mas = [token]
		}
		return (await SQL('update student set pushTokens = ? where student_id = ?', [JSON.stringify(mas), id])).affectedRows
	}
// update
	exports.updateLevel = async function(id, level) {
		return (await SQL('update student set lvl = ? where student_id = ?', [level, id])).affectedRows
	}
	exports.resetGroup = async function(id) {
		return (await SQL('update student set group_id = 0 where student_id = ?', [id])).affectedRows
	}
	exports.closeStream = async function(id) {
		return (await SQL(`update student set stream = 0, nles = nles-1 where student_id = ?`, [id])).affectedRows
	}	
	exports.updateScore = async function(id, value) {
		return (await SQL('update student set score = score + ? where student_id = ?', [value, id])).affectedRows
	}

	exports.updateIsActive = async (id, value) => {
		return (await SQL('update student set is_active = ? where student_id = ?', [value, id])).affectedRows
	}
	exports.updateActivated = async (id, value) => {
		return (await SQL('update student set activated = ? where student_id = ?', [value, id])).affectedRows
	}

	exports.activatePhone = async function(id) {
		return (await SQL('update student set is_active = 1 where student_id = ?', [id])).affectedRows
	}

	exports.activateEmail = async function(id) {
		return (await SQL('update student set activated = 1 where student_id = ?', [id])).affectedRows
	}

	exports.deactivateEmail = async function(id) {
		return (await SQL('update student set activated = 0, mailOn = 0 where student_id = ?', [id])).affectedRows
	}

	exports.updateBlock = async function(id, block) {
		return (await SQL('update student set blocked = ? where student_id = ?', [block, id])).affectedRows 
	}

	exports.updateEmailCode = async function(id, code) {
		return (await SQL('update student set emailCode = ? where student_id = ?', [code, id])).affectedRows
	}

	exports.checkEmailCode = async function(emailCode) {
		return (await SQL('update student set activated = 1 where emailCode = ? and student_id > 0', [emailCode])).affectedRows
	}

	exports.updateAuthCode = async function(id, code) {
		return (await SQL('update student set auth_id = ? where student_id = ?', [code, id])).affectedRows
	}

	exports.updatePassword = async function(id, pass) {
		return (await SQL('update student set pass = ? where student_id = ?', [pass, id])).affectedRows
	}

	exports.updateEmail = async function(id, email) {
		return (await SQL('update student set email = ? where student_id = ?', [email, id])).affectedRows
	}

	exports.updatePhone = async function(id, phone) {
		return (await SQL('update student set phone = ? where student_id = ?', [phone, id])).affectedRows
	}

	exports.updatePhoto = async function(id, ava) {
		return (await SQL('update student set ava = ? where student_id = ?', [ava, id])).affectedRows
	}

	exports.updateProfile = async function(id, firstname, lastname, birthday, email) {
		return (await SQL('update student set firstname = ?, lastname = ?, birthday = ?, email = ? where student_id = ?', [firstname, lastname, birthday, email, id])).affectedRows
	}

	exports.updateGroup = async function(id, group) {
		return (await SQL('update student set group_id = ? where student_id = ?', [group, id])).affectedRows
	}
	exports.updateStream = async function(id, stream) {
		return (await SQL('update student set stream = ? where student_id = ?', [stream, id])).affectedRows
	}
	exports.updateMailOn = async function(id, stat) {
		return (await SQL('update student set mailOn = ? where student_id = ?', [stat, id])).affectedRows
	}
	exports.updateSMSOn = async function(id, stat) {
		return (await SQL('update student set smsOn = ? where student_id = ?', [stat, id])).affectedRows
	}
	exports.updateGuide = async function(id, guide) {
		return (await SQL('update student set guide = ?, guideUsed = 0 where student_id = ?', [guide, id])).affectedRows
	}
	exports.useGuide = async function(id) {
		return (await SQL('update student set guideUsed = 1 where student_id = ?', [id])).affectedRows
	}
	exports.updateLastTeacher = async function(id, teacher) {
		return (await SQL('update student set lastTeacher = ? where student_id = ?', [teacher, id])).affectedRows
	}
	exports.updateStudentGuide = async (student_id, str) => {
		return (await SQL('update student set guide = ? where student_id = ?', [str, student_id])).affectedRows > 0 ? true: false;
	}
// delete
	exports.deleteStudent = async (id) => {
		return (await SQL('delete from student where student_id = ?', id)).affectedRows
	}

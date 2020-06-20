let SQL = require('../apiFunctions/query')

// select 
	exports.getStudentQuiz = async function(studentId, id) {
		return (await SQL(` select q.id, q.name, q.teacher, q.level, qr.score, qr.id as resultId, qr.content as completed, l.lvl_name 
							from quiz q
							join lvl l on l.lvl_id = q.level
							join quizResult qr on qr.quiz = q.id 
							where qr.student = ? 
							and q.id = ?`, [studentId, id]))[0]
	}
	exports.getTeacherQuiz = async (teacherId, id) => {
		return (await SQL(`select q.id, q.level, q.name, l.lvl_name
			from quiz q 
			join lvl l on l.lvl_id = q.level
			where teacher = ? and id = ?`, [teacherId, id]))[0]
	}
	exports.getTeacherUnverifiedQuizResultCount = async (teacherId) => {
		return (await SQL(` select count(*) as cnt from quiz q 
							join quizResult qr on qr.quiz = q.id
							where q.teacher = ?
							and qr.score IS NULL 
							and content IS NOT NULL`, [teacherId]))[0].cnt
	} 
	exports.getStudentQuizList = async function(studentId) {
		return await SQL(`	select q.id, q.name, q.teacher, q.level, qr.content, qr.score, qr.dt, qr.id as resultId, l.lvl_name 
							from quiz q
							join quizResult qr on qr.quiz = q.id 
							join lvl l on l.lvl_id = q.level
							where qr.student = ? order by qr.dt`, [studentId])
	}
	exports.getTeacherQuizList = async (teacherId) => {
		return await SQL(`
			select q.id, q.level, q.name, l.lvl_name 
			from quiz q 
			join lvl l on l.lvl_id = q.level
			where teacher = ?`, teacherId)
	}
	exports.find = async (teacherId, text) => {
		return await SQL(`
			select q.id, q.level, q.name, l.lvl_name 
			from quiz q 
			join lvl l on l.lvl_id = q.level
			where teacher = ? 
			and (
				l.lvl_name 	like concat('%', ? ,'%') or
				q.name 		like concat('%', ? ,'%')
			)`, [teacherId, text, text])
	} 
	exports.findQuiz = async (teacherId, level, groupId) => {
		return await SQL(`select * from quiz 
			where teacher = ? 
			and level = ?
			and id not in 
			(
				select quiz
				from quizResult r
				join student s on r.student = s.student_id 
				where s.group_id = ?
			)`, [teacherId, level, groupId])
	}

// insert
	exports.add = async (teacherId, level, name) => {
		return (await SQL('insert into quiz(teacher, level, name) values (?,?,?)', [teacherId, level, name])).insertId
	}

// update
	exports.updateQuiz = async (id, name, level) => {
		return (await SQL('update quiz set name = ?, level = ? where id = ?', [name, level, id])).affectedRows
	}
	
// delete
	exports.deleteQuiz = async (id) => {
		return (await SQL('delete from quiz where id = ? ', [id])).affectedRows
	}
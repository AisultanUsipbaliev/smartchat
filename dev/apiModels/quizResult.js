let SQL = require('../apiFunctions/query')

// select 
	exports.getStudentResult = async (studentId, id) => {
		return (await SQL('select * from quizResult where id = ? and student = ?', [id, studentId]))
	}
	exports.getStudentResultByQuizId = async (studentId, quizId) => {
		return (await SQL('select * from quizResult where student = ? and quiz = ?', [studentId, quizId]))[0]
	}
	exports.getTeacherResult = async (teacherId, id) => {
		return (await SQL(`select r.id, r.quiz, r.student, r.content, r.score, s.firstname, s.lastname, 
			q.name, q.level, l.lvl_name
			from quizResult r
			join quiz q on q.id = r.quiz
			join lvl l on l.lvl_id = q.level
			join student s on s.student_id = r.student
			where r.id = ?
			and q.teacher = ?
			`, [id, teacherId]))[0]
	}
	exports.getTeacherResultList = async (teacherId) => {
		return await SQL(`select r.id, r.quiz, r.student, r.content, r.score, s.firstname, s.lastname, r.dt,
			q.name, q.level, l.lvl_name
			from quizResult r
			join quiz q on q.id = r.quiz
			join lvl l on l.lvl_id = q.level
			join student s on s.student_id = r.student
			where q.teacher = ?`, [teacherId])
	}
	exports.findStudentResultList = async (teacherId, studentId) => {
		return await SQL(`select r.id, r.quiz, r.student, r.content, r.score, s.firstname, s.lastname, 
			q.name, q.level, l.lvl_name
			from quizResult r
			join quiz q on q.id = r.quiz
			join lvl l on l.lvl_id = q.level
			join student s on s.student_id = r.student
			where q.teacher = ? 
			and r.student = ?`, [teacherId, studentId])
	}
	exports.find = async (teacherId, text) => {
		return await SQL(`select r.id, r.quiz, r.student, r.content, r.score, s.firstname, s.lastname, 
			q.name, q.level, l.lvl_name
			from quizResult r
			join quiz q on q.id = r.quiz
			join lvl l on l.lvl_id = q.level
			join student s on s.student_id = r.student
			where q.teacher = ? and 
			(
				l.lvl_name 	like concat('%', ? , '%') or
				s.firstname like concat('%', ? , '%') or
				s.lastname 	like concat('%', ? , '%') or
				q.name 		like concat('%', ? , '%') 
			)`, [teacherId, text, text, text, text])
	}
	exports.getStudentQuizResultCount = async (studentId) => {
		return (await SQL(` select count(*) as cnt from quizResult 
							where student = ?
							and content IS NULL`, [studentId]))[0].cnt;
	}
// insert
	exports.add = async (quizId, studentId) => {
		return (await SQL('insert into quizResult(quiz, student) values (?, ?)', [quizId, studentId])).insertId
	}
// update
	exports.sendResult = async (resultId, contents, score) => {
		return (await SQL('update quizResult set content = ?, score = ? where id = ?', [contents, score, resultId])).affectedRows
	}
	exports.updateQuizResult = async function(id, content) {
		return (await SQL('update quizResult set content = ?, dt = now() where id = ?', [content, id])).affectedRows
	} 
// delete
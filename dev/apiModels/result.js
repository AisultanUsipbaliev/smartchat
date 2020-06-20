let SQL = require('../apiFunctions/query')

// select
	exports.getResult = async (id) => {
		return (await SQL(`	select r.result_id, r.student_id, r.test_id, r.count, r.isread, r.dt, r.answers, r.done, s.firstname, s.lastname from result r
							join student s on s.student_id = r.student_id
							where result_id = ?`, [id]))[0]
	}
	exports.getResults = async (teacherId) => {
		return await SQL(`	select r.done, r.isread, s.student_id, s.firstname, s.lastname, t.test_name, t.test_id, l.lvl_name, r.count, 
							r.dt, r.result_id, r.answers
							from result r
							join student s on s.student_id = r.student_id
							join test t on t.test_id = r.test_id
							join lvl l on l.lvl_id = t.test_lvl
							where t.teacher_id = ?`, [teacherId])
	}

	exports.findStudentResults = async (teacherId, studentId) => {
		return await SQL(`	select s.student_id, s.firstname, s.lastname, t.test_name, t.test_id, l.lvl_name, r.count, 
							r.dt, r.result_id, r.answers
							from result r
							join student s on s.student_id = r.student_id
							join test t on t.test_id = r.test_id
							join lvl l on l.lvl_id = t.test_lvl
							where t.teacher_id = ?
							and r.student_id = ?`, [teacherId, studentId])
	}


	exports.findResults = async (teacherId, text) => {
		return await SQL(`	select r.done, r.isread, s.student_id, s.firstname, s.lastname, t.test_name, t.test_id, l.lvl_name, r.count, 
							r.dt, r.result_id, r.answers
							from result r
							join student s on s.student_id = r.student_id
							join test t on t.test_id = r.test_id
							join lvl l on l.lvl_id = t.test_lvl
							where t.teacher_id = ? 
							and 
							( 
								concat(s.firstname, ' ', s.lastname) like concat('%', ? ,'%') or
								t.test_name like concat('%', ? ,'%') or
								l.lvl_name like concat('%', ? ,'%') 
							)`, [teacherId, text, text, text])
	} 

	exports.getUnreadResultCount = async (teacherId) => {
		return (await SQL(`	select count(*) as cnt from result r
							join student s on s.student_id = r.student_id
							join test t on t.test_id = r.test_id 
							where t.teacher_id = ?
							and isread = 0
							and done = 1`, [teacherId]))[0].cnt
	}

	exports.getStudentResult = async (studentId, testId) => {
		return (await SQL('select * from result where student_id = ? and test_id = ?', [studentId, testId]))[0]
	}
	exports.setIsreadResult = async (resultId) => {
		return (await SQL('update result set isread = 1 where result_id = ?', [resultId])).affectedRows
	}
// insert
	exports.add = async (testId, studentId) => {
		return (await SQL('insert into result(test_id, student_id) values (?, ?)', [testId, studentId])).insertId
	}

// update
	exports.addResult = async function(myId, test, count, answers) {
		return (await SQL('update result set count = ?, answers = ?, dt = now(), done=1 where student_id = ? and test_id = ?', [count, answers, myId, test])).affectedRows
	}

// delete
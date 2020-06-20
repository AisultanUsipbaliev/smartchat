let SQL = require('../apiFunctions/query')

// Выборка
	exports.getTest = async (id) => {
		return (await SQL(`	select test_id, test_name, lvl_id, lvl_name, dt, teacher_id
							from test
							join lvl on lvl_id = test_lvl
							where test_id = ?`, [id]))[0]
	}
	exports.getTeacherTest = async (teacherId, id) => {
		return (await SQL(`	select test_id, test_name, lvl_id, lvl_name, dt
							from test
							join lvl on lvl_id = test_lvl
							where teacher_id = ? and test_id = ?`, [teacherId, id]))[0]
	}
	exports.getStudentTest = async (studentId, id) => {
		return (await SQL('select * from test t join result r on r.test_id = t.test_id join lvl l on l.lvl_id = t.test_lvl where t.test_id = ? and r.student_id = ?', [id, studentId]))[0]
	}
	exports.getTeacherTests = async (teacherId) => {
		return await SQL(`	select test_id, test_name, lvl_id, lvl_name, dt
							from test
							join lvl on lvl_id = test_lvl
							where  teacher_id = ? order by dt desc`, [teacherId])
	}
	exports.getStudentTests = async (studentId) => {
		return await SQL(`select r.done, t.test_id, t.test_name, t.teacher_id, l.lvl_id, 
			l.lvl_name, r.count, r.isread, r.dt, r.answers
			from test t
			join lvl l on l.lvl_id = t.test_lvl
			left join result r on r.test_id = t.test_id
			where r.student_id = ?`, [studentId])
	}
	exports.getChatTest = async (teacherId, testLvl, studentId) => {
		return await SQL(`	select * from test t where t.teacher_id = ?
							and t.test_lvl = ?
							and t.test_id not in (select r.test_id from result r where r.student_id = ?)`, [teacherId, testLvl, studentId])
	}
	exports.findTest = async (teacherId, testLvl, groupId) => {
		return await SQL(`select * from test 
			where teacher_id = ? 
			and test_lvl = ?
			and test_id not in 
			(
				select test_id 
				from result r
				join student s on r.student_id = s.student_id 
				where s.group_id = ?
			)`, [teacherId, testLvl, groupId])
	} 
	exports.getMyTestsCount = async (myId) => {
		return (await SQL('select count(*) cnt from result where student_id = ? and done = 0', myId))[0].cnt
	}

// Вставка
	exports.createTest = async (testName, teacherId, testLvl) => {
		return (await SQL(`insert into test(test_name, teacher_id, test_lvl) values (?,?,?)`, [testName, teacherId, testLvl])).insertId
	}
// Удаление
	exports.deleteTest = async (id) => {
		return (await SQL(`delete from test where test_id = ?`, [id])).affectedRows
	}
// Изменение
	exports.updateTest = async (testName, teacherId, testLvl, id) => {
		return (await SQL(`update test set test_name = ?, teacher_id = ?, test_lvl = ? where test_id = ?`, [testName, teacherId, testLvl, id])).affectedRows
	}
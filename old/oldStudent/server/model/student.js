let SQL = require('../functions/query')

// Проверка данных
	exports.acceptToRequest = async function(id) {
		let group = (await SQL('select group_id from student where student_id = ?', id))[0].group_id;
		if(group != 0) return false;

		let req = await SQL('select * from req where student_id = ?', id);
		if(req.length > 0) return false;

		return true; 
	}

// Выборка 
	exports.getStudent = async function(id) {
		return (await SQL('select * from student where student_id = ?', id))[0]
	}
	exports.getProfile = async function(id){
		return (await SQL(`select firstname, lastname, phone, ava, birthday, email, activated,
			lvl.lvl_name, group_id, smsOn, mailOn 
			from student
			join lvl on lvl.lvl_id = student.lvl 
			where student_id = ?`, id))[0]
	}
	exports.findPhone = async function(phone) {
		return (await SQL('select * from student where phone = ?', phone))[0]
	}

	exports.findGuide = async function(guide) {
		return (await SQL('select * from student where guide = ?', guide))[0]
	}

	exports.findSocial = async function(socialId, socialType, socialToken) {
		return (await SQL('select * from student where socialType = ? and socialId = ? and socialToken = ?', 
			[socialType, socialId, socialToken]))[0]
	}

	exports.findGroup = async function(group) {
		return await SQL('select firstname, lastname, ava, lastVisit from student where group_id = ?', group)
	}

// Вставка
	exports.addStudent = async function(phone, password, firstname) {
		let res = await SQL('insert into student (phone, pass, firstname) values (?,?,?)', [phone, password, firstname])
		return res.affectedRows > 0? res.insertId: false
	}

	exports.addSocial = async function(firstname, lastname, socialId, socialToken, socialType) {
		let res = await SQL('insert into student(firstname, lastname, socialId, socialToken, socialType, smsOn) values (?, ?, ?, ?, ?, 0)', 
			[firstname, lastname, socialId, socialToken, socialType])
		return res.affectedRows > 0? res.insertId: false
	}

	exports.addToken = async function(id, token) {
		let tokens = (await SQL('select pushTokens from student where student_id = ?', id))[0].pushTokens;
		let mas;
		if(tokens) {
			mas = JSON.parse(tokens);
			for(let i = 0; i < mas.length; i++) if(mas[i] == token) return true;
			mas.push(token);
		} else {
			mas = [token];
		}
		return (await SQL('update student set pushTokens = ? where student_id = ?', [JSON.stringify(mas), id]))
		.affectedRows > 0
	}

// Изменение
	exports.activatePhone = async function(id) {
		let res = await SQL('update student set is_active = 1 where student_id = ?', id)
		return res.affectedRows > 0
	}

	exports.activateEmail = async function(id) {
		let res = await SQL('update student set activated = 1 where student_id = ?', id)
		return res.affectedRows > 0
	}

	exports.deactivateEmail = async function(id) {
		let res = await SQL('update student set activated = 0, mailOn = 0 where student_id = ?', id)
		return res.affectedRows > 0
	}

	exports.updateEmailCode = async function(id, code) {
		return (await SQL('update student set emailCode = ? where student_id = ?', [code, id])).affectedRows > 0
	}

	exports.checkEmailCode = async function(emailCode) {
		let res = await SQL('update student set activated = 1 where emailCode = ?', emailCode)
		return res.affectedRows > 0
	}


	exports.updateAuthCode = async function(id, code) {
		let res = await SQL('update student set auth_id = ? where student_id = ?', [code, id])
		return res.affectedRows > 0
	}

	exports.updatePassword = async function(id, pass) {
		let res = await SQL('update student set pass = ? where student_id = ?', [pass, id])
		return res.affectedRows > 0 
	}

	exports.updateEmail = async function(id, email) {
		return (await SQL('update student set email = ? where student_id = ?', [email, id])).affectedRows > 0
	}

	exports.updatePhone = async function(id, phone) {
		return (await SQL('update student set phone = ? where student_id = ?', [phone, id])).affectedRows > 0
	}

	exports.updatePhoto = async function(id, ava) {
		return (await SQL('update student set ava = ? where student_id = ?', [ava, id])).affectedRows>0
	}

	exports.updateProfile = async function(id, firstname, lastname, birthday, email) {
		return (await SQL('update student set firstname = ?, lastname = ?, birthday = ?, email = ? where student_id = ?', [firstname, lastname, birthday, email, id])).affectedRows>0
	}

	exports.updateGroup = async function(id, group) {
		return (await SQL('update student set group_id = ? where student_id = ?', [group, id])).affectedRows>0
	}
	exports.updateStream = async function(id, stream) {
		return (await SQL('update student set stream = ? where student_id = ?', [stream, id])).affectedRows>0
	}

	exports.updateMailOn = async function(id, stat) {
		return (await SQL('update student set mailOn = ? where student_id = ?', [stat, id])).affectedRows>0
	}
	exports.updateSMSOn = async function(id, stat) {
		return (await SQL('update student set smsOn = ? where student_id = ?', [stat, id])).affectedRows>0
	}
	exports.updateMailOn = async function(id, stat) {
		return (await SQL('update student set mailOn = ? where student_id = ?', [stat, id])).affectedRows>0
	}
	exports.updateGuide = async function(id, guide) {
		return (await SQL('update student set guide = ?, guideUsed = 0 where student_id = ?', [guide, id])).affectedRows>0
	}
	exports.useGuide = async function(id) {
		return (await SQL('update student set guideUsed = 1 where student_id = ?', id)).affectedRows>0
	}
// Удаление
const teacherModel 	= require('../../apiModels/teacher'),
	  studentModel 	= require('../../apiModels/student'),
	  levelModel 	= require('../../apiModels/level');

const sendingAMessageOnAllServices	= require('../../apiFunctions/sendingAMessageOnAllServices');
const bcrypt = require('bcrypt')

exports.blockUser  = async (req) => {
	let result = null,
		block = (parseInt(req.body.block)) ? 1 : 0;

	if (req.body.student_id) { 

		let studentInfo = await studentModel.getProfile(req.body.student_id);
		if (!studentInfo) return { status: 404, message: 'student not found' }

		result = await studentModel.updateBlock(req.body.student_id, block)

		if (result) {
			if (config.production) {
				let message = `Ваш аккаунт ${studentInfo.firstname, studentInfo.lastname} ${block? 'заблокирован' : 'разблокирован'}`;
				await sendingAMessageOnAllServices(studentInfo, message);
			}
			return { status: 200 }		
		} else { return { status: 204 } } 

	} else if (req.body.teacher_id) {
		
		let teacherInfo = teacherModel.getProfile(req.body.teacher_id)
		if (!teacherInfo) return { status: 404, message: 'teacher not found' }

		result = await teacherModel.updateBlock(req.body.teacher_id, block)

		return result ? { status: 200 } : { status: 204 }

	} else {
		return { status: 400, message: 'user id is not defined' }
	}
}
exports.deleteUser  = async (req) => {
	let result = null;

	if (req.body.student_id) { 

		let studentInfo = await studentModel.getProfile(req.body.student_id);
		if (!studentInfo) return { status: 404, message: 'student not found' }

		let result = await studentModel.deleteStudent(req.body.student_id);

		if (result) {
			if (config.production) {
				let message = `Ваш аккаунт ${studentInfo.firstname, studentInfo.lastname} удален администратором`;
				await sendingAMessageOnAllServices(studentInfo, message);
				return { status: 200 }	
			}
			return { status: 200 }		
		} else { return { status: 204 } } 

	} else if (req.body.teacher_id) {
		
		let teacherInfo = teacherModel.getProfile(req.body.teacher_id)
		if (!teacherInfo) return { status: 404, message: 'teacher not found' }

		result = await teacherModel.deleteTeacher(req.body.teacher_id)

		return result ? { status: 200 } : { status: 204 }

	} else {
		return { status: 400, message: 'user id is not defined' }
	}
}
exports.resetPassword  = async (req) => {
	let result = null,
		message = '',
		salt = await bcrypt.genSalt(10),
		hash = await bcrypt.hash(config.deafultPassword, salt);

	if (req.body.student_id) { 

		let studentInfo = await studentModel.getProfile(req.body.student_id);
		if (!studentInfo) return { status: 404, message: 'student not found' }

		let result = await studentModel.updatePassword(req.body.student_id, hash);

		if (result) {
			if (config.production) {
				message = `Ваш пароль был изменён на - "${config.deafultPassword}". Администрация SmartChat.`;
				await sendingAMessageOnAllServices(studentInfo, message);
				return { status: 200 }	
			}
			return { status: 200 }		
		} else { return { status: 204 } } 

	} else if (req.body.teacher_id) {
		
		let teacherInfo = teacherModel.getProfile(req.body.teacher_id)
		if (!teacherInfo) return { status: 404, message: 'teacher not found' }

		result = await teacherModel.updatePassword(req.body.teacher_id, hash)

		if (result) {
			if (config.production) {
				message = `Ваш пароль был изменён на - "${config.deafultPassword}". Администрация SmartChat.`;
				await sendingAMessageOnAllServices(teacherInfo, message);
			}
			return { status: 200 }
		} else { { status: 204 } }

	} else {
		return { status: 400, message: 'user id is not defined' }
	}
}
exports.smsMessages  = async (req) => {
	let result = null,
		value = (parseInt(req.body.value)) ? 1 : 0;

	if (req.body.student_id) { 

		let studentInfo = await studentModel.getProfile(req.body.student_id);
		if (!studentInfo) return { status: 404, message: 'student not found' }

		result = await studentModel.updateSMSOn(req.body.student_id, value)

		return result ? { status: 200 } : { status: 204 };

	} else if (req.body.teacher_id) {
		
		let teacherInfo = teacherModel.getProfile(req.body.teacher_id)
		if (!teacherInfo) return { status: 404, message: 'teacher not found' }

		result = await teacherModel.updateSMSOn(req.body.teacher_id, value)

		return result ? { status: 200 } : { status: 204 }

	} else {
		return { status: 400, message: 'user id is not defined' }
	}
}
exports.emailMessages  = async (req) => {
	let result = null,
		value = (parseInt(req.body.value)) ? 1 : 0;

	if (req.body.student_id) { 

		let studentInfo = await studentModel.getProfile(req.body.student_id);
		if (!studentInfo) return { status: 404, message: 'student not found' }

		result = await studentModel.updateMailOn(req.body.student_id, value)

		return result ? { status: 200 } : { status: 204 };

	} else if (req.body.teacher_id) {
		
		let teacherInfo = teacherModel.getProfile(req.body.teacher_id)
		if (!teacherInfo) return { status: 404, message: 'teacher not found' }

		result = await teacherModel.updateMailOn(req.body.teacher_id, value)

		return result ? { status: 200 } : { status: 204 }

	} else {
		return { status: 400, message: 'user id is not defined' }
	}
}
exports.phoneStatus  = async (req) => {
	let result = null,
		value = (parseInt(req.body.value)) ? 1 : 0;

	if (req.body.student_id) { 

		let studentInfo = await studentModel.getProfile(req.body.student_id);
		if (!studentInfo) return { status: 404, message: 'student not found' }

		result = await studentModel.updateIsActive(req.body.student_id, value)

		return result ? { status: 200 } : { status: 204 };

	} else if (req.body.teacher_id) {
		
		let teacherInfo = teacherModel.getProfile(req.body.teacher_id)
		if (!teacherInfo) return { status: 404, message: 'teacher not found' }

		result = await teacherModel.updateIsActive(req.body.teacher_id, value)

		return result ? { status: 200 } : { status: 204 }

	} else {
		return { status: 400, message: 'user id is not defined' }
	}
}
exports.emailStatus  = async (req) => {
	let result = null,
		value = (parseInt(req.body.value)) ? 1 : 0;

	if (req.body.student_id) { 

		let studentInfo = await studentModel.getProfile(req.body.student_id);
		if (!studentInfo) return { status: 404, message: 'student not found' }

		result = await studentModel.updateActivated(req.body.student_id, value)

		return result ? { status: 200 } : { status: 204 };

	} else if (req.body.teacher_id) {
		
		let teacherInfo = teacherModel.getProfile(req.body.teacher_id)
		if (!teacherInfo) return { status: 404, message: 'teacher not found' }

		result = await teacherModel.updateActivated(req.body.teacher_id, value)

		return result ? { status: 200 } : { status: 204 }

	} else {
		return { status: 400, message: 'user id is not defined' }
	}
}
exports.changeLevel  = async (req) => {

	if (!req.body.level_id) { return { status: 400, message: 'no level_id' } }

	let levelInfo = await levelModel.getLevel(req.body.level_id);
	if (!levelInfo) return { status: 404, message: 'level not found' }

	let result = null

	if (req.body.student_id) { 

		let studentInfo = await studentModel.getProfile(req.body.student_id);
		if (!studentInfo) return { status: 404, message: 'student not found' }

		result = await studentModel.updateLevel(req.body.student_id, req.body.level_id)

		return result ? { status: 200 } : { status: 204 };

	} else if (req.body.teacher_id) {
		
		let teacherInfo = teacherModel.getProfile(req.body.teacher_id)
		if (!teacherInfo) return { status: 404, message: 'teacher not found' }

		result = await teacherModel.updateLevel(req.body.teacher_id, req.body.level_id)

		return result ? { status: 200 } : { status: 204 }

	} else {
		return { status: 400, message: 'user id is not defined' }
	}
}
exports.visitHistory  = async (req) => {
	if ((parseInt(req.body.from) && parseInt(req.body.from) !== 0) && parseInt(req.body.to)) { return { status: 400, message: 'no from or to' }; }
	
	let order = 'desc';
	if (parseInt(req.body.order)) { order = 'asc' }

	let visitHistory = null;

	if (req.body.student_id) {
		visitHistory = await studentModel.getVisitHistory(req.body.student_id, order, parseInt(req.body.from), parseInt(req.body.to));
	} else if (req.body.teacher_id) {
		visitHistory = await teacherModel.getVisitHistory(req.body.teacher_id, order, parseInt(req.body.from), parseInt(req.body.to));
	}

	return visitHistory ? { status: 200, visitHistory } : { status: 204 };
}
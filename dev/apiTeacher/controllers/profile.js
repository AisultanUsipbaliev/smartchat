let bcrypt 	= require('bcryptjs')

let getHash = require('../../apiFunctions/getHash')

let teacherModel = require('../../apiModels/teacher')
let graphModel = require('../../apiModels/graph')

exports.getProfile = async (req) => {
	return { status: 200, profile: await teacherModel.getProfile(req.body.myId) }
}

exports.updateProfile = async (req) => {
	if(!req.body.login) 	return { status: 418, message: 'no login' }
	if(!req.body.lastname) 	return { status: 418, message: 'no lastname' }

	let updated = await teacherModel.updateTeacher(req.body.myId, req.body.login, req.body.lastname)

	if (updated) return { status: 200 }
	else throw new Error('Can\'t update profile -> teacherModel.updateTeacher')
}

exports.updatePassword = async (req) => {
	if(!req.body.pass) 		return { status: 418, message: 'no pass' }
	if(!req.body.oldpass) 	return { status: 418, message: 'no oldpass' }

	let teacher = await teacherModel.getTeacher(req.body.myId)

	let check = await bcrypt.compare(req.body.oldpass, teacher.pass)

	if(!check) return { status: 202, message: 'wrong pass' }
						
	let pass = await getHash(req.body.pass)

	let updated = await teacherModel.updatePassword(req.body.myId, pass)
	if (!updated) throw new Error('Can\'t update password teacherModel.updatePassword') 
	return { status: 200, password: pass }
}

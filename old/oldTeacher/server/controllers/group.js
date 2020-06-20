let model = require('../models/group');

exports.getGroup = async function (req) {	
	if(!req.body.group_id) {
		let groups = await model.getGroupsByTeacherId(req.cookies['SAI'])
		if(groups.length > 0)			return {status: 200, groups: groups}
		else							return {status: 202, message: 'not found'}
	} else {
		let students = await model.getStudentsByGroupId(req.body.group_id)
		if(students.length > 0)			return {status: 200, students: students}
		else							return {status: 202, message: 'not found'}
	}
}

exports.updateGroup = async function (req) {
	if (!req.body.name) 				return {status: 418, message: 'no name'}
	if (!req.body.id) 					return {status: 418, message: 'no id'}
	let group = await model.updateGroup(req.body.name, req.body.id)
	if (group) 							return {status: 200, message: 'success'}
	else								return {status: 202, message: 'error'}
}

exports.deleteGroup = async function (req) {
	if (!req.body.id) 					return {status: 418, message: 'no id'}
	let group = await model.deleteGroup(req.body.id)
	if (group) 							return {status: 200, message: 'success'}
	else								return {status: 202, message: 'error'}
}
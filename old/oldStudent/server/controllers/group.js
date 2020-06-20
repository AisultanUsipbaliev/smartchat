let model = require('../models/group');

exports.getGroup = async function(req) {
	let group_info = await model.getGroupInfoByStudentId(req.body.myId);
	if (group_info.length>0) {
		let rate_info 	= await model.getRateInfoByRateId(group_info[0].rate_id);
		let teacher 	= await model.getTeacherInfoByTeacherId(group_info[0].teacher_id);
		let student 	= await model.getStudentListByGroupId(group_info[0].group_id);

		let body = {
						info: {
							group_info: group_info,
							rate_info: rate_info
						},
						participants: {
							teacher: teacher,
							student: student
						}
					}
		return  {
					status: 200,
					message: "getting student groups",
					body: body
				}
	} else {
		return  {
					status: 202,
					message: "not student groups"
				}
	}
}
const model 												= require('../models/teacher');
const sendingAMessageOnAllServices	= require('../functions/sendingAMessageOnAllServices');
const bcrypt 												= require('bcryptjs');

exports.GetTeacherList  = async (req) =>
{
	if (typeof(req.body.column) == undefined && req.body.column === null) { return { status: 400, message: 'no column' }; }
	if (typeof(req.body.order) == undefined && req.body.order === null) 	{ return { status: 400, message: 'no order'  }; }
	if (typeof(req.body.from) == undefined && req.body.from === null) 		{ return { status: 400, message: 'no from'   }; }
	if (typeof(req.body.limit) == undefined && req.body.limit === null) 	{ return { status: 400, message: 'no limit'  }; }

	let teachers = null;
	let column = parseInt(req.body.column);
	let from   = parseInt(req.body.from);
	let limit  = parseInt(req.body.limit);

	let order = '';
	if (req.body.order == 'true') { order = 'desc'; } else if (req.body.order == 'false') { order = 'asc'; }

	let text 	 = '';
	if (typeof(req.body.text) != undefined && req.body.text !== null) { text = req.body.text.trim(); }

	let filter = null;
	if (parseInt(req.body.filter) === 0 || parseInt(req.body.filter) === 1) { 
		teachers = await model.getFilteredTeacherList(parseInt(req.body.filter), column, order, from, limit, text); 
	} else { teachers = await model.getTeacherList(column, order, from, limit, text); } 

	return teachers.length > 0 ? { status: 200, teachers } : { status: 204 };
}
exports.Block = async (req) =>
{
	if (!req.body.teacher_id) return { status: 400 };

	let result;

	if (parseInt(req.body.block)) { result  = await model.blockTeacher(req.body.teacher_id); } 
	else 													{ result  = await model.unblockTeacher(req.body.teacher_id); }

	return result ? { status: 200 } : { status: 204 };
}
exports.Update = async (req) =>
{
	if(!req.body.teacher_id) 	return { status: 418, message: 'no teacher_id' 	};
	if(!req.body.login) 			return { status: 418, message: 'no login' 		};
	if(!req.body.lastname) 		return { status: 418, message: 'no lastname' 	};
	if(!req.body.phone)				return { status: 418, message: 'no phone' 		};
	if(!req.body.level)				return { status: 418, message: 'no level' 		};
	if(!req.body.role)				return { status: 418, message: 'no role' 		};

	let result = await model.updateTeacher(req.body.teacher_id, req.body.login, req.body.lastname, req.body.phone, req.body.level, req.body.role);

	if(result) 	return { status: 200, message: 'success'};
	else 				return { status: 202, message: 'not updated'}
}
exports.Delete = async (req) =>
{
	if(!req.body.teacher_id) 	return {status: 418, message: ' no teacher_id'};
	let result = await model.deleteTeacher(req.body.teacher_id);
	if(result) 	return { status: 200, message: 'success'};
	else 		return { status: 202, message: 'not deleted'}
}
exports.EditRole = async (req) =>
{
	if (typeof(req.body.role) == undefined && req.body.role === null && parseInt(req.body.role) == NaN) return { status: 400, message: 'no role' }
	if(parseInt(req.body.teacher_id) == NaN) 																														return { status: 400, message: 'no teacher_id' };
	
	let role = 0;
	
	if (!parseInt(req.body.role)) role = 1;

	let result = await model.editRole(role, parseInt(req.body.teacher_id));

	if(result) 	return { status: 200 };
	else 				return { status: 202, message: 'not edited'}
} 
exports.GetTeacherAllInfo  = async (req) =>
{
	if (!req.body.teacher_id) 		{ return { status: 400, message: 'no teacher_id' }; }

	let teacher = await model.getTeacherInfo(req.body.teacher_id);
	let level = await model.getSelectedLevel();
	let group = await model.getTeacherGroupList(req.body.teacher_id);
	let shedule = await model.getTeacherSheduleList(req.body.teacher_id);
	let balance = await model.getTeacherBalance(req.body.teacher_id)
	
	return teacher ? { status: 200, teacher, level, group, shedule, balance } : { status: 204 };
} 
exports.GetTeacherGroupList  = async (req) =>
{
	if (!req.body.teacher_id) 		{ return { status: 400, message: 'no teacher_id' }; }

	let group = await model.getTeacherGroupList(req.body.teacher_id);
	
	return group ? { status: 200, group } : { status: 204 };
}
exports.UpdateTeacherPhoneActivate = async (req) =>
{
	if (!req.body.teacher_id) return { status: 400 };

	let result;

	if (parseInt(req.body.activate_phone)) 	{ result  = await model.activateTeacherPhone(req.body.teacher_id);	}
	else 																		{ result  = await model.deactivateTeacherPhone(req.body.teacher_id); }

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateTeacherEmailActivate = async (req) =>
{
	if (!req.body.teacher_id) return { status: 400 };

	let result;

	if (parseInt(req.body.activate_email)) 	{ result  = await model.activateTeacherEmail(req.body.teacher_id);	}
	else 																		{ result  = await model.deactivateTeacherEmail(req.body.teacher_id); }

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateTeacherSmsOn = async (req) =>
{
	if (!req.body.teacher_id) return { status: 400 };

	let result;

	if (parseInt(req.body.value)) 	{ result  = await model.enableTeacherSmsOn(req.body.teacher_id);	}
	else 														{ result  = await model.disableTeacherSmsOn(req.body.teacher_id); }

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateTeacherMailOn = async (req) =>
{
	if (!req.body.teacher_id) return { status: 400 };

	let result;

	if (parseInt(req.body.value)) 	{ result  = await model.enableTeacherMailOn(req.body.teacher_id);	}
	else 														{ result  = await model.disableTeacherMailOn(req.body.teacher_id); }

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateTeacherLevel = async (req) =>
{
	if (!req.body.teacher_id) 		{ return { status: 400, message: 'no teacher_id' }; }
	if (!req.body.level_id) 			{ return { status: 400, message: 'no level_id' }; }

	let result = await model.updateTeacherLevel(req.body.teacher_id, req.body.level_id);

	return result ? { status: 200 } : { status: 204 };
}
exports.UpdateTeacherPassword = async (req) =>
{
	if (!req.body.teacher_id) 		{ return { status: 400, message: 'no teacher_id' }; }

	let salt 		= await bcrypt.genSalt(10);
	let hash 		= await bcrypt.hash(config.deafultPassword, salt);
	let result 	= await model.updateTeacherPassword(hash, req.body.teacher_id);

	if (result) {
		let teacherInfo = await model.getTeacherPSM(req.body.teacher_id);
		let message = `Ваш пароль был изменён на - "${config.deafultPassword}". Администрация SmartChat.`;
		await sendingAMessageOnAllServices(teacherInfo, message);
		return { status: 200 }
	} else { { status: 204 } }
}
exports.UpdateTeacherShedule = async (req) =>
{
	if (!req.body.teacher_id) 		{ return { status: 400, message: 'no teacher_id' }; }
	if (!req.body.graph) 					{ return { status: 400, message: 'no graph' }; }

	let graph = JSON.parse(req.body.graph);
	for(let i = 0; i < graph.length; i++){
		console.log(graph[i])
		if(graph[i].start !== ''){
			let update = await model.updateTeacherShedule(req.body.teacher_id, graph[i].start, graph[i].end, graph[i].nday)

			console.log(update)
			let insert;
			if(!update.affectedRows)
				insert = await model.insertTeacherShedule(req.body.teacher_id, graph[i].start, graph[i].end, graph[i].nday)
		}
	}
	return {status: 200}
}
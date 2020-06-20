const teacherModel 	= require('../../apiModels/teacher'),
	  levelModel 	= require('../../apiModels/level'),
	  graphModel 	= require('../../apiModels/graph'),
	  balanceModel 	= require('../../apiModels/balance');

exports.getTeachers  = async (req) => {

	if (req.body.unblockedTeachers) {
		let teacher  = await teacherModel.getSelectedTeacher(); 
		return teacher.length ? { status: 200, teacher } : { status: 204 };
	}

	if (!req.body.column && req.body.column !==0) 	{ return { status: 400, message: 'no column' }; }
	if (!req.body.limit && req.body.limit !== 0) 	{ return { status: 400, message: 'no limit'  }; }
	if (!req.body.from && req.body.from !== 0) 		{ return { status: 400, message: 'no from'   }; }
	if (!req.body.order) 							{ return { status: 400, message: 'no order'  }; }

	let teachers = null;
	let order = '';
	let text = '';
	let filter = null;

	let column = parseInt(req.body.column);
	let from = parseInt(req.body.from);
	let limit = parseInt(req.body.limit);

	if (req.body.order == 'true') { order = 'desc'; } else if (req.body.order == 'false') { order = 'asc'; }

	if (req.body.text && (typeof req.body.text) === "string") { text = req.body.text.trim(); }

	if (parseInt(req.body.filter) === 0 || parseInt(req.body.filter) === 1) { 
		teachers = await teacherModel.getFilteredTeachers(parseInt(req.body.filter), column, order, from, limit, text); 
	} else { 
		teachers = await teacherModel.getTeachers2(column, order, from, limit, text); 
		console.log('popal')
	} 

	return teachers.length ? { status: 200, teachers } : { status: 204 };
}
exports.getTeacher = async (req) => {
	if (!req.body.teacher_id) { return { status: 400, message: 'no teacher_id' }; }

	let teacher = await teacherModel.getProfile(req.body.teacher_id),
		level = await levelModel.getAllLevels(),
		group = await teacherModel.getTeacherGroupList(req.body.teacher_id),
		shedule = await graphModel.getGraph(req.body.teacher_id),
		balance = await balanceModel.get(req.body.teacher_id);
	
	return teacher ? { status: 200, teacher, level, group, shedule, balance } : { status: 204 };
} 



exports.updateGraph = async (req) => {
	if(!req.body.graph) return {status: 418, message: 'no graph'}
	let graph
	try {
		graph = JSON.parse(req.body.graph)
		
	} catch(err) {
		return {status: 418, message: 'invalid json format'}
	}


	if(!graph.length) return {status: 418, message: 'no graph'}

	for(i=0; i<graph.length; i++) {
	console.log('graph', graph[i])
		if(!graph[i].start && graph[i].start !== 0) 	return {status: 418, message: 'losted start'}
		if(!graph[i].end && graph[i].end !== 0) return {status: 418, message: 'losted end'}
		if(!graph[i].nday && graph[i].nday !== 0)		return {status: 418, message: 'losted nday'}
	}

	await graphModel.deleteGraph(req.body.teacher_id)
	// if (!deleted) throw new Error('Can\'t deleted graph graphModel.deleteGraph') 

	console.log('graph', graph)

	for(i=0; i<graph.length; i++) {
		let inserted = await graphModel.createGraph(req.body.teacher_id, graph[i].start, graph[i].end, graph[i].nday)
			
		console.log('inserted', inserted)



		if (!inserted) { 
			throw new Error('Can\'t inserted graph graphModel.createGraph') 
		}

	}
	
	return {status: 200 }
}


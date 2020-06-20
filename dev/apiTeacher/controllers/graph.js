let graphModel = require('../../apiModels/graph')

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
		if(!graph[i].finish && graph[i].finish !== 0) return {status: 418, message: 'losted finish'}
		if(!graph[i].nday && graph[i].nday !== 0)		return {status: 418, message: 'losted nday'}
	}

	await graphModel.deleteGraph(req.body.myId)
	// if (!deleted) throw new Error('Can\'t deleted graph graphModel.deleteGraph') 

	console.log('graph', graph)

	for(i=0; i<graph.length; i++) {
		let inserted = await graphModel.createGraph(req.body.myId, graph[i].start, graph[i].finish, graph[i].nday)
			
		console.log('inserted', inserted)



		if (!inserted) { 
			throw new Error('Can\'t inserted graph graphModel.createGraph') 
		}

	}
	
	await writeAction(`Преподаватель ${req.body.myName} изменил(-а) график работы.`)

	return {status: 200 }
}

exports.getGraph = async (req) => {

	let graph = await graphModel.getGraph(req.body.myId);

	console.log(graph)
 

	return { status: 200, graph }
}

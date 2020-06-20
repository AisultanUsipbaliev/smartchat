let reqModel 		= require('../../apiModels/request')
let rateModel 		= require('../../apiModels/rate')
let studentModel 	= require('../../apiModels/student')
let amocrmModel 	= require('../../apiModels/amocrm')
let groupModel 		= require('../../apiModels/group')
exports.getRates = async function (req) {
	let reqs 	= await reqModel.getMyReqs(req.body.myId)
	let deal 	= await amocrmModel.getDeal(req.body.myId)
	let student = await studentModel.getStudent(req.body.myId)
	let group 	= null
	
	if(student.group_id)
		group = await groupModel.getGroup(student.group_id)
	
	let myRate 	= 0
	
	if(reqs.length) myRate = reqs[0].rate_id
	if(group) 		myRate = group.rate_id
		
	if(req.body.rate_id) {

		let rate = await rateModel.getActiveRate(req.body.rate_id)
		if(deal)
			if(deal.stage == config.amocrm.passed) 
				rate.rate_cost = 5000 

		return {status: 200, rate, reqs, group: student.group_id}
	
	} else {

		let rates = await rateModel.getRates() 
				for(let i=0; i<rates.length; i++) {
					if(deal) 
						if(deal.stage == config.amocrm.passed && rates[i].rate_id == 2) rates[i].rate_cost = 5000 
					rates[i].mine = myRate == rates[i].rate_id
				}
		
		return {status: 200, rates, reqs, group: student.group_id}
	}
}
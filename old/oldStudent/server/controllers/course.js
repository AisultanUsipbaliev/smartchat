let model = require('../models/course');

exports.getCourses = async function (req) {
	let rateList = await model.getCoursesInfo()
	let deal = await model.getDeal(req.body.myId)

	if(deal) {
		if(deal.stage == config.amocrm.passed) 
			for(let i = 0; i<rateList.length; i++)
				if(rateList[i].rate_id == 2) rateList[i].rate_cost = 5000 
	}

	if(rateList.length > 0) {
		let userRate 	= await model.getUserRateFromReq(req.body.myId);
		let accept 		= await model.acceptToRequest(req.body.myId);
		return {status: 200, message: 'success', rateList, userRate, accept};
	} 	
	else return {status: 202, message: 'empty'};
}  

exports.getCourse = async function (req) {
	if (!req.body.rate_id)  	return {status: 418, message: 'no rate'};
	let accept = await model.acceptToRequest(req.body.myId);
	
	let level = await model.getMyLevel(req.body.myId);
	if(level == 8) accept = false;
	if(req.body.rate_id == 1) accept = true;
	
	if(accept) {
		let rateInfo = await model.getCoursesInfo(req.body.rate_id);
		let deal = await model.getDeal(req.body.myId)

		if(deal) {
			if(deal.stage == config.amocrm.passed && rateInfo.rate_id == 2)
				rateInfo.rate_cost = 5000 
		}
		
		if (rateInfo) 	return {status: 200, rateInfo};
		else 			return {status: 201, message: 'empty data'};
	}
	else return {status: 202, message: 'access denied'};
}

exports.checkMyLevel = async function(req) {
	let myLevel = await model.getMyLevel(req.body.myId);
	if(myLevel && myLevel != 8) return {status: 200, accept: true };
	else 						return {status: 202, accept: false }; 
} 

exports.checkNeedRequest = async function(req) {
	let check = await model.checkNeedRequest(req.body.myId);
	if(check) 	return {status: 202}
	else 		return {status: 200}	
}

exports.addLevel = async function(req) {
	let result = await model.addLevel(req.body.myId);
	if(result) 	return {status: 200}
	else 		return {status: 202}	
}
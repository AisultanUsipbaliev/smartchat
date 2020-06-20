let chartModel = require('../../apiModels/chart')

module.exports = async function() {
	try {
		await log('function cleanChart started')

		let expired = await chartModel.getExpiredChart((new Date()).valueOf())

		if(expired.length) 	await log('FOUNDED EXPIRED CHART: ', expired)
		else 				await log('NO EXPIRED CHART!')

		for(let i=0; i<expired.length; i++) {
			let deleted = await chartModel.delete(expired[i].chart_id)
			if(!deleted) log('DELETE EXPIRED CHART ERROR!', {}, true)
		}

		await log('function cleanChart is completed')
		
	} catch(ex) {
		await log('cleanChart error: ', {exeption: ex.message}, 1)
		sayMe('cleanChart', {}, ex.message)
	}
}
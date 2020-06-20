let axios = require('axios')

let trialReportModel = require('../../apiModels/trialReport') 

module.exports = async function(){
	try {
		let report = 'Отчет за прошедший день:'
		let select = await trialReportModel.getNotSended()

		for(let i=0; i<select.length; i++) {

			report += `\n\n---------------${Number(i+1)}---------------\n${select[i].content}`
			
			let updated = await trialReportModel.setSended(select[i].id)
			if(!updated) await log('Can\'t update -> trialReportModel.setSended', {toSend: select[i]}, 1)
		
		}
	
		if(select.length && config.production)
			await axios.post('https://api.telegram.org/bot737103729:AAEzrT-lpwFhqMuXG6IiVAOiDmDBgVPmeqM/sendMessage', {
				chat_id: -268478418,
				text: report
			})

	} catch(ex) {
		await cronLog('sendReport error: ', {exeption: ex.message}, 1)
	}
}
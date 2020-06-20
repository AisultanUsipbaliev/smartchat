let SQL = require('../../apiFunctions/query')

module.exports = async (req, res) => {
	try {
	
		let test = await SQL('select * from test_level')
		for(i=0; i<test.length; i++) delete test[i].correct
		res.status(200).json(test)	
	
	} catch(err) {
		console.error(err)
		sayMe('jobSmartchat/getTest', {}, err.message)
		res.sendStatus(405)
	}
	
}
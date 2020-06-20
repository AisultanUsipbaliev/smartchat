// controller
let student = require('../controllers/student'),
	teacher = require('../controllers/teacher'),
	user = require('../controllers/user'),
	rate = require('../controllers/rate'),
	file = require('../controllers/file'),
	logs = require('../controllers/logs'),
	settings = require('../controllers/settings'),
	billing = require('../controllers/billing'),
	chart = require('../controllers/chart'),
	group = require('../controllers/group');

module.exports = async function(req, res) { 
	try { 
		console.log((new Date().getUTCHours()))
		if (!req.body.method) return res.status(405).json({message: 'no method'})
		console.log(req.body)
		let result = null
		switch (req.body.method.toLowerCase()) {
			// student
			case 'get-students': 			result = await student.getStudents(req);				break //+
			case 'get-student': 			result = await student.getStudent(req);					break //+
			case 'stream-state': 			result = await student.streamState(req);				break //+
			// case 'find-student': 		result = student.findStudent(req);						break //-
			// case 'get-link': 			result = student.getLink(req);							break //-
			// case 'update-group': 		result = student.updateGroup(req);						break //-

			// teacher
			case 'get-teachers': 			result = await teacher.getTeachers(req);				break //+
			case 'get-teacher': 			result = await teacher.getTeacher(req);					break //+
			case 'update-teacher-shedule': 	result = await teacher.updateGraph(req);				break //+
			// case 'find-teacher': 		result = teacher.findTeacher(req);						break //-

			// user
			case 'block-user': 				result = await user.blockUser(req);						break //+
			case 'delete-user': 			result = await user.deleteUser(req);					break //+
			case 'reset-password':  		result = await user.resetPassword(req);					break //+
			case 'sms-on': 					result = await user.smsMessages(req);					break //+
			case 'email-on': 				result = await user.emailMessages(req);					break //+
			case 'phone-status': 			result = await user.phoneStatus(req);					break //+
			case 'email-status': 			result = await user.emailStatus(req);					break //+
			case 'change-level': 			result = await user.changeLevel(req);					break //+
			case 'visit-history': 			result = await user.visitHistory(req);					break //+

			// rate
			case 'get-rates': 				result = await rate.getRates(req);						break //+
			case 'get-rate': 				result = await rate.getRate(req);						break //+
			case 'create-or-update-rate': 	result = await rate.createOrUpdateRate(req);			break //+
			case 'rate-status': 			result = await rate.rateStatus(req);					break //+
			case 'delete-rate': 			result = await rate.deleteRate(req);					break //+
			// case 'get-levels': 			result = rate.getLevels(req);							break //-
			// case 'find-rate': 			result = rate.findRate(req);							break //-
			
			//file
			case 'upload-file': 			result = await file.uploadFile(req);					break //+

			// chart
			case 'new-chart': 				result = await chart.newChart(req);						break //+
			case 'suitable-teachers': 		result = await chart.suitableTeachers(req);				break //+
			case 'create-or-update-chart': 	result = await chart.createOrUpdateChart(req);			break //+
			case 'delete-chart': 			result = await chart.deleteChart(req);					break //+
			// case 'create-chart': 			result = chart.createChart(req);					break //-

			// billing
			case 'get-billings': 			result = await billing.getBillings(req);				break //+
			case 'payment-statistics': 		result = await billing.paymentStatistics(req);			break //+

			// logs
			case 'get-logs': 				result = await logs.getLogs(req);						break //+
			// case 'find-logs': 			result = logs.findLogs(req);							break //-
			case 'delete-log': 				result = await logs.deleteLog(req);						break

			// settings
			case 'get-settings': 			result = await settings.getSettings(req);				break //+
			case 'update-settings': 		result = await settings.updateSettings(req);			break //+
			case 'update-password': 		result = await settings.updatePassword(req);			break //+
			case 'update-messages': 		result = await settings.updateMessages(req);			break //+
			case 'get-messages': 			result = await settings.getMessages(req);				break //+

			// groups
			// case 'get-groups': 			result = group.getGroups(req);							break //-
			case 'change-rate': 			result = await group.updateRate(req);					break //+
			case 'change-teacher': 			result = await group.updateTeacher(req);				break //+

			case 'logout': 					
				result = { status: 200 } 								
				req.session.destroy()
			break

			default: 						result = { status: 405, message: 'invalid method'};	break
		}

		console.log(result)
		res.status(result.status).json(result)

	}  catch (err) {

		console.error(err)
		sayMe('Admin/api', req.body, err.message)
		res.status(500).json({err: 'Server error :('})
	
	}
} 
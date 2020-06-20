let fs 		= require('fs')

let contentModel 	= require('../../apiModels/content'),
	chatModel	 	= require('../../apiModels/chat'),
	reportModel		= require('../../apiModels/report'),
	sertificatModel = require('../../apiModels/sertificat'),
	teacherModel 	= require('../../apiModels/teacher'),
	studentModel 	= require('../../apiModels/student')

let ignore = ['avatar.jpg']

module.exports = async () => {
	try {
		await log('function clearFiles started')
		await fs.readdir('./../files/files/', async (err, files) => {
			
			for (i=0; i<files.length; i++) {

				if(ignore.indexOf(files[i]) > -1) {
					await log('Ignored ' + files[i])
					continue
				}

				let temp		= await contentModel.findFile(files[i])
				let chat 		= await chatModel.findFile(files[i])
				let report 		= await reportModel.findFile(files[i])
				let sertificat 	= await sertificatModel.findFile(files[i])
				let teacher 	= await teacherModel.findFile(files[i])

				if(!temp) 		await log('ClearFile error no temp', 		{temp}, 1)
				if(!chat) 		await log('ClearFile error no chat', 		{chat}, 1)
				if(!report) 	await log('ClearFile error no report', 		{report}, 1)
				if(!sertificat) await log('ClearFile error no sertificat', 	{sertificat}, 1)
				if(!teacher)	await log('ClearFile error no teacher', 	{teacher}, 1)

				if(!temp.length 
					&& !chat.length 
					&& !report.length 
					&& !sertificat.length 
					&& !teacher.length) 
					await deleteFile('./../files/files/' + files[i])
			}
		})

		await fs.readdir('./../files/photo/', async (err, files) => {
			for (i=0; i<files.length; i++) {

				if(ignore.indexOf(files[i]) > -1) {
					await log('Ignored ' + files[i])
					continue
				}

				let teacher = await teacherModel.findAva(files[i])
				let student = await studentModel.findAva(files[i])
 
				if(!teacher) await log('ClearFile error no teacher', {teacher}, 1)
				if(!student) await log('ClearFile error no student', {student}, 1)

				if(!teacher.length && !student.length) 
					await deleteFile('./../files/photo/' + files[i])
			}
		})

		await log('function clearFiles is completed')
	} catch(ex) {
		await log('clearFiles error: ', {exeption: ex.message}, 1)
	}
}

async function deleteFile(name) {
	// await fs.unlinkSync(name)
	await log('FILE '+name+' was deleted')
}
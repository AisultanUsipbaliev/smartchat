let fs 			= require('fs')
let pdf 		= require('html-pdf')
let translit 	= require('cyrillic-to-translit-js')

let dateFormat = require('../../apiFunctions/dateFormat')

let studentModel	= require('../../apiModels/student'),
	sertificatModel = require('../../apiModels/sertificat')

module.exports = async function(student) {
	await log(`createSertificat started for student #${student.student_id}`)
	try {
		let date = new Date()
		let studentId 		= student.student_id
		let rate 			= await studentModel.getStudentRate(studentId)
		if(!rate) 			throw new Error('no rate')
		let level 			= await studentModel.getStudentLevel(studentId)
		if(!level) 			throw new Error('no level')
		let sertificats 	= await sertificatModel.getAll()
		if(!sertificats) 	throw new Error('no sertificats')

		let firstname 	= student.firstname && student.firstname.trim().length	? student.firstname.trim()		: ''
		let lastname 	= student.lastname 	&& student.lastname.trim().length	? student.lastname.trim() + ' ' : '' 
		
		let name = lastname + firstname

		let n = sertificats.length + 1
		if(n > 9 && n <= 99) 	n = '0' + n
		else if(n < 10) 		n = '00' + n  

		let number = date.getFullYear() + '-' + n

		await createSertificat(studentId, rate.id, name, level.name, number)
		await log('createSertificat finished')
	} catch(ex) {
		await log('createSertificat error: '+ex.message, {}, 1)
		sayMe('createSertificat', {}, ex.message)
	}
	
}

async function createSertificat(studentId, rateId, name, level, number) {
	
	console.log('sertificat')

	let date = await dateFormat('dd.mm.yyyy')
	let html = await fs.readFileSync('./src/certificat.html', 'utf8')
	let options = { format: 'A4', orientation: 'Landscape' }

	html = html.replace('${name}', 		translit().transform(name))
	html = html.replace('${date}', 		translit().transform(date))
	html = html.replace('${level}', 	translit().transform(level))
	html = html.replace('${number}', 	number)
	for(z=0; z<5;z++) html = html.replace('${service}', 	config.studentHostname)
	console.log('html: ', html)
	let sertificat = (new Date()).valueOf() + '.pdf'

	pdf.create(html, options).toFile('../files/files/' + sertificat, async (err, res) => {
		if(err) {
			sayMe('create sertificat', {}, err.message)
			await log(`createSertificat error: ${err.message}`, {}, 1)
			return
		}

		if(await sertificatModel.add(studentId, rateId, sertificat)) {
			log(`created sertificat ${sertificat} for student #${studentId}`)
			writeAction(`Студент ${name} получил(-а) сертификат ${config.hostname}/common/files/${sertificat}`)
		} else {
			await log('createSertificat error: Cant\' insert it', {}, 1)
			sayMe('create sertificat', 'I can\' insert it. student #' + studentId)
		}
	})
}


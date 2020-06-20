let balanceModel = require('../../apiModels/balance'),
	teacherModel = require('../../apiModels/teacher')

let dateFormat  = require('../../apiFunctions/dateFormat')

exports.getBalance = async (req) => {

	if(req.body.begin && req.body.end) {

		if (!Number(req.body.begin)) return { status: 400, message: 'invalid begin'} 
		if (!Number(req.body.end)) return { status: 400, message: 'invalid end'} 

		let begin = await dateFormat('yyyy-mm-dd HH:SS:MS', (new Date(Number(req.body.begin))))
		let end = await dateFormat('yyyy-mm-dd HH:SS:MS', (new Date(Number(req.body.end))))

		let balances = await balanceModel.getBetween(req.body.myId, begin, end)

		let minus = 0
		let plus = 0

		for (let i = 0; i < balances.length; i++) {
			if (balances[i].amount>0) {
				plus += balances[i].amount
			} else {
				minus -= balances[i].amount
			}
		}

		return {
			status: 200, 
			balance: balances,
			minus: minus, 
			plus: plus,
		}
	}

	else return {
		status: 200, 
		balance: await balanceModel.get(req.body.myId)
	}
}

exports.getBalanceReport = async (req, res) => {
	if (!req.body.begin) res.status(400).json({ status: 400, message: 'begin is not defined' }); 
	if (!req.body.end) res.status(400).json({ status: 400, message: 'end is not defined' }); 
	if (!Number(req.body.begin)) res.status(400).json({ status: 400, message: 'invalid begin' }); 
	if (!Number(req.body.end)) res.status(400).json({ status: 400, message: 'invalid end' }); 

	let excel = require('excel4node');
	let workbook = new excel.Workbook();
	let worksheet = workbook.addWorksheet('Sheet 1');

	let style = {font: {size: 14}}

	let begin = await dateFormat('yyyy-mm-dd HH:SS:MS', (new Date(Number(req.body.begin)))),
		beginShort = await dateFormat('yyyy.mm.dd', (new Date(Number(req.body.begin))));
	let end = await dateFormat('yyyy-mm-dd HH:SS:MS', (new Date(Number(req.body.end)))),
		endShort = await dateFormat('yyyy.mm.dd', (new Date(Number(req.body.end))));

	let balances = await balanceModel.getBetween(req.body.myId, begin, end)

	let user = await teacherModel.getProfile(req.body.myId)

	if (!user) res.sendStatus(404)

	worksheet.cell(1,1,1,4, true).string(`${user.login} ${user.lastname}`).style(style)		
	worksheet.cell(2,1,2,4, true).string(`Выписка ${beginShort}-${endShort}`).style(style)

	let col = 5

	worksheet.column(2).setWidth(10)
	worksheet.cell(4,1).string('№').style(style)

	worksheet.column(2).setWidth(70)
	worksheet.cell(4,2).string('Событие').style(style)

	worksheet.cell(4,3).string('Сумма').style(style)
	
	worksheet.column(4).setWidth(30)
	worksheet.cell(4,4).string('Дата').style(style)

	for (let i = 0; i < balances.length; i++) {

		worksheet.cell(col+i,1).number(i+1).style(style)

		worksheet.cell(col+i,2).string(`${balances[i].comment}`).style(style)
		
		worksheet.cell(col+i,3).number(balances[i].amount).style(style)

		let dt = await dateFormat('yyyy-mm-dd HH:SS:MS', (new Date(Number(balances[i].dt))))

		worksheet.cell(col+i,4).string(dt).style(style)

	}

	worksheet.cell(col+balances.length,2).string('Итого').style(style)
	worksheet.cell(col+balances.length,3).formula(`СУММ(C${col}:C${col+balances.length-1})`).style(style)

	workbook.write('Excel.xlsx', res)
	
}
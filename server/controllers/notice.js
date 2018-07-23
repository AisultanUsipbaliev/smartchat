let model = require('../models/notice');

exports.Get = async function(index)
{
	try
	{
		let selected = await model.Selected({index})
		let select_req = await model.SelectReq({index})
		let select_sms = await model.SelectSms({index})
		let select_tests = await model.SelectTests({index})
		let deleted = await model.Deleted({index})
		let select_graph = await model.SelectGraph({index})

		return {status: 200, notice: selected, req_count: select_req.length, sms_count: select_sms.length, tests: select_tests.length, graph: select_graph.length};
	}
	catch (err)
	{
		return {status: 418, message: err}
	}
}


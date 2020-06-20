let router 	= require('express').Router();
let SQL 	= require('../database/query');

router.get('/tests', async function(req,res) 		{ res.render('./../../mobile/views/test/tests', {version: config.version}); });
router.get('/chat', function(req,res) 				{ res.render('./../../mobile/views/chat', {version: config.version}); });
router.get('/courses', async function(req,res) 		{ res.render('./../../mobile/views/courses', {version: config.version}); });
router.get('/homeworks', async function(req,res) 	{ res.render('./../../mobile/views/homeworks/homeworks', {version: config.version}); });
router.get('/profile', async function(req,res) 		{ res.render('./../../mobile/views/profile', {version: config.version}); });
router.get('/redact', async function(req,res) 		{ res.render('./../../mobile/views/redact', {version: config.version}); });
router.get('/request/:id', async function(req,res) 	{ res.render('./../../mobile/views/request', {version: config.version}); });
router.get('/schedule', function(req,res) 			{ res.render('./../../mobile/views/schedule', {version: config.version}); });
router.get('/feedback', function(req,res) 			{ res.render('./../../mobile/views/feedback',{version: config.version}); });
router.get('/', async function(req,res) 			{ res.render('./../../mobile/views/profile', {version: config.version}); });
router.get('/group', async function(req,res) 		{ res.render('./../../mobile/views/group', {version: config.version}); });
router.get('/homework/:id', async function(req,res)
	{
		if (await checkStudentHomeworks(req)) 		{ res.render('./../../mobile/views/homeworks/homework', {version: config.version}); }
		else										res.redirect('/homeworks');
	});
router.get('/testresult/:id', async function(req,res)
	{
		if(await checkStudentTests(req))			{ res.render('./../../mobile/views/test/testresult', {version: config.version}); }
		else										res.redirect('/tests');
	});
router.get('/test/:id', async function(req,res)
	{
		if(await checkStudentTests(req)) 
			if (!await checkTestResult(req)) 		{ res.render('./../../mobile/views/test/test', {version: config.version}); }
			else				 					res.redirect('/testresult/' + req.params.id);
		else										res.redirect('/tests');
	});
router.get('/leveltest', async function(req,res)
	{

		if(await checkStudentlevel(req))			{ res.render('./../../mobile/views/test/leveltest', {version: config.version}); }
		else										res.redirect('/profile');
	});

module.exports = router;


async function checkStudentHomeworks(req) {
	return (await SQL(`select template from homework where student = ? and template = ?`, [req.cookies.SAI, req.params.id])).length > 0?
	true : false;
}

async function checkStudentTests(req) {
	return (await SQL(`select test_id from result where student_id = ? and test_id = ?`,[req.cookies.SAI, req.params.id])).length > 0? 
	true : false;
}

async function checkTestResult(req) {
	return (await SQL('select answers from result where student_id = ? and test_id = ?', [req.cookies.SAI, req.params.id]))[0].answers;
}

async function checkStudentlevel(req) {
	return (await SQL(`select lvl from student where student_id = ?`,[req.cookies.SAI]))[0].lvl == 8 ? true : false ;
}
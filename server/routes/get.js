let app = require('express').Router();

//account
	app.get('/', function(req,res)
		{       
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
			else res.render('./../../views/cabinet/profile',{})
		});

	app.get('/login', function(req,res)
		{
			res.render('./../../views/account/login',{});
		});

	app.get('/registration', function(req,res)
		{
			res.render('./../../views/account/registration',{});
		});

//cabinet
	app.get('/graph', function(req,res)
		{
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
			else 
			{
				console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "GRAPH"');
				res.render('./../../views/cabinet/graph',{})
			}
		});

	app.get('/profile', function(req,res)
		{
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
			else 
			{
				console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "PROFILE"');
				res.render('./../../views/cabinet/profile',{})
			}
		});

	app.get('/template', function(req,res)
		{
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
			else 
			{
				console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "TEMPLATE"');
				res.render('./../../views/cabinet/template',{})
			}
		});

	app.get('/schedule', function(req,res)
		{
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
			else 
			{
				console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "SCHEDULE"');
				res.render('./../../views/cabinet/schedule',{})
			}
		});

	app.get('/redact', function(req,res)
		{
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
			else 
			{
				console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "REDACT"');
				res.render('./../../views/cabinet/redact',{})
			}
		});

//students
	app.get('/requests', function(req,res)
		{
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
			else
			{ 
				console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "REQUESTS"');
				res.render('./../../views/students/requests',{});
			}
		});
	app.get('/chat', function(req,res)
		{
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
			else 
			{
				console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "CHAT"');
				res.render('./../../views/students/chat',{})
			}
		});
	app.get('/student', function(req,res)
		{
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
			else
			{
				console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "STUDENTS"');
				res.render('./../../views/students/students',{});
			}
		});

	app.get('/group', function(req,res)
		{
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
			else
			{
				console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "GROUP"');
				res.render('./../../views/students/group',{});
			}
		});

//tests
	app.get('/test', (req,res)=> 
	{
		if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
		else 
		{
			console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "TEST"');
			res.render('./../../views/test/test',{});
		}
	});
	app.get('/result', (req,res)=> 
	{
		if(!req.cookies['SAI']) res.render('./../../views/account/login',{});
		else 
		{
			console.log(req.cookies['SAI'] + ':' + req.cookies['SAI'] + '  on page "RESULT"');
			res.render('./../../views/test/result',{});
		}
	});

module.exports = app;
let router 	= require('express').Router();

	//account
		router.get('/', function(req,res) {       
				if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
				else res.render('./../../views/cabinet/profile',{version: config.version})
			});

	//cabinet
		router.get('/graph', function(req,res) {
				if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
				else {
					console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "GRAPH"');
					res.render('./../../views/cabinet/graph',{version: config.version})
				}
			});

		router.get('/profile', function(req,res) {
				if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
				else {
					console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "PROFILE"');
					res.render('./../../views/cabinet/profile',{version: config.version})
				}
			});

		router.get('/template', function(req,res) {
				if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
				else {
					console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "TEMPLATE"');
					res.render('./../../views/cabinet/template',{version: config.version})
				}
			});

		router.get('/schedule', function(req,res) {
				if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
				else {
					console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "SCHEDULE"');
					res.render('./../../views/cabinet/schedule',{version: config.version})
				}
			});

		router.get('/redact', function(req,res) {
				if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
				else {
					console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "REDACT"');
					res.render('./../../views/cabinet/redact',{version: config.version})
				}
			});

	//students
		router.get('/requests', function(req,res) {
				if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
				else { 
					console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "REQUESTS"');
					res.render('./../../views/students/requests',{version: config.version});
				}
			});
		router.get('/chat', function(req,res) {
				if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
				else {
					console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "CHAT"');
					res.render('./../../views/students/chat',{version: config.version})
				}
			});
		router.get('/student', function(req,res) {
				if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
				else {
					console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "STUDENTS"');
					res.render('./../../views/students/students',{version: config.version});
				}
			});

		router.get('/group', function(req,res) {
				if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
				else {
					console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "GROUP"');
					res.render('./../../views/students/group',{version: config.version});
				}
			});

		router.get('/bauka', function(req,res) {
			if(!req.cookies['SAI']) res.render('./../../views/account/login', {version: config.version});
			else {
				res.render('./../../views/bauka', {version: config.version});
			}
		});

	//tests
		router.get('/test', (req,res)=> {
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
			else {
				console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "TEST"');
				res.render('./../../views/test/test',{version: config.version});
			}
		});
		router.get('/creater', (req,res)=> {
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
			else {
				console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "CREATER"');
				res.render('./../../views/test/creater',{version: config.version});
			}
		});
		router.get('/result', (req,res)=> {
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
			else {
				console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "RESULT"');
				res.render('./../../views/test/result',{version: config.version});
			}
		});
		router.get('/testresult', (req,res)=> {
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
			else {
				console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "TESTRESULT"');
				res.render('./../../views/test/testresult',{version: config.version});
			}
		});

	//homeworks
		router.get('/homeworks', (req,res)=> {
			if(!req.cookies['SAI']) res.render('./../../views/account/login',{version: config.version});
			else {
				console.log(req.cookies.SAT + ':' + req.cookies['SAI'] + '  on page "ReSULTHOMEWORKS"');
				res.render('./../../views/homework/result',{version: config.version});
			}
		});

module.exports = router;
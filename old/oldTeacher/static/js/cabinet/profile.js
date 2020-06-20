POST('/teacher', 'method=INFO', (req)=>
	{
		let res = JSON.parse(req.response);
		if(req.status == 200)
		{
			let body = res.body;

			document.getElementById('myPhoto').src = body.ava? 'common/photo/' + body.ava:  'static/img/avatar.jpg';
			document.getElementById('myName').innerHTML = body.login + ' ' + body.lastname; 
			document.getElementById('myLvl').innerHTML = body.lvl_name;
			document.getElementById('myEmail').innerHTML = body.email;
			document.getElementById('myTel').innerHTML = body.phone;
		}
		else
		{
			console.log(res);
		}	
	});

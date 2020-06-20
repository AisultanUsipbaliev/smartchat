document.getElementById('login_btn').addEventListener('click', function(event)
	{
		document.getElementById('err').innerHTML = "";
		event.preventDefault();
		let params = 
			'method=' 		+ 'LOGIN'+
			'&&email=' 		+ document.getElementById('username').value+
			'&&pass=' 		+ document.getElementById('pass').value;
		 
		let req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				let res = JSON.parse(req.response);
				if(req.status == 200)
				{
					top.location.href = '/';
				}else if(req.status === 201){
					top.location.href = '/activate';
				}
				else
				{
					document.getElementById('err').innerHTML = res.message;
				}
			}
		}
		req.open('POST','/account');
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.send(params);
	});
	
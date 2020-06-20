if(getCookie('SAA')){
	document.getElementById('login_btn').click();
	deleteCookie('SAA');
}

function getCookie(name)
{
  return document.cookie.split(name+'=')[1].split(';')[0];
}

function setCookie(name, value, options) 
{
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) 
  {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) 
  {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) 
  {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) 
    {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) 
{
  setCookie(name, "", 
  {
    expires: -1
  });
}

function sendMes(){
	let req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				let res = JSON.parse(req.response);
				if(req.status == 200)
				{
					document.getElementById('err').style.color = "lightgreen";
					document.getElementById('err').innerHTML = 'Письмо отправленно';	
					document.getElementById('login_btn').style.display = 'none';	
				}
				else
				{
					document.getElementById('err').style.color = "red";
					document.getElementById('err').innerHTML = res.message;
				}
			}
		}
	req.open('POST','/account');
	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	req.send('method=REPEAT');
}

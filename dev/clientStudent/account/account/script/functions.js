function POST(route, params, funct)
{
  let req = new XMLHttpRequest();
  req.onreadystatechange = function()
  {
    if(req.readyState == 4) 
    {
        let res = JSON.parse(req.response);
        funct(res, req.status);
    }
  }
  req.open("POST", route);
  req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  req.send(params);
}

	//Login with icons
window.fbAsyncInit = function() {
  FB.init({
    appId      : '295560271074472',
    cookie     : true,
    xfbml      : true,
    version    : 'v3.2'
  });
    
  FB.AppEvents.logPageView();   
    
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

function authFb() { 
    FB.getLoginStatus(function(response) {
        if(response.status != 'connected') FB.login()
        else {
          response = response.authResponse          
          POST(`https://graph.facebook.com/${response.userID}`, `fields=name,birthday,email,first_name,last_name,picture&access_token=${response.accessToken}`, (res,stat) => {

            POST('/account', `method=SOCIAL&firstname=${res.first_name}&lastname=${res.last_name}&ava=${res.picture.data.url}&sid=${res.id}&token=${response.accessToken}&type=0`, (res, stat) => {
              if(stat == 200) top.location.href = '/'
            })
          })
        }
    });
}

function authVk() {
  POST('/account', `method=VK-URL`, (res, stat)=> {
    top.location.href = res.redirect
  })
}

function authMail() {
  POST('/account', `method=MAIL-URL`, (res, stat)=> {
    top.location.href = res.redirect
  })
}

var user;
var haveUser = true;
function authG(_user) {
  user = _user
  if(!haveUser)
  POST('/account', `method=SOCIAL&firstname=${user.w3.ofa}&lastname=${user.w3.wea}&photo=${user.w3.Paa}&sid=${user.w3.Eea}&token=${user.Zi.id_token}&type=3`, (res, stat) => {
    if(stat == 200) top.location.href = '/'
  })
}

function reallyAuth() {
  console.log(user)
  if(user) POST('/account', `method=SOCIAL&firstname=${user.w3.ofa}&lastname=${user.w3.wea}&photo=${user.w3.Paa}&sid=${user.w3.Eea}&token=${user.Zi.id_token}&type=3`, (res, stat) => {
    if(stat == 200) top.location.href = '/'
  }) 
  else document.querySelector('.g-signin2').click()
}

setTimeout(()=>{
  if(!user) {
    if(document.getElementById('fuckin-google'))document.getElementById('fuckin-google').style.display= 'block';
    if(document.getElementById('googleButton'))document.getElementById('googleButton').style.display= 'none';
    haveUser = false
  }
}, 1000)

//cookies
function getCookie(name){
  try {
   return document.cookie.split(name+'=')[1].split(';')[0];
  }
  catch(ex)
  {
    return null;
  }
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

function convertPlus(item){
  let countryCode = '';
  for (var i = 0; i < item.length; i++) {
    if(item[i] == '+') countryCode += '%2B';
      else countryCode += item[i];
  }
  return countryCode;
}


function showErr(mistake, msg, color) {
  if(!color) color = 'red';
  mistake.style.display = 'block';
  mistake.style.color = color;
  mistake.innerHTML = msg;
}


function hideErr(mistake) {
  mistake.style.display = 'none';
}

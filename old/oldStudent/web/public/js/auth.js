window.fbAsyncInit = function() {
  FB.init({
    appId      : '568283626968930',
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
            POST('/account', `method=FB&firstname=${res.first_name}&lastname=${res.last_name}&ava=${res.picture.data.url}&sid=${res.id}&token=${response.accessToken}`, (res, stat) => {
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

function authTg(user) {
  console.log(user)
  POST('/account', `method=TG&firstname=${user.first_name}&lastname=${user.last_name}&ava=${user.photo_url}&sid=${user.id}&token=${user.hash}`, (res, stat) => {
    if(stat == 200) top.location.href = '/'
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
  POST('/account', `method=GOOGLE&firstname=${user.w3.ofa}&lastname=${user.w3.wea}&photo=${user.w3.Paa}&sid=${user.w3.Eea}&token=${user.Zi.id_token}`, (res, stat) => {
    if(stat == 200) top.location.href = '/'
  })
}

function reallyAuth() {
  console.log(user)
  if(user) POST('/account', `method=GOOGLE&firstname=${user.w3.ofa}&lastname=${user.w3.wea}&photo=${user.w3.Paa}&sid=${user.w3.Eea}&token=${user.Zi.id_token}`, (res, stat) => {
    if(stat == 200) top.location.href = '/'
  }) 
  else document.querySelector('.g-signin2').click()
}

setTimeout(()=>{
  if(!user) {
    document.getElementById('fuckin-google').style.display= 'block';
    document.getElementById('googleButton').style.display= 'none';
    haveUser = false
  }
}, 1000)
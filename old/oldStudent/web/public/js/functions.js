function getCookie(name)
{
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

function deleteCookie(name) 
{
  setCookie(name, "", 
  {
    expires: -1
  });
}

function POST(route, params, funct)
{
  let req = new XMLHttpRequest();
  req.onreadystatechange = function()
  {
    if(req.readyState == 4) 
    {
      if(req.status == 404) getNotFoundPage();
      else
      {
        let res = JSON.parse(req.response);
        funct(res, req.status);
      }
    }
  }
  req.open("POST", route);
  req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  req.send(params);
}

function sendFile(route, file, callback, name)
{
  let req = new XMLHttpRequest();
  let fd = new FormData();
  if(name) fd.append( 'name', name);
  fd.append( 'uploadFile', file);
  req.onreadystatechange = function()
  {
    if(req.readyState == 4) 
    {
      let res = JSON.parse(req.response);
      callback(res);
    }
  }
  req.open("POST", route, true);
  req.send(fd);
}

function uploadFile(route, file, data, callback)
{
  let req = new XMLHttpRequest();
  let fd = new FormData();
  fd.append( 'uploadFile', file );
  fd.append( 'method', data.method );
  fd.append( 'data', JSON.stringify(data) );
  req.onreadystatechange = function()
  {
    if(req.readyState == 4) 
    {
      let res = JSON.parse(req.response);
      callback(res);
    }
  }
  req.open("POST", route, true);
  req.send(fd);
}

setTimeout( function() { 
  window.screen.orientation.onchange = function() {
    changeOrientation()
  }
},0)

function getDateFormatDMY(d) 
{
  let date = new Date(d);
  let dd = date.getDate();
  let mm = date.getMonth()+1;
  let yyyy = date.getFullYear();

  if(dd<10) dd='0'+dd;
  if(mm<10) mm='0'+mm;

  date = dd+'.'+mm+'.'+yyyy;
  return date;
}

// Функция генегирует произвольную строку
function makeid() 
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// Функция возвращает время по секундам
function getTime(sec)
{
  let time = '';
  let min   = Math.round(sec / 60); 
  let hour  = Math.round(min / 60); 

  while(min >= 60)
  {
    min -= 60; 
  }

  sec = Math.round(sec);
  while(sec >= 60)
  {
    sec -= 60;
  }

  if(hour > 0) time = time + hour + ':';

  if(min > 9) time = time + min + ':';
  else time = time + '0' + min + ':';

  if(sec > 9) time += sec;
  else time += '0'+ sec;

  return time;
}

// Функция определяющая тип файла
function getFileType(file)
{
  let type = file.type.split('/')[0];
  switch(type)
  {
    case 'image':   return 2;
    case 'audio':   return 3;
    case 'video':   return 5;
    default:    return 4;
  }
}

function returnerTime(time){
  let minuts = 0;
  let seconds = 0;
  if(time > 60)
  while(time > 60){
    minuts++;
    time -= 60;
  }
  seconds = time;
  if(minuts < 10) minuts = '0' + minuts;
  if(seconds < 10) seconds = '0' + seconds;
  return minuts + ':' + seconds;
}

function sound(i)
{
  let audio = new Audio();
  switch(i)
  {
    case 1: 
    audio.src = '/aud/pop.mp3';
    break;
    case 2:
    audio.src = '/aud/notif.wav';
    break;
  }
  audio.play();
}

// Время для клиента
function getTimeDifference(time) {
  let res = Number(time) + (new Date()).getHours() - (new Date()).getUTCHours();
  if(res > 24) res  -= 24
  if(res < 0) res   += 24
  return (new Date()).getHours() - (new Date()).getUTCHours() < 12?  res : time + '(UTC+06)'
}

//Время для сервера
function getServerTime(time) {
  let res = Number(time) - (new Date()).getHours() + 6 + (new Date()).getUTCHours()
  if(res > 24) res  -= 24
  if(res < 0) res   += 24
  return res
}

function createLoad(){
  let bg = document.createElement('img')
  bg.src = "/img/2.svg";
  bg.id = 'img_load';
  bg.classList.add('loadIMG')
  document.body.appendChild(bg);
}

function deleteLoad(){
  document.body.removeChild(document.getElementById('img_load'))
}
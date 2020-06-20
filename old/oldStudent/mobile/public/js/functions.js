function FOR(mas, funct)
{
	for(let i=0; i<mas.length; i++)
	{
		funct(mas[i], i);
	}
}

function getCookie(name)
{
  if(document.cookie) return document.cookie.split(name+'=')[1].split(';')[0];
  else return null; 
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
			let res = JSON.parse(req.response);
			funct(res, req.status);	
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
  if(name) fd.append('name', name);
  fd.append( 'uploadFile', file);
  req.onreadystatechange = function()
  {
    if(req.readyState == 4) 
    {
      let res = JSON.parse(req.response);
      callback(res);
    }
  }
  req.open("POST", route);
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
  req.open("POST", route);
  req.send(fd);
}

setTimeout(function(){
  // window.addEventListener('deviceorientation', orientation, false);
  window.screen.orientation.onchange = function(){
    // alert(window.screen.orientation.type)
    changeOrientation()
  }
},0)

// function orientation(e){
      // alert(window.orient)
      // if (window.orient == 'portrait') orientationMobile();
      // else orientationWeb();
  // }

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

// Функция возвращает время 
  function getDateName(d)
  {
    let now = new Date();
    let date = new Date(d);

    let m = date.getMonth() + 1;
    let string = date.getDate() + "." + m + "." + date.getFullYear();

    if(now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth())
    {
      if(now.getDate() == date.getDate())
      {
        if(date.getHours() == now.getHours())
        {
          if(date.getMinutes() == now.getMinutes())
          {
            return 'только что';
          }
          else
          {
            let difference = now.getMinutes() - date.getMinutes();
            if(difference < 2) return 'минуту назад';
            else if(difference > 1 && difference < 5) return  difference + ' минуты назад';
            else if(difference > 4 && difference <21) return difference + ' минут назад';
            else if(difference >20)
            {
              if(difference%10 < 5 && difference%10 != 0)
              {
                if(difference%10 == 1) return  difference + ' минуту назад';
                else return difference + ' минуты назад';
              }
              else
              {
                return difference + ' минут назад';
              }
            }
          }
        }
        else
        {
          let difference = now.getHours() - date.getHours();
          if(difference == 1)
          {
            return 'час назад';
          }
          else if(difference > 1 && difference < 5)
          {
            return difference + ' часа назад';
          }
          else if(difference >= 5 && difference < 21)
          {
            return difference + ' часов назад';
          }
          else if(difference==21)
          {
            return difference + ' час назад';
          }
          else if(difference > 21)
          {
            return difference + ' часа назад';
          }
        }
      }
      else
      {
        let difference = now.getDate() - date.getDate();

        if(difference <= 3) 
        {
          if(difference == 1)
          {
            return 'вчера';
          }
          else
          {
            return difference + ' дня назад';
          }
        }
        else
        {
          return string;
        }

      }
    }
    else
    {
      return string;
    }
  }
  
function getInt(i) 
  {
    switch(i)
    {
      case 'a': return 1;
      case 'b': return 2;
      case 'c': return 3;
      case 'd': return 4;
      case 'e': return 5;
      case 'f': return 6;
      case 'g': return 7;
      case 'h': return 8;
      case 'i': return 9;
      case 'j': return 10;
      case 'k': return 11;
      case 'l': return 12;
      case 'm': return 13;
      case 'n': return 14;
      case 'o': return 15;
      case 'p': return 16;
      case 'q': return 17;
      case 'r': return 18;
      case 's': return 19;
      case 't': return 20;
      case 'u': return 21;
      case 'v': return 22;
      case 'w': return 23;
      case 'x': return 24;
      case 'y': return 25;
      default: return 26;
    }
  }

function getChar(i) 
  {
    switch(i)
    {
      case 1: return 'a';
      case 2: return 'b';
      case 3: return 'c';
      case 4: return 'd';
      case 5: return 'e';
      case 6: return 'f';
      case 7: return 'g';
      case 8: return 'h';
      case 9: return 'i';
      case 10: return 'j';
      case 11: return 'k';
      case 12: return 'l';
      case 13: return 'm';
      case 14: return 'n';
      case 15: return 'o';
      case 16: return 'p';
      case 17: return 'q';
      case 18: return 'r';
      case 19: return 's';
      case 20: return 't';
      case 21: return 'u';
      case 22: return 'v';
      case 23: return 'w';
      case 24: return 'x';
      case 25: return 'y';
      default: return 'z';
    }
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

function getTimeDifference(time) {
  let res = Number(time) + (new Date()).getHours() - 6 - (new Date()).getUTCHours();
  if(res > 24) res  -= 24
  if(res < 0) res   += 24
  return res
}
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
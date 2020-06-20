let getNormalDate = (oldDate, short, reverse) => {
	let date = new Date(oldDate);
	let now = new Date();
	if(reverse){
		if(date.getFullYear() === now.getFullYear() && !short)
			if(date.getMonth() === now.getMonth())
				if(date.valueOf() < now.valueOf() - (1000 * 60 * 5))
					return 'сейчас'
				else if(date.valueOf() <= now.valueOf() - (1000 * 60 * 60))
					return Math.round((now.valueOf() - date.valueOf()) / 60000) + ' мин.';
				else if(date.valueOf() <= now.valueOf() - (1000 * 60 * 120))
					return 'через час'
				else if(date.valueOf() <= now.valueOf() - (1000 * 60 * 180))
					return 'через два часа'

		if(short) return getFullMonth(date.getMonth()) + ' ' + checkOfNull(date.getDate()) + ', ' + date.getFullYear()
		else      return getFullMonth(date.getMonth()) + ' ' + checkOfNull(date.getDate()) + ', ' + date.getFullYear() + ' ' + checkOfNull(date.getHours()) + ':' + checkOfNull(date.getMinutes());
	}else{
		if(date.getFullYear() === now.getFullYear() && !short)
			if(date.getMonth() === now.getMonth())
				if(date.valueOf() >= now.valueOf() - (1000 * 60 * 5))
					return 'только что'
				else if(date.valueOf() > now.valueOf() - (1000 * 60 * 60))
					return Math.round((now.valueOf() - date.valueOf()) / 60000) + ' мин. назад';
				else if(date.valueOf() > now.valueOf() - (1000 * 60 * 120))
					return 'час назад'
				else if(date.valueOf() > now.valueOf() - (1000 * 60 * 180))
					return 'два часа назад'

		if(short) return getFullMonth(date.getMonth()) + ' ' + checkOfNull(date.getDate()) + ', ' + date.getFullYear()
		else      return getFullMonth(date.getMonth()) + ' ' + checkOfNull(date.getDate()) + ', ' + date.getFullYear() + ' ' + checkOfNull(date.getHours()) + ':' + checkOfNull(date.getMinutes());
	}
}

let getFullMonth = month => {
	switch(month){
		case 0: return 'Январь'; break;
		case 1: return 'Февраль'; break;
		case 2: return ' Март'; break;
		case 3: return 'Апрель'; break;
		case 4: return 'Май'; break;
		case 5: return 'Июнь'; break;
		case 6: return 'Июль'; break;
		case 7: return 'Август'; break;
		case 8: return 'Сентябрь'; break;
		case 9: return 'Октябрь'; break;
		case 10: return 'Ноябрь'; break;
		case 11: return 'Декабрь'; break;
	}
}

let checkOfNull = time => {
	return time < 10 ? '0' + time : time; 
}

let getFullWeekday = day => {
	switch(day){
		case 0: return 'Воскресенье';break
		case 1: return 'Понедельник';break
		case 2: return 'Вторник';break
		case 3: return 'Среда';break
		case 4: return 'Четверг';break
		case 5: return 'Пятница';break
		case 6: return 'Суббота';break
	}
}

let getShortWeekday = day => {
	switch(day){
		case 0: return 'Вс';break
		case 1: return 'Пн';break
		case 2: return 'Вт';break
		case 3: return 'Ср';break
		case 4: return 'Чт';break
		case 5: return 'Пт';break
		case 6: return 'Сб';break
	}
}

let getNameOfFile = type => {
	switch(type){
		case 2: return 'Фото'; break;
		case 3: return 'Аудио'; break;
		case 4: return 'Файл'; break;
		case 5: return 'Видео'; break;
		case 6: return 'Задание'; break;
		case 7: return 'Тест'; break;
	}
}

let toServer = time => {
	if(!time) return 'no time';

	let date = new Date();
	while (true)
		if(date.getDay() == time.nday) break;
		else date = new Date(date.valueOf() + 1000*60*60*24);

	let startDay = new Date(`${date.getFullYear()}-${Number(date.getMonth() + 1)}-${date.getDate()} ${time.start}:00`);
	let finishDay = new Date(`${date.getFullYear()}-${Number(date.getMonth() + 1)}-${date.getDate()} ${time.finish}:00`);

	let start = startDay.getUTCHours();
			startDay = startDay.getUTCDay();
	let finish = finishDay.getUTCHours();
			finishDay = finishDay.getUTCDay();

	if(finishDay == startDay) return [{start, finish, nday: startDay}];
	else if(finish != 0) return [{start, finish: 24, nday: startDay}, {start: 0, finish, nday: finishDay}];
	else return  [{start, finish: 24, nday: startDay}];

}

let toClient = time => {
	if(!time) return 'no time';

	let date = new Date();
	while(true)
		if(date.getUTCDay() == time.nday) break;
		else date = new Date(date.valueOf() + 1000*60*60*24);

	let startDate = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(), time.start, 0, 0));
	let finishDate = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(), time.finish, 0, 0));
 
	let start 		= startDate.getHours();
	let finish 		= finishDate.getHours();
	let startDay 	= startDate.getDay();
	let finishDay	= finishDate.getDay();

	if(finishDay == startDay) return [{start, finish, nday: startDay}];
	else if(finish != 0) return [{start, finish: 24, nday: startDay}, {start: 0, finish, nday: finishDay}];
	else return  [{start, finish: 24, nday: startDay}];

}

let getNumber = (n) => {
	switch(n){
		case 'a' : return 1; 	break;
		case 'b' : return 2; 	break;
		case 'c' : return 3; 	break;
		case 'd' : return 4; 	break;
		case 'e' : return 5; 	break;
		case 'f' : return 6; 	break;
		case 'g' : return 7; 	break;
		case 'h' : return 8; 	break;
		case 'i' : return 9; 	break;
		case 'j' : return 10; break;
		case 'k' : return 11; break;
		case 'l' : return 12; break;
		case 'm' : return 13; break;
		case 'n' : return 14; break;
		case 'o' : return 15; break;
		case 'p' : return 16; break;
		case 'q' : return 17; break;
		case 'r' : return 18; break;
		case 's' : return 19; break;
		case 't' : return 20; break;
		case 'u' : return 21; break;
		case 'v' : return 22; break;
		case 'w' : return 23; break;
		case 'x' : return 24; break;
		case 'y' : return 25; break;
		case 'z' : return 26; break;
		default: return false;break;
	}
}

let getLetter = (n) => {
	switch(n){
		case  1: 	return 'a'; break;
		case  2: 	return 'b'; break;
		case  3: 	return 'c'; break;
		case  4: 	return 'd'; break;
		case  5: 	return 'e'; break;
		case  6: 	return 'f'; break;
		case  7: 	return 'g'; break;
		case  8: 	return 'h'; break;
		case  9: 	return 'i'; break;
		case  10: return 'j'; break;
		case  11: return 'k'; break;
		case  12: return 'l'; break;
		case  13: return 'm'; break;
		case  14: return 'n'; break;
		case  15: return 'o'; break;
		case  16: return 'p'; break;
		case  17: return 'q'; break;
		case  18: return 'r'; break;
		case  19: return 's'; break;
		case  20: return 't'; break;
		case  21: return 'u'; break;
		case  22: return 'v'; break;
		case  23: return 'w'; break;
		case  24: return 'x'; break;
		case  25: return 'y'; break;
		case  26: return 'z'; break;
		default: return false;break;
	}
}

import Vue from 'vue'
let validateInput = (pre, name, length, revalue, reverse) => {
	let value = pre[name];
	let obj = {}
	if(!length) length = 1;

	if(reverse === false)
		if(value && revalue)
			if(value !== revalue) obj[name + '_err'] = true;
			else obj[name + '_err'] = false;
		else obj[name + '_err'] = true;	

	else 
		if((!value && value !== 0) || value.length < length || (reverse && value === revalue)) obj[name + '_err'] = true;
		else obj[name + '_err'] = false;

	Vue.set(pre, name + '_err', obj[name + '_err'])
	if(!obj[name + '_err']) return false;
	else return true;
}

let getSpaceInCount = a => {
  let count = '';
  let amount = String(JSON.stringify(JSON.parse(a)));
  while(amount.length >= 3){
    count = amount.substring(amount.length - 3, amount.length) + count + ' ';
    amount = amount.substring(0, amount.length - 3);
  }
  if(amount.length) count = amount + ' ' + count;
  return count;
}

let getSize = size =>{
  let sizeN = 0;
  if(size >= 1024000){
    while(size >= 1024000){
      size -=1024000;
      sizeN++;
    }
    size = `\'${size}\'`;
    sizeN += '.' + size[1] + size[2]
    sizeN +='Mb'
  }else{
    while(size >= 1024){
      size -=1024;
      sizeN++;
    }
    sizeN +='Kb'
  }
  return sizeN;
}

let getFileType = file => {
  let type = file.split('/')[0];
  switch(type)
  {
    case 'image':   return 2;
    case 'audio':   return 3;
    case 'video':   return 5;
    default:    return 4;
  }
}


let getTimeOnAudio = audio => {
  let seconds = audio;
  let hours = 0;
  let minuts = 0;
  if(seconds >= 3600)
    while(seconds >= 3600){
      hours++;
      seconds -= 3600;
    }
  if(seconds >= 60)
    while(seconds >= 60){
      minuts++;
      seconds -= 60;
    }
  if(hours == 0) hours = '';
  else {
    if(hours < 10) hours = '0' + hours;
    hours += ':';
  }
  if(minuts < 10) minuts = '0' + minuts;
  if(seconds < 10) seconds = '0' + seconds;
  return hours + minuts + ':' + seconds;
}

let getFileTitle = content => {
	let pre = content.split('-----'), res;
	for(let i = 0; i < pre.length; i++)
		if(i !== pre.length - 2)
			res += pre[i]
	return res
}

let checkAva = ava => {
      if(ava.split(':')[0] === 'http' || ava.split(':')[0] === 'https') return true
      else return false;
}

let dateFormat = (format, date) => {
	if(!date) date = new Date()

	let formatted = format
		.replace(/dd/g, 	 dd(date))
        .replace(/mm/g, 	 mm(date))
        .replace(/yyyy/g, 	 yyyy(date))
        .replace(/HH/g, 	 HH(date))
        .replace(/MM/g, 	 MM(date))
        .replace(/SS/g, 	 SS(date))
        .replace(/MS/g, 	 MS(date))
        .replace(/sss/g, 	 sss(date))

	return formatted
}

function mm(date) {
	let mm = (date.getMonth()+1).toString()
	return (mm[1]?mm:"0"+mm[0])
}
function yyyy(date) {
	return date.getFullYear().toString()
}
function dd(date) {
	let dd = date.getDate().toString()
	return (dd[1]?dd:"0"+dd[0])
}
function HH(date) {
	let HH = date.getHours().toString()
	return (HH[1]?HH:"0"+HH[0])
}
function MM(date) {
	let MM = date.getMinutes().toString()
	return (MM[1]?MM:"0"+MM[0])
}
function SS(date) {
	let SS = date.getSeconds().toString()
	return (SS[1]?SS:"0"+SS[0])
}
function MS(date) {
	let MS = date.getMilliseconds().toString()
	if (MS.length === 1) { MS = "0"+MS } 
	else if(MS.length !== 2) { MS = MS[0]+MS[1] }
	return MS
}
function sss(date) {
	let sss = date.getMilliseconds().toString()
	if (sss.length === 1) { sss = "00"+sss } 
	else if(sss.length === 2) { sss = "0"+sss }
	return sss
}

function isEmptyObj(obj) {
	for(var key in obj) if(obj.hasOwnProperty(key)) return false;
	return true;
}


export default {
	checkOfNull,
	getNormalDate,
	getFullMonth,
	getFullWeekday,
	getNameOfFile,
	toServer,
	toClient,
	getShortWeekday,
	getNumber,
	getLetter,
	validateInput,
	getSpaceInCount,
	getSize,
	getFileType,
	getTimeOnAudio,
	getFileTitle,
	checkAva,
	dateFormat,
	isEmptyObj
}


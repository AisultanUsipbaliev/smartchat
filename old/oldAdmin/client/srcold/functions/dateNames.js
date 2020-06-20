function getFullMonthName(m){
  switch(m){
    case 0: m = 'Январь'; break;
    case 1: m = 'Февраль'; break;
    case 2: m = 'Март'; break;
    case 3: m = 'Апрель'; break;
    case 4: m = 'Май'; break;
    case 5: m = 'Июнь'; break;
    case 6: m = 'Июль'; break;
    case 7: m = 'Август'; break;
    case 8: m = 'Сентябрь'; break;
    case 9: m = 'Октябрь'; break;
    case 10: m = 'Ноябрь'; break;
    case 11: m = 'Декабрь'; break;
  }
  return m;
}
function getShortMonthName(m){
  switch(m){
    case 0: m = 'янв'; break;
    case 1: m = 'фев'; break;
    case 2: m = 'мар'; break;
    case 3: m = 'апр'; break;
    case 4: m = 'май'; break;
    case 5: m = 'июн'; break;
    case 6: m = 'июл'; break;
    case 7: m = 'авг'; break;
    case 8: m = 'сен'; break;
    case 9: m = 'окт'; break;
    case 10: m = 'ноя'; break;
    case 11: m = 'дек'; break;
  }
  return m;
}
function getShortWeekDayName(w){
  switch(w){
    case 0: w = 'вс'; break;
    case 1: w = 'пн'; break;
    case 2: w = 'вт'; break;
    case 3: w = 'ср'; break;
    case 4: w = 'чт'; break;
    case 5: w = 'пт'; break;
    case 6: w = 'сб'; break;
  }
  return w;
}
function getFullWeekDayName(w) {
	switch(w){
    case 0: w = 'Воскресенье'; break;
    case 1: w = 'Понедельник'; break;
    case 2: w = 'Вторник'; break;
    case 3: w = 'Среда'; break;
    case 4: w = 'Четверг'; break;
    case 5: w = 'Пятница'; break;
    case 6: w = 'Суббота'; break;
  }
  return w;
}

export { getFullMonthName, getShortMonthName, getFullWeekDayName, getShortWeekDayName }
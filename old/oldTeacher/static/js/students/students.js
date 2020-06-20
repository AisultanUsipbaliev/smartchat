POST('/student', 'method=GET', getStudentList);

//получаем список студентов
function getStudentList(req)
{
	if(req.status == 200)
	{
		let studentName = document.getElementById('studentNames');
		let res = JSON.parse(req.response);
		let students = res.students;
		
		for(let i = 0; i< students.length; i++)
		{
			studentName.innerHTML +='<input type="radio" name="name"'+
									'id="student-'+students[i].student_id+'" class="chb"'+
									'onclick="showStudentData('+students[i].student_id+')">'+
									'<label class="label label_student" for="student-'+students[i].student_id+'">'+
										'<p>'+students[i].firstname+' '+students[i].lastname+'</p>'+
										'<img class="right_widget" src="/static/img/right.svg" alt="#">'+
									'</label>';
		}
		generateScroll('studentNames', document.getElementsByClassName('list')[0], {height: 'calc(100% - 5.75vh)', width: '100%'}, 1, 1)
		if (window.location.search) {
			var response = window.location.search.slice(1).split('=');
			document.getElementById('student-'+response[1]).checked = 'true';
			if (response[0] == 'id' && response[1] != '') {
				showStudentData(response[1]);
			} else {
				console.log('не найден');
			}
		} 
	}
}

function showStudentData(id) {
	POST('/student', 'method=GET&student_id='+id, getStudentData);
}

//получаем данные студента
function getStudentData(req)
{
	document.getElementById('listBody').scrollTo(0,0);
	let studentName = document.getElementById('studentName');
	let res = JSON.parse(req.response);
	let student = res.student[0];
	let chart = res.chart;
	document.getElementById('studentData').style.display = 'block';
	document.getElementById('studentPhoto').src = student.ava ? 'common/photo/' + student.ava : '/static/img/avatar.jpg';
	document.getElementById('studentName').innerHTML = student.firstname +' '+student.lastname;
	document.getElementById('studentEmail').innerHTML = student.email;
	document.getElementById('studentLvl').innerHTML = student.lvl_name;
	document.getElementById('studentRate').innerHTML = student.rate_name;
	if (student.group_type == 0) {
		document.getElementById('studentGroup').innerHTML = 'Группа : '+student.group_name;
	} else {
		document.getElementById('studentGroup').innerHTML = '';
	}
	document.getElementById('studentGroup').href = '/group?id='+student.group_id;
	document.getElementById('studentTel').innerHTML = student.phone;
	document.getElementById('training').innerHTML = '';

	if (chart) showChart(chart);
}

//получаем время занятие студента
function showChart(chart) {
	for (var i = 0; i < chart.length; i++) {

		var trainingTimeBlock = document.createElement('div');
		var trainingDay = document.createElement('div');
		var trainingTime = document.createElement('div');

		trainingTimeBlock.className = 'training__time-block';
		trainingDay.className = 'training__day';
		trainingTime.className = 'training__time';

		trainingTimeBlock.appendChild(trainingDay);
		trainingTimeBlock.appendChild(trainingTime);

		trainingDay.innerHTML = getWeekDay(chart[i].day);
		trainingTime.innerHTML = chart[i].start_time + ":00" + " - " + chart[i].finish_time + ":00";

		switch(getWeekDay(chart[i].day)) {
			case 'Понедельник':
			trainingTimeBlock.style.order = 1;
			break;
			case 'Вторник':
			trainingTimeBlock.style.order = 2;
			break;
			case 'Среда':
			trainingTimeBlock.style.order = 3;
			break;
			case 'Четверг':
			trainingTimeBlock.style.order = 4;
			break;
			case 'Пятница':
			trainingTimeBlock.style.order = 5;
			break;
			case 'Суббота':
			trainingTimeBlock.style.order = 6;
			break;
			default:
			trainingTimeBlock.style.order = 7;
			break;
		}
		document.getElementById('training').appendChild(trainingTimeBlock);
	}
}

//получаем день недели
function getWeekDay(date) {
	date = new Date(date);
	var days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
	var day = date.getDay();
	return days[day];
}

function POST(route, params, funct)
{
	let req = new XMLHttpRequest();
	req.onreadystatechange = function()
	{
  		if(req.readyState == 4) funct(req);
	}
		req.open('POST',route);
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.send(params);
}

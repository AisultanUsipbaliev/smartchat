	document.addEventListener("DOMContentLoaded", showGoups());

	function showGoups() {
		var req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				if(req.status == 200)
				{	
					let groupName = document.getElementById('groupNames');
					let res = JSON.parse(req.response);
					let groups = res.groups;
					window.groupNameArr = [];
					groupName.innerHTML = '';
					var deleteButton = '';
					for(let i = 0; i< groups.length; i++)
					{
						groupNameArr.push(groups[i].group_name);
						if (groups[i].quantity > 0) {
							deleteButton = '';
						} else {
							deleteButton = '<div onclick="deleteGroup('+groups[i].group_id+')" class="setting__link">Удалить</div>';
						}
						groupName.innerHTML += '<input type="radio" name="group" id="group-'+groups[i].group_id+'" class="chb" onclick="showStudentsData('+groups[i].group_id+')"><label class="label label_group" id="'+i+'" for="group-'+groups[i].group_id+'"><img class="setting-button" onclick="event.preventDefault(); groupSetting('+groups[i].group_id+');" src=/static/img/gear.svg alt="#" ><p>'+groups[i].group_name+'</p><img class="right_widget" src="/static/img/right.svg" alt="#"><div class="setting" id="settingGroup-'+groups[i].group_id+'"><div class="setting__link" onclick="event.preventDefault(); groupData(\''+groups[i].group_name+'\','+groups[i].group_id+'); ">Изменить</div>'+deleteButton+'</div></label>';
					}
					generateScroll('groupNames', document.getElementsByClassName('students-list')[0], {height: 'calc(100% - 5.75vh)', width: '100%'}, 1, 1)
					if (window.location.search) {
					var response = window.location.search.slice(1).split('=');
					document.getElementById('group-'+response[1]).checked = 'true';
						if (response[0] == 'id' && response[1] != '') {
							showStudentsData(response[1]);
						} else {
							console.log('не найден');
						}

					} 
				}
			}
		}
		req.open('POST','/group');
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.send('method=GET');
	}

	function showStudentsData(id) {

		var studentName = document.getElementById('studentNames');
		document.getElementById('studentData').style.display = 'none';
		studentName.innerHTML = '';
		var req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				if(req.status == 200)
				{	
					let res = JSON.parse(req.response);
					let students = res.students;
					
					for (var i = 0; i < students.length; i++) {
						studentName.innerHTML +='<input type="radio" name="name" id="student-'+students[i].student_id+'" class="chb" onclick="showStudentData('+students[i].student_id+')"><label class="label label_student" for="student-'+students[i].student_id+'"><p>'+students[i].firstname+' '+students[i].lastname+'</p><img class="right_widget" src="/static/img/right.svg" alt="#"></label>';
					}
					document.getElementById('groupStudents').style.display = 'block';
				}
					generateScroll('studentNames', document.getElementsByClassName('students-list')[1], {height: 'calc(100% - 5.75vh)', width: '100%'}, 1, 1)
			}
		}
		req.open('POST','/group');
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.send('method=GET&group_id='+id);
	}

	function showStudentData(id) {
		var req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				if(req.status == 200)
				{	
					let studentName = document.getElementById('studentName');
					let res = JSON.parse(req.response);
					let student = res.student[0];
					let chart = res.chart;
					document.getElementById('studentData').style.display = 'block';
					document.getElementById('studentPhoto').src = 
						student.ava ? 'common/photo/' + student.ava : '/static/img/avatar.jpg';
					document.getElementById('studentName').innerHTML = student.firstname +' '+student.lastname;
					document.getElementById('studentEmail').innerHTML = student.email;
					document.getElementById('studentLvl').innerHTML = student.lvl_name;
					document.getElementById('studentRate').innerHTML = student.rate_name;
					// if (student.lessons < 2 ) document.getElementById('studentRate').innerHTML = student.rate_name; 
					// else 
					// {
					// 	document.getElementById('studentRate').innerHTML = '';
					// 	document.getElementById('studentRateTitle').innerHTML ='';
					// }
					if (student.group_type == 0) document.getElementById('studentGroup').innerHTML = 'Группа : '+student.group_name;
					else document.getElementById('studentGroup').innerHTML = '';
					
					document.getElementById('studentTel').innerHTML = student.phone;
					document.getElementById('training').innerHTML = '';
					if (chart) {
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
					function getWeekDay(date) {
    					date = new Date(date);
    					var days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    					var day = date.getDay();
    					return days[day];
					}
				}
			}
		}
		req.open('POST','/student');
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.send('method=GET&student_id='+id);
	}

	function groupSetting(id){
		var x = document.getElementsByClassName('setting');
		var y = document.getElementById('settingGroup-'+id);
		if (!y.style.display || y.style.display == 'none') {
			for (var i = 0; i < x.length; i++) {
				x[i].style.display="none";
			}
			y.style.display="block";
		} else  {
			for (var i = 0; i < x.length; i++) {
				x[i].style.display="none";
			}
		}
	}

	function clickHandler(e){
		var elem, evt = e ? e:event;
		if (evt.target) {
			elem = evt.target;
			if (elem.className != 'setting-button') {
				var x = document.getElementsByClassName('setting');

				for (var i = 0; i < x.length; i++) {
					x[i].style.display="none";
				}
			} 
		} 
		return true;
	}

	function groupData(name,id) {
		document.getElementById('inputGroupName').value = name;
		document.getElementById('inputGroupId').value = id;
		document.getElementById('modal').style.display = 'flex';
	}

	function editGroup() {
		let id = document.getElementById('inputGroupId').value;
		let name = document.getElementById('inputGroupName').value;
		var req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				if(req.status == 200)
				{	
					let res = JSON.parse(req.response);
					let response = res;
				}
			}
		}
		req.open('POST','/group');
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		if (name.replace(/\s+/g, '')!='' && checkGroupName()==undefined) {
			req.send('method=POST&id='+id+'&name='+name);
			showGoups();
			closeModal();
		} else {
			document.getElementById('alertModal').style.display = "block";
			if (name.replace(/\s+/g, '')=='') {
				document.getElementById('alertModal').innerHTML = 'Поле не заполнена!';
			} else if(checkGroupName()!=undefined) {
				document.getElementById('alertModal').innerHTML = 'Группа с таким именем уже существует, придумайте другое название!';
			}

		}
	}

	function deleteGroup(id) {
		var req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if(req.readyState == 4)
			{
				if(req.status == 200)
				{	
					let res = JSON.parse(req.response);
					showGoups();
				}
			}
		}
		req.open('POST','/group');
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		req.send('method=DELETE&id='+id);
	}
		
	function inputValue(a) {
    	return a == document.getElementById('inputGroupName').value;
	}

	function checkGroupName() {
		return groupNameArr.find(inputValue);
	}

	function closeModal() {
		document.getElementById('alertModal').innerHTML = '';
		document.getElementById('alertModal').style.display = "none";
		document.getElementById('modal').style.display = 'none';
	}

	document.onclick=clickHandler;


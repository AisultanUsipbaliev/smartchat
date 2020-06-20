function getGroupsPage()
{
	content.innerHTML = ``;

	POST('/group', 'method=GET', function(res,stat)
		{
			let data = res.body;
			if(!data)
			{
				content.innerHTML =
				`
				<div class="nopeGroup">
				<div class="list_head">У вас нет группы</div>
				<div class="list_con" onclick="navClick(event)"><a link='courses'>Записаться на курс</a></div>
				</div>
				`
			}
			else
			{
				content.innerHTML=
				`
				<div class="students-list" id="students_list">
					<div class="list__header groupName"  id ='groupNames'>Группа</div>
					<div class="students-list__names" id='studentsNames'></div>
				</div>

				<div class="list listInfo">
					<div class="list__header">Курс</div>
					<div class="list__discription" id= "discriptionOfCourse"></div>
				</div>
				
				<div class="list listTeacher" id="studentData">
					<div class="list__header">Информация</div>
					<div class="list__body">
						<div class="list__avatar">
							<img src="/pictures/avatar.jpg" alt=""  id = 'studentPhoto'">
						</div>
						<div class="list__name" id = 'studentName'></div>
						<div class="list__tel" id = 'studentTel'></div>
						<div class="list__tel" id = 'studentAge'></div>
					</div>
				</div>
				`
				let groups = content.querySelector('#groupNames');
				let discription = content.querySelector('#discriptionOfCourse');
				let studentsNames = content.querySelector('#studentsNames');
				addGroup(data.info, groups, discription);
				addStudent(data.participants.teacher[0], studentsNames, true);	
				showStudent(data.participants.teacher[0], true);
				
				for (var i = 0; i < data.participants.student.length; i++) 
				{
					addStudent(data.participants.student[i], studentsNames, false);
				}
				generateScroll('studentsNames', document.getElementById('students_list'), {height: '91%', width: '100%'}, 1, 1, 1.125);
			}
		});
}

function addGroup(data, layoutg, layouti)
{	
	let name = data.group_info[0].group_name;
	let rateName = data.rate_info[0].rate_name;
	let rateTitle = data.rate_info[0].rate_title;
	let id = data.group_info[0].group_id;

	// let label = document.createElement('img');
	// label.src = '/pictures/exit.png';
	// label.classList.add('label');
	// label.id = 'groupExit';
	// label.setAttribute('for', id);

	layoutg.innerHTML = '';
	// layoutg.appendChild(label);
	layoutg.innerHTML += `Группа ${name}`;

	let info = document.createElement('div');
	info.innerHTML =
	`
	<div class="nameCourse">${rateName}</div>
	<div class"infoCourse">${rateTitle}<div>
	`;
	layouti.appendChild(info);
	
	// document.getElementById('groupExit').addEventListener('click', (e)=>
	// 	{
	// 		if(confirm('При выходе из группы возврат средств не производится!Вы действительно хотите удалить группу?'))
	// 		{
	// 			ws.send(JSON.stringify({
	// 				notice: 3,
	// 				group: id
	// 			}));
				
	// 			// generateContent();
	// 			getCoursesPage();
	// 		}
	// 	});
}

function addStudent(data, layout, teacheris)
{
	let name = data.fio;
	let id;
	if(teacheris === false) id = data.student_id;
	else 					id = data.teacher_id;
	

	let input = document.createElement('input');
	input.type = 'radio';
	input.name = 'human';

	if(teacheris === false) input.id = 'st'+id;
	else 					input.id = 'teach'+id;
	
	input.classList.add('chb');
	input.addEventListener('click', ()=>
	{		
		showStudent(data, teacheris);
	});

	let label = document.createElement('label');
	if(teacheris) label.classList.add('isTeacher');
	label.classList.add('label', 'label_student');
	if(teacheris === false)	label.setAttribute('for', 'st'+id);
	else 					label.setAttribute('for', 'teach'+id);
	
	label.innerHTML = 
	`
	<p>${name}</p>
	`;
	layout.appendChild(input);
	layout.appendChild(label);
}

function showStudent(data, teacheris)
{
	let block = document.getElementById('studentData');
	if(data.ava && data.ava != 'static/img/avatar.jpg') block.querySelector('#studentPhoto').src ='common/photo/' + data.ava;
	else block.querySelector('#studentPhoto').src = '/pictures/avatar.jpg';
	if(teacheris == true)
	{
		block.querySelector('#studentName').innerHTML = `Преподователь<p></p>`+data.fio;
		block.querySelector('#studentAge').innerHTML = '';
	}
	else
	{
		block.querySelector('#studentName').innerHTML = data.fio;
		block.querySelector('#studentAge').innerHTML = data.birthday ? getAgeNameProfile(data.birthday) : '';
		// block.querySelector('#studentAge').innerHTML = '';
	}
		let ava = block.querySelector('#studentPhoto');
		ava.addEventListener('click',()=>{
			showPopup(`<div style="width: 100%; height: 80vh;"><img src="${ava.src}" style="max-width: 100%; max-height: 100%;"></img></div>`, 
					{border: 'none', background: 'transparent', maxHeight: '75%', maxWidth: '75%', curtain: true, top: '6vh', textAlign: 'center'});
					
		})
	// if (data.phone) block.querySelector('#studentTel').innerHTML = data.phone;
	// else 			block.querySelector('#studentTel').innerHTML = '';
}

function getAgeName(a)
{
	if(a >= 0) return '';
	else if(a < 21)
	{
		if(a == 1) 			return a + ' год';
		else if(a < 5) 		return a + ' года';
		else 			 	return a + ' лет';
	}
	else
	{
		if 		(a%10 == 1) 			return a + ' год';
		else if (a%10 > 0 && a%10 < 5)  return a + ' года';
		else 							return a + ' лет';
	}
}
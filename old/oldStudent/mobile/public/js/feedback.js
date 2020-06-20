// feedback(1,[1],1,1);
function feedback(name, titles, test, callback)
{
	let script = 
	`<div id="rate">
		<h1 class="message_rate">Оцените ${name}</h1>
		<div class="stars">
			<div id="err"></div>
			<i class="far fa-star starsN" id="first_star"></i>
			<i class="far fa-star starsN" id="second_star"></i>
			<i class="far fa-star starsN" id="third_star"></i>
			<i class="far fa-star starsN" id="forth_star"></i>
			<i class="far fa-star starsN" id="fifth_star"></i>
		</div>
	</div>
	<div class ="parent">`;
	
	let big = false;
	if(titles.length > 1 || test.length > 0) big = true 
	
	for(let i = 0; i < titles.length; i++)
		script += `
			<div class="comments">
				<textarea class="comments_area" style="min-height:100px" placeholder="${titles[i]}"></textarea>
			</div><div class="test_a">
			`;

 	for (let i = 0; i < test.length; i++) {
 		script += 
 			`<div class="test_b"><p class="answer">${test[i].title}</p>`;
 			for(let j = 0; j< test[i].answers.length; j++)
	 			script += `<label for="dsa${i}${j}">
	 			<input id= 'dsa${i}${j}' class="question" type="radio" name='question${i}' value="${test[i].answers[j]}"/>
	 			<label class="answer_p" for='dsa${i}${j}'>${test[i].answers[j]}</label></label>
	 		`;
 			script += `</div>`;
 	}
 	script += '</div></div><button class="btn" id = "send_rate_button">Отправить</button>'; 	
	showPopup(script, 
 	 	{
 		width: '80%',
 		height: big ? 'auto' : 'auto',
 		top: '50%',
 		padding: '0 0 3vh 0',
 		background: '#fff',
 		close: true,
 	});

 	clicks(callback);
}

let stars_count = 0;

function clicks (callback) {
	document.getElementById('send_rate_button').addEventListener('click', ()=>{send_rate(callback)});

	let stars = document.getElementsByClassName('stars')[0];
	for (let i = 0; i < stars.children.length; i++){
		stars.children[i].addEventListener('click', function(){	
			stars_count = i+1;			
			document.getElementById('err').innerHTML = '';
			for (let g = 0; g < i; g++) {
				stars.children[g].classList.add('fa');
				stars.children[g].classList.remove('far');
			}
				stars.children[i].classList.add('fa');	
				stars.children[i].classList.remove('far');
				for (let n = i+1; n < stars.children.length; n++){
						stars.children[n].classList.remove('fa')
						stars.children[n].classList.add('far')
				}
		})
	}
}

function send_rate(sendResults)
{
	let commentAreas = document.getElementsByClassName('comments_area');
	let err = document.getElementById('err');

	let value = stars_count;
	let comments = [];
	let answers = [];

	if(stars_count == 0) {
		document.getElementsByClassName('message_rate')[0].classList.add('animateTitle');
		setTimeout(function(){
			document.getElementsByClassName('message_rate')[0].classList.remove('animateTitle');
		}, 3000)
		return;
	}

	for(let i = 0; i < commentAreas.length; i++) {
		if (commentAreas[i].value == '') {
			commentAreas[i].classList.add('input_err')
			return
		}
		else {
			commentAreas[i].classList.remove('input_err');
			comments.push(commentAreas[i].value)
		}
	}

	let divs = document.getElementsByClassName('test_b');

	for (let i = 0; i < divs.length; i++) {
		let flag = false;
		divs[i].children[0].style.background = '#fff';

		for (let j = 1; j < divs[i].children.length; j++) {
			let label = divs[i].children[j];
			if(label.children[0].checked) {
				flag = true;
				answers.push(label.children[0].value);
			}
		}

		if(!flag) {
			divs[i].children[0].style.background = 'red';
			return
		}
	}
	stars_count = 0;
	sendResults({value, comments, answers })
}

function thanksForFeedback()
{
	showPopup(`<div class="thanks">Благодарим за обратную связь!<button class="thxbt" onclick="closePopup()">Хорошо!</button></div>	`, {
		width: '80%',
		top: '50%',
 		background: '#fff',
 		close: true
	})
}
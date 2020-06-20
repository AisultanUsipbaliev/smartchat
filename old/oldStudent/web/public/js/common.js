var content = document.getElementById('content');
var popup = document.getElementById('popup');
var domen = top.location.href.split('/')[0] + '//' + top.location.href.split('/')[2] + '/';

setTimeout(()=>{
  if (top.location.href.split('/')[3] != 'courses' && top.location.href.split('/')[3]!='request') 
  {
    POST('/course', 'method=NEED-REQUEST', (res, stat) =>
    {
      if(stat == 200)
      {
        // goto('request/1')
        let script =
        `
            <div class="welcome">
              <div class="welcome__body">
                <div class="welcome__title">Добро пожаловать в SmartChat!</div><br>
                <div class="welcome__text"> Вы еще не записаны на обучающий курс. Посмотрите список тарифов, которые мы приготовили для Вас.
                <br><br>Если Вы не знаете, что выбрать, Вы можете записаться на пробное занятие.
                </div>
              </div>
              <button onclick="gotoCourse()" class="welcome__button">Посмотреть тарифы</a>
            </div>
        `;
        showPopup(script, {width: '35vw', height: '40vh', border:'none', background: '#fff', top: '15vh'});
      }
    });
  }

  POST('/notice', 'method=GET', (res, stat) =>
  {
    let not = res.body;

    for(let i = 0; i< not.length; i++)
    {
      GetNotice(not[i].notice_id, not[i].content);      
    }

    if(res.homeworksCount > 0 && top.location.href.split('/')[3] != 'homework')
    {
        let dot = document.createElement('div');
        dot.classList.add('newMessage');
        document.getElementById('navHomework').appendChild(dot);
    }
    if(res.testsCount > 0 && top.location.href.split('/')[3] != 'tests')
    {
        let dot = document.createElement('div');
        dot.classList.add('newMessage');
        document.getElementById('navTest').appendChild(dot);
    }
  });

  POST('/notice', 'method=UNREAD', (res, stat)=>{
    if(top.location.href != "https://web.smartchat.kz/chat")
    if (res.message !== 'no unread mes'){
        let dot = document.createElement('div');
        dot.classList.add('newMessage');
        document.getElementById('navChat').appendChild(dot);
      }
  });

  POST('/notice', 'method=GET', (res, stat) =>
  {
    if(res.isActivated != 1) 
    {
      let div = document.createElement('div');
      div.classList.add('notActivated');
      div.id = 'notActivated';
      div.innerHTML = `
      <span>Вы ещё не активировали вашу почту!</span><br>
      <button class="emBut" id="repeatemail">Повторно отправить</button>
      <button class="emBut" id="changeemail">Сменить почту</button>
      `;
      document.querySelector('.wrapper').appendChild(div);
      document.getElementById('repeatemail').addEventListener('click',()=>{
        POST('/data', 'method=REPEAT',(res1,status)=>{
          if(status === 200)
            div.innerHTML = `<span style="color:#41c941">На почту ${res.email} отправленно повторное письмо с активацией!</span>`;
          else
            div.innerHTML = `<span>Кажется что-то пошло не так, попробуйте позже!</span>`
        })
      });
      document.getElementById('changeemail').addEventListener('click',()=>{
        div.innerHTML = `
        <span id="emSpan">Введите новую почту для отправки письма с активацией!</span>
        <form>
        <input type="email" class="emInput" id="emInput" placeholder="Новый e-mail" required>
        <button class="emBut" id="sendNewEmail">Отправить</button>
        </form>
        `;
        let mail = document.getElementById('emInput');
        mail.addEventListener('keyup', ()=> mail.style.backgroundColor = 'transparent')
        document.getElementById('sendNewEmail').addEventListener('click',()=>{
          let stat = false;
          for (var i = 0; i < mail.value.length; i++) {
            if(mail.value[i] == '@'){
              for (var j = i+1; j < mail.value.length; j++) {
                if(mail.value[j] == '.'){
                  stat = true;
                }else if(mail.value[j].charCodeAt() < 65 || mail.value[j].charCodeAt() > 122){
                  mail.style.backgroundColor = 'linen';
                  document.getElementById('emSpan').innerHTML = 'Некорректный e-mail!';
                  return false;
                }
              }
            }
          }
          if(stat) 
          POST('/data', `method=NEW_EMAIL&&email=${mail.value}`,(res, status)=>{
            if(status === 200)
            div.innerHTML = `<span style="color:#41c941">На почту ${mail.value} отправленно письмо с активацией!</span>`;
          else if(status === 401){
            document.getElementById('emSpan').innerHTML = `Данной почты не существует, попробуйте другую!`
          }else document.getElementById('emSpan').innerHTML = `Кажется что-то пошло не так, попробуйте позже!`
          })
        else {
          mail.style.backgroundColor = 'linen';
          document.getElementById('emSpan').innerHTML = 'Некорректный e-mail!';
        }
        })
      })
      if(!res.email){
          document.getElementById('changeemail').click();
        }
    }
  });

  needFedback(); 
}, 0)

function needFedback(){
  POST('/notice', `method=GET`,(res, status)=>{
    let length = res.needFeedback.length;
    let teacher = res.needFeedback[0];
    if(teacher)
      if(teacher.teacher === 0){
        feedback('SmartChat',['Напишите пару слов о SmartChat'],[],(data)=> {    
          POST('/feedback', `method=SMART&&comment=${data.comments[0]}&&value=${data.value-1}`,() => checkLastFeedback(length));
        })
      }else{
        feedback(teacher.fio,['Ваше мнение о преподователе'],[],(data)=> {    
          POST('/feedback', `method=TEACHER&&teacher_id=${teacher.teacher}&&comment=${data.comments[0]}&&value=${data.value-1}`,() => checkLastFeedback(length));
        })
      }
  })
}

function checkLastFeedback(length){
  if(length === 1) thanksForFeedback();
  else needFedback();
}

function gotoCourse(){
  goto('courses');
  closePopup();
}

function navClick(e)
{
  e.preventDefault();
	let target = e.target;
	let href = target.getAttribute('link');
	if(!href) href = target.parentNode.getAttribute('link');
	if(!href) href = target.parentNode.parentNode.getAttribute('link');

  if(top.location.pathname != '/' + href && href) goto(href);
}

function goto(href)
{
  window.history.pushState({page_id: 0, page: 'page'}, '', domen + href);
  generateContent();
}

function paintMenu(hr)
{
  let menu = document.getElementById('nav_menu');

  let children = menu.children;

  for(let i = 0; i< children.length; i++)
  {
    children[i].children[0].classList.remove('current_nav');
    if(children[i].getAttribute('link') == hr)
    {
      children[i].children[0].classList.add('current_nav');
    }
  }
}

function getNotFoundPage()
{
  content.innerHTML = '';

  let img = document.createElement('img');
  img.src = '/img/4041.jpg';
  img.style.width = '100%';
  img.style.height = '100%';

  let text = document.createElement('h1');
  text.innerHTML = 'Страница не найдена!';
  text.style.zIndex = 999;
  text.style.margin = 'auto';
  text.style.color = '#fff';


  let div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.top = '3vh';
  div.style.left = '0';
  div.style.width = '100%';
  div.style.display = 'flex';
  div.background = 'transparent';
  div.style.zIndex = 999;
  div.appendChild(text)

  content.appendChild(img);
	content.appendChild(div);
}

function exitSystem()
{
	deleteCookie('SAU');
	deleteCookie('SAP');
  deleteCookie('SAI');
  top.location.href = '/sign';
}
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

create table rank
(
id		int auto_increment primary key,
name 		nvarchar(200) not null,
photo		nvarchar(200) not null,
value		int not null
);

create table mail
(
id 			int auto_increment primary key,
message 	nvarchar(4000),
stage		int unique,
`call` 		int,
comment 	nvarchar(2000)
);

create table lvl
(
lvl_id		int not null auto_increment primary key,
lvl_name	nvarchar(100)
);

insert into lvl(lvl_name) values ('Beginner'),('Elementary'),('Pre-Intermediate'),('Intermediate'),('Upper Intermediate'),('Advanced'),('Mastery'),('No level');

create table countryCode
(
id 			int auto_increment primary key,
code 		nvarchar(100),
name 		nvarchar(100)
);

insert into countryCode values(1, '+7', 'Kazakhstan');

create table faq
(
id 			int auto_increment primary key,
question 	nvarchar(500) not null,
answer 		nvarchar(4000) not null,
counter 	int default 0
);

create table teacher
(
teacher_id 	int not null auto_increment primary key,
login 		nvarchar(100),
lastname 	nvarchar(100),
phone		nvarchar(100),
email		nvarchar(100) UNIQUE,
lvl			int default 6,
ava			nvarchar(200) default null,
pass		nvarchar(100),
les_count 	int default 0,
role 		int default 0,
activated 	bool default false,
emailCode 	nvarchar(245),
rating 		real,
lastVisit 	datetime,
smsCode		nvarchar(30),
smsOn 		bool default false,
mailOn		bool default true,
is_active 	bool default false,
blocked 	bool default 1,
resume 		nvarchar(500),
audioResume	nvarchar(500),
testResult	int,
checkMe		bool default 0,
foreign key (lvl) references lvl (lvl_id) on update cascade
);

create table balance
(
id 			int auto_increment primary key,
teacher 	int not null,
amount		real not null,
currency	nvarchar(50) default 'kzt',
comment		nvarchar(1000),
dt 			datetime default now(),
foreign key (teacher) references teacher(teacher_id) on update cascade on delete cascade
);

create table graph
(
graph_id 	int not null auto_increment primary key,
teacher_id	int not null,
nday		int not null,
start_time	int not null,
finish_time	int not null, 
foreign key (teacher_id) references teacher(teacher_id) on update cascade on delete cascade
);

create table rate
(
rate_id			int not null auto_increment primary key,
rate_name 		nvarchar(500) not null,
rate_title 		nvarchar(2000) not null,
rate_cost 		int not null,
lessons 		int,
unlim 			bool default false,
group_type		bool default false, 
rate_content 	nvarchar(2000) not null,
sale 			bool default 0,
oldCost			int,
active 			bool default 1,
image 			nvarchar(2000)
);

create table price
(
id 			int auto_increment primary key,
teacher 	int not null,
amount		real not null,
currency	nvarchar(50) default 'kzt',
rate 		int not null,
foreign key (teacher) references teacher(teacher_id) on update cascade on delete cascade,
foreign key (rate) references rate(rate_id) on update cascade on delete cascade
);

create table gr
(
group_id 	int not null auto_increment primary key,
teacher_id  int not null, 
group_name	nvarchar(100),
started		bool default false,
group_type	bool default false,
rate_id 	int not null,
foreign key (rate_id) references rate(rate_id) on update cascade,
foreign key (teacher_id) references teacher(teacher_id) on update cascade on delete cascade
);

create table chart
(
chart_id 	int not null auto_increment primary key,
group_id	int not null,
start 		bigint,
finish 		bigint,
lesson 		int default 0,
foreign key (group_id) references gr(group_id) on update cascade on delete cascade
);

create table student
(
student_id 		int not null auto_increment primary key,
firstname		nvarchar(100),
lastname 		nvarchar(100) default '*',
phone			nvarchar(100),
chat_id			nvarchar(100) UNIQUE,
email			nvarchar(100),
ava				nvarchar(200),
lvl				int default 1,
nles			int default 1,
group_id		int default 0,
stream			bool default 0,
unlim 			bool default 0,
birthday 		date,
pass 			nvarchar(100) not null,
auth_id 		int,
activated 		bool default 0,
is_active 		bool default 0,
emailCode		nvarchar(200),
blocked 		bool default 0,
timeDifference 	int default 0,
pushTokens		nvarchar(4000) default '[]',
regDate			datetime default now(),
lastVisit 		datetime,
socialId 		nvarchar(200),
socialToken 	nvarchar(500),
socialType 		int,
smsOn 			bool default 1,
mailOn 			bool default 0,
guide 			nvarchar(2000),
guideUsed 		bool default 0,
lastTeacher		int default 0,
score			bigint default 0,
foreign key(lvl) references lvl(lvl_id) on update cascade
);

create table studentFaq
(
id 			int auto_increment primary key,
faq 		int not null,
student 	int not null,
val 		bool default false,
foreign key (student) references student(student_id) on update cascade on delete cascade,
foreign key (faq) references faq(id) on update cascade on delete cascade
);


create table phoneCall
(
id 				int auto_increment primary key,
student 		int not null,
callType		int not null,
mess 			nvarchar(2000),
foreign key (student) references student(student_id) on update cascade on delete cascade
);

create table test
(
test_id		int not null auto_increment primary key,
test_name	nvarchar(100),
teacher_id	int not null,
test_lvl	int default 1,
dt 			datetime default now(),
foreign key (teacher_id) references teacher (teacher_id) on update cascade on delete cascade
);

create table question
(
quest_id	int not null auto_increment primary key,
test_id		int not null,
quest_title nvarchar(150) not null,
variants	nvarchar(2000) not null,
correct		nvarchar(1) not null,
weight		int not null,
foreign key (test_id) references test (test_id) on update cascade on delete cascade
);

create table quiz
(
id 			int not null auto_increment primary key,
name 		nvarchar(500),
teacher 	int not null,
level 		int not null,
foreign key (level) references lvl(lvl_id) on update cascade on delete cascade,
foreign key (teacher) references teacher (teacher_id) on update cascade on delete cascade
);

create table quizContent
(
id 			int not null auto_increment primary key,
quiz		int not null,
type 		int not null,
content 	nvarchar(4000) not null,
position	int,
foreign key (quiz) references quiz(id) on update cascade on delete cascade
);

create table quizResult
(
id 			int not null auto_increment primary key,
quiz 		int not null,
student 	int not null,
content 	json,
dt		datetime default now(),
score		real,
foreign key (quiz) references quiz(id) on update cascade on delete cascade,
foreign key (student) references student(student_id) on update cascade on delete cascade
);

create table req
(
req_id		int not null auto_increment primary key,
student_id  int not null,
start_time	int not null,
finish_time int not null,
nday		int not null,
req_dt 		datetime default NOW(), 
rate_id 	int not null,
teacher_id	int not null,
foreign key (rate_id) references rate(rate_id) on update cascade on delete cascade,
foreign key (student_id) references student(student_id) on update cascade on delete cascade,
foreign key (teacher_id) references teacher(teacher_id) on update cascade on delete cascade
);

create table result
(
result_id 	int not null auto_increment primary key,
student_id  int not null,
test_id		int not null,
count		int not null default 0,
isread		bool default false,
dt 			datetime default NOW(),
answers 	nvarchar(2045),
done 		bool default false,
foreign key (test_id) references test (test_id) on update cascade on delete cascade,
foreign key (student_id) references student(student_id) on update cascade on delete cascade
);

create table chat
(
mes_id		int not null auto_increment primary key,
group_id	int null,
sender_id	int not null,
dt			datetime default NOW(),
content		nvarchar(2000) not null,
type 		int not null,
isteacher	bool default false,
isread		bool default false,
delivered 	bool default false,
title 		nvarchar(2000) default null,
reference 	int,
foreign key (group_id) references gr(group_id) on update cascade on delete cascade
);

create table unread
(
id			int auto_increment primary key,
mes_id		int not null,
user_id 	int not null,
foreign key (mes_id) references chat(mes_id) on update cascade on delete cascade
);

create table notice
(
notice_id 	int not null auto_increment primary key,
user_id 	int not null,
content 	nvarchar(3000) not null,
dt 		datetime default NOW(),
isteacher	bool not null,
deleted 	bool default false,
isread 		bool default false,
link		json
);

create table trial
(
trial_id 	int not null auto_increment primary key,
teacher_id 	int not null,
student_id  int not null,
dt 			datetime default now(),
foreign key (teacher_id) references teacher(teacher_id) on update cascade on delete cascade,
foreign key (student_id) references student(student_id) on update cascade on delete cascade
);

SET NAMES 'utf8mb4';
alter table chat convert to character set utf8mb4 collate utf8mb4_unicode_ci;

create table template
(
temp_id 		int	not null auto_increment primary key,
teacher_id 		int not null,
rate_id 		int not null,
lesson_num 		int not null,
lvl_id 			int not null,
`order` 			int not null default 0,
dz 				bool default false,
deleted 		bool default false
);


create table content
(
cont_id		int auto_increment primary key,
temp_id 	int not null,
type 		int not null,
content 	nvarchar(2000),
foreign key(temp_id) references template(temp_id) on update cascade on delete cascade
);


create table payment
(
id 				int not null auto_increment primary key,
transaction 	nvarchar(100) not null,
amount			real not null,
currency 		nvarchar(20) not null,
invoiceId 		nvarchar(200) not null,
ip				nvarchar(50),
status 			nvarchar(100) not null,
code 			int not null,
message 		nvarchar(200) not null,
name 			nvarchar(200) not null,
student 		int,
dt 			datetime default now(),
foreign key (student) references student(student_id) on update cascade on delete set null 
);

-- create table homework
-- (
-- id 			int auto_increment primary key,
-- student		int not null,
-- template 	int not null,
-- checked 	bool default false,
-- score 		int null,
-- filePath	nvarchar(2000) null,
-- dt			datetime default now(),
-- done 	bool default false,
-- foreign key (student) references student(student_id) on update cascade on delete cascade,
-- foreign key (template) references template(temp_id) on update cascade on delete cascade
-- );


-- create table group_req
-- (
-- gr_req_id 	int auto_increment primary key,
-- group_id 	int not null,
-- start_time	int not null,
-- finish_time int not null,
-- nday		int not null,
-- teacher_id	int not null,
-- foreign key (teacher_id) references teacher(teacher_id) on update cascade on delete cascade,
-- foreign key (group_id) references gr(group_id) on update cascade on delete cascade
-- );

create table usedtemplate
(
note_id 	int auto_increment primary key,
group_id 	int not null,
teacher_id 	int not null,
temp_id int not null,
foreign key (teacher_id) references teacher(teacher_id) on update cascade on delete cascade,
foreign key (group_id) references gr(group_id) on update cascade on delete cascade,
foreign key (temp_id) references template(temp_id) on update cascade on delete cascade
);

create table config
(
id 						int auto_increment primary key,
pass 					nvarchar(200) not null,
max_students 			int not null,
min_students 			int not null,
max_groups 				int not null,
quickTeacher 			int not null,
defaultCost 			real default 300,
trialDefaultCost 		real default 100,
goodTrial				real default 400
);

insert into config
	values (1, '$2a$11$kb6HLwY.FQMhFe0xf1QvTOwNqdo7O1YMIDU9qgwA8fQpa31vXrDh2', 8, 3, 5, 0, 300, 100, 400);

create table log
(
id 			int auto_increment primary key,
act			nvarchar(2000) not null,
dt 			datetime default now(),
isteacher 	bool default false,
danger 		bool default false
);

create table late
(
id 			int auto_increment primary key,
dt 			nvarchar(200) not null,
user_id 	int not null,
isteacher 	bool default false,
group_id 	int not null
);

create table feedback
(
id 			int auto_increment primary key,
student 	int not null,
com 		nvarchar(2000),
value 		int not null
);

create table report
(
id 			int auto_increment primary key,
com 		nvarchar(2000) not null,
file 		nvarchar(1000),
user 		int not null,
isteacher 	bool default false 
);

create table needFeedback
(
id 			int auto_increment primary key,
student 	int not null,
teacher		int not null,
foreign key (student) references student(student_id) on update cascade on delete cascade
);

create table userActivity
(
id 			int auto_increment primary key,
user 		int not null,
start 		nvarchar(100),
finish 		nvarchar(100),
isteacher 	bool default false,
group_id	int not null,
foreign key (group_id) references gr(group_id) on update cascade on delete cascade	
);

create table sertificat
(
id 			int auto_increment primary key,
student 	int not null,
rate 		int not null,
filename 	nvarchar(200) not null,
dt 			datetime default now(),
foreign key (student) references student(student_id) on update cascade on delete cascade,
foreign key (rate) references rate(rate_id) on update cascade
);

create table rating
(
rating_id 	int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
teacher_id 	int(11) NOT NULL,
student_id 	nvarchar(100) NOT NULL,
com 		nvarchar(2000),
value 		int not null,
dt 			datetime default now(),
foreign key (teacher_id) references teacher(teacher_id) on update cascade on delete cascade
);

create table trialReport
(
id 			int auto_increment primary key,
student 	int not null,
content 	nvarchar(500),
dt 			datetime default now(),
sended 		bool default 0,
foreign key (student) references student(student_id) on update cascade on delete cascade
);

CREATE TABLE test_level (
id 			int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
title 		nvarchar(1000) DEFAULT NULL,
question 	nvarchar(1000) NOT NULL,
variants 	nvarchar(2000) NOT NULL,
correct 	nvarchar(100) NOT NULL,
audio 		nvarchar(100) DEFAULT NULL
);

create table amocrm
(
id 			int auto_increment primary key,
student 	int not null,
dealId 		int not null,
contactId	int not null,
stage		int not null,
updated 	int not null,
foreign key (student) references student(student_id) on update cascade on delete cascade
);

create table amoEvent
(	
id 				int auto_increment primary key,
student 		int not null,
stage 			int default -1,
utc 			nvarchar(200) not null,
foreign key (student) references student(student_id) on update cascade on delete cascade
);

-- create table amoReaction
-- (
-- id 				int auto_increment primary key,
-- student 		int not null,
-- stage 			int not null,
-- dt 				datetime default now(),
-- foreign key (student) references student(student_id) on update cascade on delete cascade
-- );

create table ingress
(
id 				int auto_increment primary key,
isteacher 		int,
user 			int not null,
ip				nvarchar(100),
agent 			nvarchar(1000),
dt 				datetime default now()
);


create table implementation
(
id 			int auto_increment primary key,
comment		nvarchar(500),
type 		int not null,
value 		int not null
);


-- inserts --

insert into implementation (comment, type, value)
values 
('Пройденный пробный',1,100),
('Пройденное занятие',2,100),
('Завершение курса',3,500),
('Выполненный тест',4,50),
('Выполненное задание',5,50),
('Обратная связь',6,10),
('Оценка FAQ',7,10);

INSERT INTO `test_level` VALUES (1,'There are 50 questions in this test. You have to choose correct answer a, b or c. Also this test includes listening. While listening, be careful, try to find correct answer. \n    В этом тесте 50 вопросов. Вам нужно выбрать правильный ответ из трех вариантов a, b или c. Также в тесте будет аудирование. Во время аудирования будьте осторожны, постарайтесь найти правильный ответ.','1        … your brother like basketball?','A) are%%B) does%%C) is','B',NULL),(2,NULL,'2  What`s … name?','A) him%%B) his%%C) he','B',NULL),(3,NULL,'3    How are you?','A) Fine Thanks%%B) Nice to meet you%%C) Very intelligent','A',NULL),(4,NULL,'4 What`s  your father`s job?','A) She is a teacher%%B) He is a policeman%%C) It is engineer','B',NULL),(5,NULL,'5 What are you wearing?','A) Books%%B) A bag%%C) A shirt and trusers','C',NULL),(6,NULL,'6 What time do you get up? ','A) Three quearters of eight%%B) At seven o\'clock%%C) It`s eight o`clock','B',NULL),(7,NULL,'7 Whose pen is this?','A) It is Asem\'s %%B) It is on the table %%C) It is Asem','A',NULL),(8,NULL,'8 Can I have a pencil please?','A) Sorry, you haven\'t%%B) Yes, I have%%C) Yes. Here you are','C',NULL),(9,'Listen to two conversations. Choose a, b or c. ','9  Sarah’s phone number is…','A) 161 469 524 13%%B) 116 496 542 15%%C) 161 496 542','C','9-10.mp3'),(10,NULL,'10 The class on Thursday is in…','A) Room two%%B) Room three%%C) Room five','C','9-10.mp3'),(11,NULL,'11 I’ve got two brothers and a sister.','A) You do have got any brothers and sisters?%%B) Have you got any brothers and sisters?%%C) How many brothers are you?%%D) Have you got any sisters?','B',NULL),(12,NULL,'12 There are two','A) How many kids are in the classroom?%%B) How much stations are in Almaty?%%C) How many chairs is in the kitchen?%%D) Is there any milk in the fridge?','D',NULL),(13,NULL,'13 No, they can`t.','A) Do they Like football??%%B) Can you drive a car?%%C) Can elephants fly?%%D) Can we go home early?','C',NULL),(14,NULL,'14 She lives in Almaty.','A) Where do Natasha and Sergey Lives?%%B) Where do you live?%%C) Where does Kuat live?%%D) Where does Madina live?','D',NULL),(15,NULL,'15 No, He`s got a motorbike.','A) Has your father got a car?%%B) Have you got a bicycle?%%C) Is it a car?%%D) Do you have a car?','A',NULL),(16,NULL,'16 I`m cold','A) What have you got?%%B) What\'s the matter?%%C) What do you do?%%D) How do you do?','B',NULL),(17,'Listen and choose the correct answer a, b or c','17 A ham sandwich and a coffee cost','A) Five dollars’ twenty%%B) Four dollars’ twenty%%C) Five dollars’ ten','B','17.mp3'),(18,NULL,'18. Listen to Dana talking about her plans and choose the right order of her plans.','A) See a concert. Go to a market. Go sightseeing. Walk through the old city. Relax in a park. Have dinner in a restaurant.%%B) Walk through the old city. Go to a market. Go sightseeing. Relax in a park. See a concert. Have dinner in a restaurant.%%C) Relax in a park. Walk through the old city. Go to a market. See a concert. Go sightseeing. Have dinner in a restaurant','B','18.mp3'),(19,NULL,'19 She is tall and pretty.','A) Is your father tall??%%B) How is your brother?%%C) What does your mother look like?%%D) How is she?','C',NULL),(20,NULL,'20 A music magazine.','A) What is he playing?%%B) What does she play?%%C) What does he do?%%D) What is she reading?','D',NULL),(21,NULL,'21 Everest','A) What is the highest mountain in the world?%%B) What is the higher mountain in the world??%%C) What is the most high mountain in the world?%%D) What is highest mountain in the world?','A',NULL),(22,NULL,'22 Azamat plays football … Saturdays.','A) at?%%B) in%%C) to%%D) on','D',NULL),(23,NULL,'23 What … tomorrow night?','A) are you doing ?%%B) do you do?%%C) did you do%%D) will you','C',NULL),(24,NULL,'24 There is … milk in the fridge.','A) a lot %%B) any%%C) a%%D) some','D',NULL),(25,'You are going to hear an interview with an ex-Champion’s League referee from Spain. Choose a, b or c','25 What was the most exciting match he ever refereed?','A) His first professional match  %%B) He can’t choose just one %%C) Real Madrid against Barcelona','B','25-26.mp3'),(26,NULL,'26 The worst experience he has as a referee','A) When a player hit him during a match %%B) When a woman with a child tried to attack him %%C) When a 16-year-old boy tried to hit him','B','25-26.mp3'),(27,NULL,'27 … the Stephen Spielberg film night?','A) Was you seen%%B) Have you seen%%C) Did you saw%%D) Did you see','B',NULL),(28,NULL,'28 Perhaps I … to England for Christmas. ','A) am going to go%%B) will%%C) go%%D) will going','A',NULL),(29,NULL,'29 If it … , I won\"t go to Astana.','A) snow%%B) Will snow%%C) snows%%D) would snow','C',NULL),(30,NULL,'30 Most pollution … by cars.','A) causes%%B) is caused%%C) caused%%D) cause','D',NULL),(31,NULL,'31 What about … to McDonald\'s for lunch?','A) go%%B) we go%%C) going%%D) to go','C',NULL),(32,NULL,'32 Do your parents … you stay up late during the week?','A) let%%B) leave%%C) make%%D)tell','A',NULL),(33,'Listen and choose correct answer, a, b or c','33 He thought the fashion show was __.','A) exciting%%B) interesting%%C) boring','C','33.mp3'),(34,NULL,'34 The most beautiful city he’s been to is_______.','A) Venice%%B) Prague%%C) Amsterdam','B','34.mp3'),(35,NULL,'35 If I … to live in another  country, I would  miss my friends.','A) had gone%%B) goes%%C) would go%%D) went','D',NULL),(36,NULL,'36 She asked me if I … to sing at the dance.','A) will to sing%%B) would%%C) am going%%D) was going','C',NULL),(37,NULL,'37 The train arrived in Almaty at 7.00 a.m. It … from Moscow.','A) coming%%B)come%%C) would come%%D) had come','D',NULL),(38,NULL,'38 If she … harder, she would have passed the test','A) studied%%B) will have studied%%C) would have studied%%D) had studied','A',NULL),(39,NULL,'39 That is the girl … went to America.','A) what%%B) that%%C) which%%D) she','B',NULL),(40,NULL,'40 I … my car last night – I was too tired','A) what%%B) should drive%%C) should not have driven%%D) should have ','C',NULL),(41,'Listen and choose the correct answer a, b or c','41 The woman _____Deborah.','A) knows%%B) hasn’t met%%C) wouldn’t like to','B','41.mp3'),(42,NULL,'42 Is the woman afraid of mice?','A) Yes%%B) No%%C) We don`t know','A','42.mp3'),(43,NULL,'43 How old are you?','A) I have 13%%B) I am 15%%C) 153 cm','B',NULL),(44,NULL,'44 Do you like animals?','A) Yes, i do%%B) No, I they don`t%%C) Yes, I like','A',NULL),(45,NULL,'45 Yes, please.','A) Would you like a coke?%%B) Do you like macaroni?%%C) Have you got an ice cream?%%D) Can I have a cake?','A',NULL),(46,NULL,'46 She`s tall and pretty.','A) Is your father tall?%%B) How`s your brother?%%C)  What does your mother look like?%%D) How is she?','C',NULL),(47,NULL,'47 Katya and Andrey … to London in 1992.','A) whre%%B) visited%%C) went%%D) go','C',NULL),(48,NULL,'48 … a test at the moment.','A) I`m making%%B) I make%%C) I`m doing%%D) I do','C',NULL),(49,NULL,'49 She … to St. Peterburg yet.','A) haven`t been%%B) didn`t go%%C) hasn`t been%%D) hadn`t been','C',NULL),(50,NULL,'50 When I was young, I … walk to school.','A) had to%%B) must%%C) could to%%D) would to','A',NULL);

insert into rank(name, photo, value)
values
('Новичок', 'новичок.png', 1000),
('Любитель', 'любитель2.png', 2000),
('Продвинутый','продвинутый1.png',3500),
('Исследователь','исследователь.png',5000),
('Интеллектуал','intelligent.png',8000),
('Мастер','мастер.png',10000),
('Магистр','магистр.png',15000),
('Мудрец','мудрец.png',20000),
('Англоман','englishman.png',30000);


insert into rate(rate_name, rate_title, rate_cost, lessons, unlim, group_type, rate_content) values 
	('Пробное занятие', 'Один бесплатный урок с преподавателем.', 0, 4, 0, 1, "Одно пробное занятие на платформе Smartchat с преподавателем."),
	('Smart 1to1', '12 занятий в месяц в обговоренное время.\nОбучение проходит 12 раз в месяц, в обговоренное с учеником время по общей программе.', 12000, 12, 0, 0, 'Тариф подходит для людей, которые могут включить изучение английского в свое расписание. Вы назначаете конкретное время и дни занятий, и в это время преподаватель будет связываться с вами.'), 
	('Безлимит','12 занятий в месяц в любое время.\nОбучение не имеет ограничение по времени. Вы можете обучаться с преподавателем в любое время в течении дня по общей программе.', 20000, 12, 1, 0, 'Тариф подходит людям с загруженным графиком, которым удобно один день заниматься утром, а другой день вечером. Тариф так же позволяет начать обучение утром и учиться в течении всего дня, используя свободное время в своем графике.'),
	('Индивидуальный подход', '12 занятий в месяц в обговоренное время.\nОбучение проходит по программе специально построенной для Вас, учитывающая ваши цели и сроки обучения.', 24000, 12, 0, 1, 'Тариф подходит для тех, кто хочет подготовиться к каким либо экзаменам, готовится к поездке или выступлению. Мы построим для вас программу учитывая ваши сроки, и материал который необходимо изучить.');
	
-------

-- triggers --
DROP trigger IF exists updateRating;
DELIMITER $$
create DEFINER=`anvar`@`localhost` trigger updateRating
after insert  
	on rating  FOR EACH ROW
BEGIN
	update teacher as t set rating = (select avg(r.value) as rating from rating r where r.teacher_id = t.teacher_id) where t.teacher_id > 0;
END$$
DELIMITER ;

DELIMITER $$

DROP TRIGGER IF EXISTS student_AFTER_UPDATE$$
CREATE DEFINER=`root`@`localhost` TRIGGER `student_AFTER_UPDATE` 
AFTER UPDATE ON `student` FOR EACH ROW
BEGIN
	update gr set group_name = concat(new.firstname,' ',new.lastname ) 
    where gr.group_id = new.group_id;
END$$
DELIMITER ;
------
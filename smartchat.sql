create table smartchat.lvl
(
lvl_id		int not null auto_increment primary key,
lvl_name	nvarchar(100)
);

insert into smartchat.lvl(lvl_name) values ('Beginner'),('Elementary'),('Pre-Intermediate'),('Intermediate'),('Upper Intermediate'),('Advanced'),('Mastery'),('No level');

create table smartchat.teacher
(
teacher_id 	int not null auto_increment primary key,
login 		nvarchar(100),
lastname 	nvarchar(100),
phone		nvarchar(100),
email		nvarchar(100) UNIQUE,
lvl			int default 6,
ava			nvarchar(200) default 'static/img/avatar.jpg',
pass		nvarchar(100),
les_count 	int default 0,
foreign key (lvl) references smartchat.lvl (lvl_id) on update cascade
);

create table smartchat.graph
(
graph_id 	int not null auto_increment primary key,
teacher_id	int not null,
nday		int not null,
start_time	int not null,
finish_time	int not null, 
foreign key (teacher_id) references smartchat.teacher(teacher_id) on update cascade on delete cascade
);

create table smartchat.rate
(
rate_id		int not null auto_increment primary key,
rate_name 	nvarchar(500) not null,
rate_title 	nvarchar(2000) not null,
rate_cost 	int not null,
lessons 	int,
unlim 		bool default false,
group_type	bool default false, 
rate_content nvarchar(2000) not null
);

create table smartchat.gr
(
group_id 	int not null auto_increment primary key,
teacher_id  int not null, 
group_name	nvarchar(100),
started		bool default false,
group_type	bool default false,
rate_id 	int not null,
foreign key (rate_id) references smartchat.rate(rate_id) on update cascade,
foreign key (teacher_id) references smartchat.teacher(teacher_id) on update cascade on delete cascade
);

create table smartchat.chart
(
chart_id 	int not null auto_increment primary key,
group_id	int not null,
day			date,
start_time	int,
finish_time int,
lesson 		int default 0,
foreign key (group_id) references smartchat.gr(group_id) on update cascade on delete cascade
);

create table smartchat.student
(
student_id 	int not null auto_increment primary key,
firstname	nvarchar(100),
lastname 	nvarchar(100),
phone		nvarchar(100),
chat_id		nvarchar(100) UNIQUE,
email		nvarchar(100),
ava			nvarchar(200),
lvl			int default 8,
nles		int default 1,
group_id	int default 0,
stream		bool default 0,
unlim 		bool default 0,
age 		bool default 1,
foreign key(lvl) references smartchat.lvl(lvl_id) on update cascade
);


create table smartchat.test
(
test_id		int not null auto_increment primary key,
test_name	nvarchar(100),
teacher_id	int not null,
test_lvl	int default 1,
dt 			datetime default now(),
foreign key (teacher_id) references smartchat.teacher (teacher_id) on update cascade on delete cascade
);

create table smartchat.question
(
quest_id	int not null auto_increment primary key,
test_id		int not null,
quest_title nvarchar(150) not null,
variants	nvarchar(2000) not null,
correct		nvarchar(1) not null,
weight		int not null,
foreign key (test_id) references smartchat.test (test_id) on update cascade on delete cascade
);


create table smartchat.req
(
req_id		int not null auto_increment primary key,
student_id  int not null,
start_time	int not null,
finish_time int not null,
nday		int not null,
req_dt 		datetime default NOW(), 
rate_id 	int not null,
teacher_id	int not null,
foreign key (rate_id) references smartchat.rate(rate_id) on update cascade on delete cascade,
foreign key (student_id) references smartchat.student(student_id) on update cascade on delete cascade,
foreign key (teacher_id) references smartchat.teacher(teacher_id) on update cascade on delete cascade
);

create table smartchat.result
(
result_id 	int not null auto_increment primary key,
student_id  int not null,
test_id		int not null,
count		int not null default 0,
isread		bool default false,
dt 			datetime default NOW(),
foreign key (test_id) references smartchat.test (test_id) on update cascade on delete cascade,
foreign key (student_id) references smartchat.student(student_id) on update cascade on delete cascade
);

create table smartchat.chat
(
mes_id		int not null auto_increment primary key,
group_id	int null,
sender_id	int not null,
dt			datetime default NOW(),
content		nvarchar(2000) not null,
type 		int not null,
isteacher	bool default false,
isread		bool default false,
title 		nvarchar(2000) default null,
foreign key (group_id) references smartchat.gr(group_id) on update cascade on delete set null
);

create table smartchat.notice
(
notice_id 	int not null auto_increment primary key,
teacher_id 	int not null,
content 	nvarchar(3000) not null,
dt 			datetime default NOW(),
foreign key (teacher_id) references smartchat.teacher(teacher_id) on update cascade on delete cascade
);

create table smartchat.trial
(
trial_id 	int not null auto_increment primary key,
teacher_id 	int not null,
student_id  int not null,
foreign key (teacher_id) references smartchat.teacher(teacher_id) on update cascade on delete cascade,
foreign key (student_id) references smartchat.student(student_id) on update cascade on delete cascade
);

insert into smartchat.rate(rate_name, rate_title, rate_cost, lessons, unlim, group_type, rate_content) values 
	('Пробное занятие', 'Один бесплатный урок с преподавателем.', 0, 4, 0, 1, "Одно пробное занятие на платформе Smartchat с преподавателем."),
	('Smart 1to1', '12 занятий в месяц в обговоренное время.\nОбучение проходит 12 раз в месяц, в обговоренное с учеником время по общей программе.', 12000, 12, 0, 0, 'Тариф подходит для людей, которые могут включить изучение английского в свое расписание. Вы назначаете конкретное время и дни занятий, и в это время преподаватель будет связываться с вами.'), 
	('Безлимит','12 занятий в месяц в любое время.\nОбучение не имеет ограничение по времени. Вы можете обучаться с преподавателем в любое время в течении дня по общей программе.', 20000, 12, 1, 0, 'Тариф подходит людям с загруженным графиком, которым удобно один день заниматься утром, а другой день вечером. Тариф так же позволяет начать обучение утром и учиться в течении всего дня, используя свободное время в своем графике.'),
	('Индивидуальный подход', '12 занятий в месяц в обговоренное время.\nОбучение проходит по программе специально построенной для Вас, учитывающая ваши цели и сроки обучения.', 24000, 12, 0, 1, 'Тариф подходит для тех, кто хочет подготовиться к каким либо экзаменам, готовится к поездке или выступлению. Мы построим для вас программу учитывая ваши сроки, и материал который необходимо изучить.');
	

SET NAMES 'utf8mb4';
alter table smartchat.chat convert to character set utf8mb4 collate utf8mb4_unicode_ci;

create table smartchat.free
(
	free_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	chat_id nvarchar(100) NOT NULL,
	teacher_id int(11) NOT NULL,
	foreign key(teacher_id) references smartchat.teacher(teacher_id) on update cascade on delete cascade
);

create table smartchat.rating
(
rating_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
teacher_id int(11) NOT NULL,
student_id nvarchar(100) NOT NULL,
foreign key (teacher_id) references smartchat.teacher(teacher_id) on update cascade on delete cascade
);

create table smartchat.template
(
temp_id 		int	not null auto_increment primary key,
teacher_id 		int not null,
rate_id 		int not null,
lesson_num 		int not null,
lvl_id 			int not null,
order 			int not null default 0
);

create table smartchat.content
(
cont_id		int auto_increment primary key,
temp_id 	int not null,
type 		int not null,
content 	nvarchar(2000),
foreign key(temp_id) references smartchat.template(temp_id) on update cascade on delete cascade
);

create table smartchat.group_req
(
gr_req_id 	int auto_increment primary key,
group_id 	int not null,
start_time	int not null,
finish_time int not null,
nday		int not null,
teacher_id	int not null,
foreign key (teacher_id) references smartchat.teacher(teacher_id) on update cascade on delete cascade,
foreign key (group_id) references smartchat.gr(group_id) on update cascade on delete cascade
);

create table smartchat.usedtemplate
(
note_id 	int auto_increment primary key,
group_id 	int not null,
teacher_id 	int not null,
temp_id int not null,
foreign key (teacher_id) references smartchat.teacher(teacher_id) on update cascade on delete cascade,
foreign key (group_id) references smartchat.gr(group_id) on update cascade on delete cascade,
foreign key (temp_id) references smartchat.template(temp_id) on update cascade on delete cascade
);

create table smartchat.config
(
id 				int auto_increment primary key,
login			nvarchar(200) not null,
password 		nvarchar(200) not null,
bot 			nvarchar(200) not null,
domen 			nvarchar(200) not null,
students 		int not null,
min_students 	int not null,
groups 			int not null,
port 			int not null,
access_key 		nvarchar(200) not null
);

insert into smartchat.config
	values (1, 'admin', 'admin', 'http://192.168.1.159:3000/message'
		, 'http://localhost:3000/' , 8, 3, 3, 3000, 'boomboom');

CREATE TABLE smartchat.test0 (
`quest_id`		int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
`quest_title`	nvarchar(150) NOT NULL,
`variants`		nvarchar(2000) NOT NULL,
`correct`		char(1) NOT NULL,
`photo`			nvarchar(100) DEFAULT NULL
);


CREATE TABLE smartchat.test0 (
`quest_id`		int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
`quest_title`	nvarchar(150) NOT NULL,
`variants`		nvarchar(2000) NOT NULL,
`correct`		char(1) NOT NULL,
`photo`			nvarchar(100) DEFAULT NULL
);

INSERT INTO smartchat.test0 (quest_title, variants, correct) VALUES  
('1	… your brother like basketball?','A) are%%B) does%%C) is','B'),
('2	What`s … name?','A) him%%B) his%%C) he','B'),
('3	How are you?','A) Fine Thanks%%%%B) Nice to meet you%%C) Very intelligent','A'),
("4 What`s  your father`s job?","A) She is a teacher%%B) He is a policeman%%C) It is engineer",'B'),
("5 What are you wearing? ","A) Books%%B) A bag%%C) A shirt and trusers",'C'),
("6 What time do you get up? ","A) Three quearters of eight%%B) At seven o'clock%%C) It`s eight o`clock",'B'),
("7 Whose pen is this?","A) It is Asem's %%B) It is on the table %%C) It is Asem",'A'),
("8 Can I have a pencil please? ","A) Sorry, you haven't%%B) Yes, I have%%C) Yes. Here you are",'C'),
("9 How old are you?","A) I have 13%%B) I am 15%%C) 153cm",'B'),
("10 Do you like animals?","A) Yes, I do%%B) No, I they don’t%%C) Yes, I like",'A'),
('11 I’ve got two brothers and a sister.','A) You do have got any brothers and sisters?%%B) Have you got any brothers and sisters?%%C) How many brothers are you?%%D) Have you got any sisters?','B'),
('12 There are two','A) How many kids are in the classroom?%%B) How much stations are in Almaty?%%C) How many chairs is in the kitchen?%%D) Is there any milk in the fridge?','B'),
('13 No, they can`t.','A) Do they Like football??%%B) Can you drive a car?%%C) Can elephants fly?%%D) Can we go home early?','B'),
('14 She lives in Almaty.','A) Where do Natasha and Sergey Lives?%%B) Where do you live?%%C) Where does Kuat live?%%D)  Where does Madina live?','B'),
('15 No, He`s got a motorbike.','A) Has your father got a car?%%B) Have you got a bicycle?%%C) Is it a car?%%D) Do you have a car?','B'),
('16 Yes, please.','A) Would you like a coke? %%B) Do you like macaroni?%%C). Have you got an ice cream?%%D) Can I have a cake?','B'),
('17 I`m cold',"A) What have you got?%%B) What's the matter? %%C) What do you do?%%D) How do you do?",'B'),
('18 She is tall and pretty.','A) Is your father tall??%%B) How is your brother? %%C) What does your mother look like?%%D) How is she?','B'),
('19 A music magazine.','A)What is he playing?%%
B). What does she play?%%
C) What does he do?%%
D) What is she reading?',
'B'),
('21 Everest',
'A) What is the highest mountain in the world?%%B) What is the higher mountain in the world??%%C) What is the most high mountain in the world?%%D) What is highest mountain in the world?',
'B'),
('22 Azamat plays football … Saturdays.',
'A) at?%%B) in%%C)to%%D) on',
'B'),
('22 What … tomorrow night?',
'A) are you doing ?%%B) do you do?%%C) did you do%%D)  will you',
'B'),
('23 There is … milk in the fridge.',
'A) a lot %%B) any%%C) a%%D)  some',
'B'),
('24 … the Stephen Spielberg film night?',
'A) Was you seen  %%B)Have you seen %%C) Did you saw%%D)Did you see',
'B'),
('25 Katya and Andrey … to London in 1992.',
'A) were %%B) visited %%C) went%%D)go',
'B'),
('26 … a test at the moment.',
'A) I am making%%B) I make%%C)I am doing	%%D)  I do',
'B'),
('27 Perhaps I … to England for Christmas. ',
'A) am going to go	%%B)will %%C) go%%D)  will going',
'B'),
('28 If it … , I won"t go to Astana.',
'A)snow%%B)Will snow	%%C) snows %%D) would snow',
'B'),
('29 Most pollution … by cars.',
'A)causes%%B)is caused	%%C) caused %%D) cause',
'B'),
("30 What about … to McDonald's for lunch?",
'A)go%%B)we go	%%C) going %%D) to go',
'B'),
('31. Do your parents … you stay up late during the week?',
'A)let%%B)leave	%%C) make %%D)tell',
'B'),
('32. When I was young, I … walk to school.',
'A)had to%%B)must	%%C) could to %%D) would to',
'B'),
('33. She … to St. Peterburg yet.',
'A)have not been%%B)did not go %%C) has not been %%D)had not been',
'B'),
('34. If I … to live in another  country, I would  miss my friends.',
'A)had gone%%B)goes	%%C) would go	 %%D) went',
'B'),
('35 She asked me if I … to sing at the dance.',
'A)will to sing%%B)would	%%C) am going%%D) was going',
'B'),
('36. The train arrived in Almaty at 7.00 a.m. It … from Moscow.',
'A)coming%%B)come	%%C) would come %%D) had come',
'B'),
('37. If she … harder, she would have passed the test',
'A)studied%%B)will have studied	%%C) would have studied %%D)had studied',
'B'),
('38. That is the girl … went to America.',
'A)what %%B)that	%%C) which %%D)she',
'B'),
('39. I … my car last night – I was too tired',
'A)what %%B)should drive	%%C) should not have driven %%D)should have ',
'B'),
('40. He … to drive since January',
'A)was learning %%B)will learn%%C)has been learning %%D)will have been learning to drive',
'B');



CREATE TABLE smartchat.test1 (
`quest_id`		int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
`quest_title`	nvarchar(2000) NOT NULL,
`variants`		nvarchar(2000) NOT NULL,
`correct`		char(1) NOT NULL,
`photo`			nvarchar(100) DEFAULT NULL
);

INSERT INTO smartchat.test1 (quest_title, variants, correct) VALUES  
('•	Where can you see these notices?
•	For questions 1 to 5, mark one letter A, B or C on your Answer Sheet.
	1 You can look, but don’t touch the pictures.',
'A) 	in an office%%B) 	in a cinema%%C) 	in a museum',
'C'),
('2		Please give the right money to the driver.',
'A) 	in a bank%%B)	on a bus%%C)	in a cinema',
'B'),
('3		NO 
	PARKING
	PLEASE
',
'A) 	in a street%%B) 	on a book%%C) 	on a table',
'A'),
("4 	CROSS BRIDGE FOR TRAINS TO EDINBURGH",
"A) in a bank%%B) 	in a garage%%C)	in a station",
'C'),
("5 	KEEP IN A 
	COLD PLACE
 ",
"A) 	on clothes%%B) 	on furniture%%C) on food",
'C'),
("	Questions 6 – 10
•	In this section you must choose the word which best fits each space in the text below.
•	For questions 6 to 10, mark one letter A, B or C on your Answer Sheet.
	There are millions of stars in the sky. If you look (6) .................. the sky on a clear night, it is possible
	to see about 3000 stars. They look small, but they are really (7) .................. big hot balls of burning
	gas. Some of them are huge, but others are much smaller, like our planet Earth. The biggest stars are
	very bright, but they only live for a short time. Every day new stars (8) .................. born and old stars
	die. All the stars are very far away. The light from the nearest star takes more (9) .................. four
	years to reach Earth. Hundreds of years ago, people (10) .................. stars, like the North star, to know
	which direction to travel in. Today you can still see that star.",
"6  
A) at%%B) up %%C) on",
'A'),
("There are millions of stars in the sky. If you look (6) .................. the sky on a clear night, it is possible
	to see about 3000 stars. They look small, but they are really (7) .................. big hot balls of burning
	gas. Some of them are huge, but others are much smaller, like our planet Earth. The biggest stars are
	very bright, but they only live for a short time. Every day new stars (8) .................. born and old stars
	die. All the stars are very far away. The light from the nearest star takes more (9) .................. four
	years to reach Earth. Hundreds of years ago, people (10) .................. stars, like the North star, to know
	which direction to travel in. Today you can still see that star.",
"7  
A) very %%B) too %%C) much",
'A'),
("There are millions of stars in the sky. If you look (6) .................. the sky on a clear night, it is possible
	to see about 3000 stars. They look small, but they are really (7) .................. big hot balls of burning
	gas. Some of them are huge, but others are much smaller, like our planet Earth. The biggest stars are
	very bright, but they only live for a short time. Every day new stars (8) .................. born and old stars
	die. All the stars are very far away. The light from the nearest star takes more (9) .................. four
	years to reach Earth. Hundreds of years ago, people (10) .................. stars, like the North star, to know
	which direction to travel in. Today you can still see that star.",
"8 
 A) is%%B) be%%C) are",
'C'),
("There are millions of stars in the sky. If you look (6) .................. the sky on a clear night, it is possible
	to see about 3000 stars. They look small, but they are really (7) .................. big hot balls of burning
	gas. Some of them are huge, but others are much smaller, like our planet Earth. The biggest stars are
	very bright, but they only live for a short time. Every day new stars (8) .................. born and old stars
	die. All the stars are very far away. The light from the nearest star takes more (9) .................. four
	years to reach Earth. Hundreds of years ago, people (10) .................. stars, like the North star, to know
	which direction to travel in. Today you can still see that star.",
"9 
 A) that %%B) of %%C) than",
'C'),
("There are millions of stars in the sky. If you look (6) .................. the sky on a clear night, it is possible
	to see about 3000 stars. They look small, but they are really (7) .................. big hot balls of burning
	gas. Some of them are huge, but others are much smaller, like our planet Earth. The biggest stars are
	very bright, but they only live for a short time. Every day new stars (8) .................. born and old stars
	die. All the stars are very far away. The light from the nearest star takes more (9) .................. four
	years to reach Earth. Hundreds of years ago, people (10) .................. stars, like the North star, to know
	which direction to travel in. Today you can still see that star.",
"10
  A) use%%B) used%%C) using",
'B'),
('	Questions 11 – 20	
•	In this section you must choose the word which best fits each space in the texts.
•	For questions 11 to 20, mark one letter A, B, C or D on your Answer Sheet.
	Older Britons are the worst in Europe when it comes to keeping their teeth. But British youngsters
	(11) .................. more to smile about because (12) .................. teeth are among the best. Almost
	80% of Britons over 65 have lost all or some (13) .................. their teeth according to a World
	Health Organisation survey. Eating too (14) .................. sugar is part of the problem. Among
	(15) .................. , 12-year olds have on average only three missing, decayed or filled teeth.',
'11
 A) getting%%B) got %%C) have%%D) having',
'C'),
('	Older Britons are the worst in Europe when it comes to keeping their teeth. But British youngsters
	(11) .................. more to smile about because (12) .................. teeth are among the best. Almost
	80% of Britons over 65 have lost all or some (13) .................. their teeth according to a World
	Health Organisation survey. Eating too (14) .................. sugar is part of the problem. Among
	(15) .................. , 12-year olds have on average only three missing, decayed or filled teeth.
',
'12
 A) their%%B) his%%C) them%%D) theirs',
'A'),
('	Older Britons are the worst in Europe when it comes to keeping their teeth. But British youngsters
	(11) .................. more to smile about because (12) .................. teeth are among the best. Almost
	80% of Britons over 65 have lost all or some (13) .................. their teeth according to a World
	Health Organisation survey. Eating too (14) .................. sugar is part of the problem. Among
	(15) .................. , 12-year olds have on average only three missing, decayed or filled teeth.
',
'13
 A) from%%B) of%%C) among%%D) between',
'B'),
('	Older Britons are the worst in Europe when it comes to keeping their teeth. But British youngsters
	(11) .................. more to smile about because (12) .................. teeth are among the best. Almost
	80% of Britons over 65 have lost all or some (13) .................. their teeth according to a World
	Health Organisation survey. Eating too (14) .................. sugar is part of the problem. Among
	(15) .................. , 12-year olds have on average only three missing, decayed or filled teeth.
',
'14
 A) much %%B) lot%%C) many%%D) deal',
'A'),
(' 	Older Britons are the worst in Europe when it comes to keeping their teeth. But British youngsters
	(11) .................. more to smile about because (12) .................. teeth are among the best. Almost
	80% of Britons over 65 have lost all or some (13) .................. their teeth according to a World
	Health Organisation survey. Eating too (14) .................. sugar is part of the problem. Among
	(15) .................. , 12-year olds have on average only three missing, decayed or filled teeth.
',
'15
  A) person%%B) people%%C) children%%D) family',
'C'),
('	Christopher Columbus and the New World
	On August 3, 1492, Christopher Columbus set sail from Spain to find a new route to India,
	China and Japan. At this time most people thought you would fall off the edge of the world if
	you sailed too far. Yet sailors such as Columbus had seen how a ship appeared to get lower and
	lower on the horizon as it sailed away. For Columbus this (16) .................  that the world was
	round. He (17) ................. to his men about the distance travelled each day. He did not want them
	to think that he did not (18) ................. exactly where they were going. (19) ................. , on October
	12, 1492, Columbus and his men landed on a small island he named San Salvador. Columbus
	believed he was in Asia, (20) ................. he was actually in the Caribbean.
',
'16
 A) made%%B) pointed%%C) 	was%%D) proved',
'D'),
('	Christopher Columbus and the New World
	On August 3, 1492, Christopher Columbus set sail from Spain to find a new route to India,
	China and Japan. At this time most people thought you would fall off the edge of the world if
	you sailed too far. Yet sailors such as Columbus had seen how a ship appeared to get lower and
	lower on the horizon as it sailed away. For Columbus this (16) .................  that the world was
	round. He (17) ................. to his men about the distance travelled each day. He did not want them
	to think that he did not (18) ................. exactly where they were going. (19) ................. , on October
	12, 1492, Columbus and his men landed on a small island he named San Salvador. Columbus
	believed he was in Asia, (20) ................. he was actually in the Caribbean.
',
"17
 A) lied%%B) told%%C) cheated%%D) asked",
'A'),
('	Christopher Columbus and the New World
	On August 3, 1492, Christopher Columbus set sail from Spain to find a new route to India,
	China and Japan. At this time most people thought you would fall off the edge of the world if
	you sailed too far. Yet sailors such as Columbus had seen how a ship appeared to get lower and
	lower on the horizon as it sailed away. For Columbus this (16) .................  that the world was
	round. He (17) ................. to his men about the distance travelled each day. He did not want them
	to think that he did not (18) ................. exactly where they were going. (19) ................. , on October
	12, 1492, Columbus and his men landed on a small island he named San Salvador. Columbus
	believed he was in Asia, (20) ................. he was actually in the Caribbean.
',
'18 
A) find %%B) know%%C) think%%D) expect',
'B'),
('	Christopher Columbus and the New World
	On August 3, 1492, Christopher Columbus set sail from Spain to find a new route to India,
	China and Japan. At this time most people thought you would fall off the edge of the world if
	you sailed too far. Yet sailors such as Columbus had seen how a ship appeared to get lower and
	lower on the horizon as it sailed away. For Columbus this (16) .................  that the world was
	round. He (17) ................. to his men about the distance travelled each day. He did not want them
	to think that he did not (18) ................. exactly where they were going. (19) ................. , on October
	12, 1492, Columbus and his men landed on a small island he named San Salvador. Columbus
	believed he was in Asia, (20) ................. he was actually in the Caribbean.
',
'19
 A)What is he playing?%%
B). What does she play?%%
C) What does he do?%%
D) What is she reading?',
'C'),
('	Christopher Columbus and the New World
	On August 3, 1492, Christopher Columbus set sail from Spain to find a new route to India,
	China and Japan. At this time most people thought you would fall off the edge of the world if
	you sailed too far. Yet sailors such as Columbus had seen how a ship appeared to get lower and
	lower on the horizon as it sailed away. For Columbus this (16) .................  that the world was
	round. He (17) ................. to his men about the distance travelled each day. He did not want them
	to think that he did not (18) ................. exactly where they were going. (19) ................. , on October
	12, 1492, Columbus and his men landed on a small island he named San Salvador. Columbus
	believed he was in Asia, (20) ................. he was actually in the Caribbean.
',
'20
A) as%%B) but%%C) because%%D) if',
'B'),
('•	In this section you must choose the word or phrase which best completes each sentence.
•	For questions 21 to 40, mark one letter A, B, C or D on your Answer Sheet.
21 The children won’t go to sleep .................... we leave a light on outside their bedroom.',
'A) except%%B) otherwise%%C)unless%%D) but',
'C'),
('22 I’ll give you my spare keys in case you .................... home before me.',
'A) 	would get%%B) 	got%%C) 	will get%%D)  get',
'D'),
('23 My holiday in Paris gave me a great .................... to improve my French accent.',
'A) 	occasion%%B) 	chance%%C) hope%%D) possibility',
'B'),
('24 The singer ended the concert .................... her most popular song.',
'A) by%%B)with%%C) in%%D)as',
'B'),
('25 Because it had not rained for several months, there was a ...................... of water.',
'A) shortage %%B) drop %%C) scarce%%D)waste',
'A'),
('26 I’ve always .................... you as my best friend.',
'A) regarded%%B) thought%%C)meant%%D) supposed',
'B'),
('27 She came to live here .................... a month ago.',
'A) quite%%B)beyound%%C) already%%D)  almost',
'D'),
('28 Don’t make such a ....................!  The dentist is only going to look at your teeth.',
'A)fuss%%B)trouble%%C) worry%%D) reaction',
'A'),
('29 He spent a long time looking for a tie which .................... with his new shirt',
'A)fixed%%B)made	%%C) went %%D) wore',
'C'),
("30 Fortunately, .................... from a bump on the head, she suffered no serious injuries from her fall.",
'A)other%%B)except%%C) besides%%D) apart',
'D'),
('31. She had changed so much that .................... anyone recognised her.',
'A)	almost%%B)hardly%%C) not %%D)nearly',
'B'),
('32. .................... teaching English, she also writes children’s books.',
'A)Moreover%%B)As well as%%C) In addition%%D) Apart',
'B'),
('33. It was clear that the young couple were ..................... of taking charge of the restaurant.',
'A)	responsible%%B)	reliable%%C)	capable%%D)	able',
'C'),
('34. The book .................... of ten chapters, each one covering a different topic.',
'A)	comprises%%B)includes%%C) 	consists%%D) 	contains',
'C'),
('35 Mary was disappointed with her new shirt as the colour .................... very quickly',
'A)	bleached%%B)	died	%%C) 	vanished%%D) 	faded',
'D'),
('36. National leaders from all over the world are expected to attend the .................... meeting.',
'A)	peak%%B)	summit	%%C) top %%D) apex',
'B'),
('37.Jane remained calm when she won the lottery and .................... about her business as if nothing had happened.',
'A)came%%B)brought%%C)went%%D)moved',
'C'),
('38. I suggest we ..................... outside the stadium tomorrow at 8.30.',
'A)meeting %%B)meet	%%C) met %%D)will meet',
'B'),
('39. My remarks were ..................... as a joke, but she was offended by them.',
'A)pretended %%B)thought	%%C) meant %%D)supposed',
'C'),
('40.You ought to take up swimming for the ..................... of your health',
'A)concern%%B)relief%%C)sake%%D)cause',
'C');
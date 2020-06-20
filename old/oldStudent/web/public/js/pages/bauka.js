function getBaukaPage() {
	content.innerHTML = '';
	
	notifSet('title', 'text');

	feedback('Smartchat', 	
		['Напишите пару слов о Smartchat','sdaf', 'sdfasdd'],
		[
			// {
			// 	title: 'Что за дела?',
			// 	answers: ['такие дела', 'никаких дел']
			// },
			// {
			// 	title: 'Вопрос 2',
			// 	answers: ['ответ1', 'ответ2', 'Ответ3']
			// }
			// {
			// 	title: 'Вопрос 2',
			// 	answers: ['ответ1', 'ответ2', 'Ответ3']
			// },
			// {
			// 	title: 'Вопрос 2',
			// 	answers: ['ответ1', 'ответ2', 'Ответ3']
			// },
			// {
			// 	title: 'Вопрос 2',
			// 	answers: ['ответ1', 'ответ2', 'Ответ3']
			// }
		],
			(data)=>
			{
				console.log('SMART: ', data)
				feedback('Teacher', ['Оценочка'], [], (data2)=>
					{
						console.log('TEACHER:',data2);
						thanksForFeedback();
					});
			}
		);
}
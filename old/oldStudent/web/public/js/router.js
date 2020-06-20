function generateContent()
	{
		let href = top.location.href.split('/');
		hr = href[3];
		params = href[4];

		if(!hr) hr = 'profile';
		paintMenu(hr);
		switch(hr) 
		{
			case 'profile':  	getProfilePage(); 		break;
			case 'schedule': 	getSchedulePage(); 		break;
			case 'groups': 		getGroupsPage(); 		break;
			case 'courses':     getCoursesPage(); 		break;
			case 'chat': 		getChatPage();			break;
			case 'request': 	
				if(params) getRequestPage(params); 
				else getNotFoundPage();
			break;
			case 'tests': 		getTestsPage();			break;
			case 'test':        
						POST('/test', `method=CHECK&&test_id=${params}`, function(res, status){
							if(status === 200){
								if(res.result[0].count || res.result[0].answers)
									goto(`testresult/${params}`)
								else getPageTest(params);
							}else getNotFoundPage();
						});
			    break;
			case 'testresult':getResultPageTest(params);break;
			case 'homework': 	getHomeWorkPage(params);break;
			case 'homeworks': 	getHomeWorkPage(params);break;
			case 'feedback': 	getFeedbackPage(); 		break;
			case 'exit': 		exitSystem();			break;
			default: 	 		getNotFoundPage();		break;
		}
	}

window.onpopstate = function()
{
	generateContent();
}

generateContent();

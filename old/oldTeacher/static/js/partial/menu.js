
document.getElementById('exit').addEventListener('click', function()
	{
		deleteCookie('SAI');
		deleteCookie('SAT');
		deleteCookie('SAP');
		deleteCookie('SAN');

		top.location.href = '/';
	});

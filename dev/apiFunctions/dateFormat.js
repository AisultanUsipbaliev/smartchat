module.exports = async function(format, date) {
	if(!date) date = new Date()

	let formatted = format
		.replace(/dd/g, 	await dd(date))
        .replace(/mm/g, 	await mm(date))
        .replace(/yyyy/g, 	await yyyy(date))
        .replace(/HH/g, 	await HH(date))
        .replace(/MM/g, 	await MM(date))
        .replace(/SS/g, 	await SS(date))
        .replace(/MS/g, 	await MS(date))
        .replace(/sss/g, 	await sss(date))

	return formatted
}

function mm(date) {
	let mm = (date.getMonth()+1).toString()
	return (mm[1]?mm:"0"+mm[0])
}
function yyyy(date) {
	return date.getFullYear().toString()
}
function dd(date) {
	let dd = date.getDate().toString()
	return (dd[1]?dd:"0"+dd[0])
}
function HH(date) {
	let HH = date.getHours().toString()
	return (HH[1]?HH:"0"+HH[0])
}
function MM(date) {
	let MM = date.getMinutes().toString()
	return (MM[1]?MM:"0"+MM[0])
}
function SS(date) {
	let SS = date.getSeconds().toString()
	return (SS[1]?SS:"0"+SS[0])
}
function MS(date) {
	let MS = date.getMilliseconds().toString()
	if (MS.length === 1) { MS = "0"+MS } 
	else if(MS.length !== 2) { MS = MS[0]+MS[1] }
	return MS
}
function sss(date) {
	let sss = date.getMilliseconds().toString()
	if (sss.length === 1) { sss = "00"+sss } 
	else if(sss.length === 2) { sss = "0"+sss }
	return sss
}
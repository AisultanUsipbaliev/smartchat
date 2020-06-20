module.exports = function(n) {
	let date = new Date()

	let year 	= date.getFullYear()
	let month 	= date.getMonth() + 1
	let day		= date.getDate()
	let hour 	= date.getHours()
	let minutes = date.getMinutes()

	minutes = minutes > 45 || minutes < 15? 0: 30

	if(minutes > 45 || minutes < 15) 

	date = new Date(year, month, day, hour, minutes)

	return date.valueOf()
}
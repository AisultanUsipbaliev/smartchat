module.exports = function(n) {
	if(!n) n = 1
	let date = new Date()

	let year 	= date.getFullYear()
	let month = date.getMonth()
	let day 	= date.getDate() + n

	let hour = 12
	let minutes = 0

	date = new Date(year, month, day, hour, minutes)

	return date.valueOf()
}
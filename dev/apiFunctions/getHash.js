let bcrypt 	= require('bcryptjs')

module.exports = async function(pass) {
	let salt 	= await bcrypt.genSalt(10)
	let hash 	= await bcrypt.hash(pass, salt)
	return hash
}
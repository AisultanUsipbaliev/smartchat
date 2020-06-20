module.exports = async (req, res, next) =>
{
  if(!req.session.sid) 	{ res.sendStatus(401) }
	else 									{ next() }
}
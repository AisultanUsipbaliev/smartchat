let controller = require('../controllers/result');

module.exports = async function(req,res) {
  if(!req.cookies['SAI'])
  {
    res.status(418).json({message: 'no index'});
  }    
  else
  {
    if(!req.body.method)
    {
      res.status(405).json({message: 'no method'});
    }
    else
    {
      let result;
      switch(req.body.method)
      {
        case 'GET':
          result = await controller.Get(req.cookies['SAI']);
          res.status(result.status).json(result);
        break;
        default:
          res.status(405).json({message: 'Invalid method'});
        break;
      }
    }
  }
};



 
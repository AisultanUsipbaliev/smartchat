let controller = require('../controllers/template');

module.exports = async function(req,res) 
{
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
                case "REVERSE":
                    result = await controller.Reverse(req.body);
                    res.status(result.status).json(result);
                break;
                case 'GET-TEMP':
                    result = await controller.GetTemp(req.body, req.cookies['SAI']);
                    res.status(result.status).json(result);
                break;
                case 'USE':
                    result = await controller.Use(req.body, req.cookies['SAI']);
                    res.status(result.status).json(result);
                break;
                case 'GET-PATH-TO-TEMPLATE':
                    result = await controller.GetPathToTemplate(req.body, req.cookies['SAI']);
                    res.status(result.status).json(result);
                break;
                case 'GET':
                    result = await controller.Get(req.body, req.cookies['SAI']);
                    res.status(result.status).json(result);
                break;
                case 'POST':
                    result = await controller.Post(req.body, req.cookies['SAI']);
                    res.status(result.status).json(result);
                break;
                case 'PATCH':
                    result = await controller.Patch(req.body, req.cookies['SAI']);
                    res.status(result.status).json(result);
                break;
                case 'DELETE':
                    result = await controller.Delete(req.body, req.cookies['SAI']);
                    res.status(result.status).json(result);
                break;
                default:
                    res.status(405).json({message: 'Invalid method'});
                break;
            }
        }
    }
}; 
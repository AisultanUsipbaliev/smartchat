let controller = require('../controllers/file');
    
module.exports = async function(req, res)
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
            case "SEND-FILE":
                result = await controller.SendFile(req);
                res.status(result.status).json(result);
            break;
            case 'UPLOAD-PICTURE':
                result = await controller.UploadPicture(req);
                res.status(result.status).json(result);
            break;
            default:
                res.status(405).json({message: 'Invalid method'});
            break;
        }
    }
}
let controller = require('../controllers/template'); 

module.exports = async function(req,res) {
    try {
        startLog('template', {body: req.body, index: req.cookies.SAI});
        if(!req.body.method) throw new Error('no method provided');

        let result;
        switch(req.body.method) {
            case 'GET':         result = await controller.get(req);                 break;
            case 'GET-TEMP':    result = await controller.getTemplates(req);        break;
            case "REVERSE":     result = await controller.reverse(req);             break;
            case 'USE':         result = await controller.useTemplate(req);         break;
            case 'GET-PATH':    result = await controller.getPath(req);             break;
            case 'POST':        result = await controller.createTemplate(req);      break;
            case 'PATCH':       result = await controller.updateTemplate(req);      break;
            case 'DELETE':      result = await controller.deleteTemplate(req);      break;
            default:            result = {status: 405, message: 'invalid method'};  break;
        }
        endLog('template', result);
        res.status(result.status).json(result);
    }
    catch(err) {
        await errorLog('template', {body: req.body, index: req.cookies.SAI}, err)
        res.status(405).json({message: 'Ошибка на сервере'});
    }
};
module.exports = async function(req, res) {
    try {
        startLog('sendFile', {body: req.body, index: req.cookies.SAI});

        let name = ''
        let mas = req.files.uploadFile.name.split('.')
        for(let i=0; i<mas.length-1; i++)
            name += mas[i]
        let ext = mas[mas.length-1]
        
        if(req.files.uploadFile.name == 'blob') ext = 'wav'
        
        if(ext == 'js') return { status: 400, message: 'fuck off!' }

        let fileData = req.files.uploadFile.data
        name = req.body.name? req.body.name : name + (new Date()).valueOf() + '.' + ext
        

        let fs = require('fs');
        await fs.writeFileSync("./../../files/files/" + name, fileData, 'binary');
        endLog('sendFile', name);
        res.status(200).json(name);
    }
    catch(err) {
        await errorLog('sendFile', {body: req.body, index: req.cookies.SAI}, err)
        res.status(202).json({message: 'Ошибка сервера!'});
    }
}
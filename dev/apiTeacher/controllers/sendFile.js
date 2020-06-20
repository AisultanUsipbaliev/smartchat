let fs      = require('fs')
let path    = require('../path')

let teacherModel = require('../../apiModels/teacher')

module.exports = async function(req) {
    if(!req.files)              return {status: 418, message: 'no files'}
    if(!req.files.uploadFile)   return {status: 418, message: 'no uploadFile'}

    let name = ''
    let mas = req.files.uploadFile.name.split('.')
    for(let i=0; i<mas.length-1; i++)
        name += mas[i]
    let ext = mas[mas.length-1]
    
    if(req.files.uploadFile.name == 'blob') ext = 'wav'
    
    if(ext == 'js')     return { status: 400, message: 'fuck off!' }
    if(ext == 'html')   return { status: 400, message: 'fuck off!' }

    let fileData = req.files.uploadFile.data
    
    if (req.body.photo) {
        name = 't'+ req.body.myId + '.' + ext
        await fs.writeFileSync(path.files + '/photo/' + name, fileData, 'binary')
        let setAva = teacherModel.updateAva(name, req.body.myId)
        if (!setAva) return {status: 202, message: 'ava is not updated'}    
    } else {
        name = req.body.name ? req.body.name : name + '-----v' + (new Date()).valueOf() + '-----v' + '.' + ext
        await fs.writeFileSync(path.files + '/files/' + name, fileData, 'binary')
    }

    return {status: 200, name}  
}
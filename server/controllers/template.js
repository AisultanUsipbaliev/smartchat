let model = require('../models/template');

exports.Reverse = async function(data) 
{
    console.log('Reverse')
    try
    {
        if(!data.first) throw new Error('First is undefined');
        if(!data.second) throw new Error('Second is undefined');

        let [firstinfo] = await model.FirstInfo({first: data.first});
        let [secondinfo] = await model.SecondInfo({second: data.second});

        console.log(data.first)
        console.log(firstinfo)

        await model.UpdateFirst({firstInfoOrder: firstinfo.order, secondInfoTemp_id: secondinfo.temp_id});
        await model.UpdateSecont({secondInfoOrder: secondinfo.order, firstInfoTemp_id: firstinfo.temp_id});
        
        return {status: 200};
    }
    catch (err)
    {
        return {status: 418, message: err};
    }
}
exports.GetTemp = async function(data, index)
{
    try
    {
        if(!data.group_id) throw new Error('group_id is undefined');
    
        let group_id = data.group_id;
        let template_id = model.TemplateId({index, group_id});

        if(template_id[0].length>0)
        {
            let mas = [];

            for(let i = 0; i<template_id[0].length; i++)
            {
                let templates = await model.Templates({template_id: template_id[i].temp_id});
                mas.push(templates[0]);
            }
                
            let used_temps = await model.UsedTemps({index, group_id});

            return {status: 200, body: mas, used: used_temps};
        }
        else
        {
            return {status: 202, message: 'no template'};
        }

    }
    catch (err)
    {
        return {status: 418, message: err};
    }
} 
exports.Use = async function(data, index)
{
    try
    {
        if(!data.temp_id || !data.group_id) throw new Error('no temp-id or group_id');

        let used = await model.Used({index, temp_id: data.temp_id, group_id: data.group_id});

        if(used[0].affectedRows>0)
        {
            return {status: 200, message: 'ok'};
        }
        else
        {
            return {status: 202, message: 'troubles with insert'};
        }
    }
    catch (err)
    {
        return {status: 418, message: err}
    }
}
exports.GetPathToTemplate = async function(data, index)
{
    let [teacher_lvl] = await model.TeacherLevel({index});
    let rate = await model.Rate();
    let level = await model.Level();

    if(rate.length > 0 && level.length > 0)
    {

      let rateListObj = {};
      let rateListArr = [];

      for (var i = 0; i < rate.length; i++) {

        let lvlListObj = {};
        let lvlListArr = [];

        for (var k = 0; k < level.length; k++) {

          let [lesson] = await model.Lesson({rate_id: rate[i].rate_id});
          if (level[k].lvl_id!=8) {
            if (teacher_lvl.lvl > k) {
              lvlListObj = {
                lvl_id: level[k].lvl_id,
                lvl_name: level[k].lvl_name,
                lessons: lesson.lessons
              }
              lvlListArr.push(lvlListObj);
            }
          }
        }
        rateListObj = {
          rate_id: rate[i].rate_id,
          rate_name: rate[i].rate_name,
          level: lvlListArr
        }
        rateListArr.push(rateListObj);
      }
      
      return {status: 200, rateListArr};

    }
    else
    {
        return {status: 202, message: 'empty'};
    }
}

exports.Get = async function(data, index)
{
    console.log('popal')
   try
   {
        if (!data.rate_id) throw new Error('rate_id is undefined');
        if (!data.lesson_num) throw new Error('lesson_num is undefined');
        if (!data.lvl_id) throw new Error('lvl_id is undefined');

        let temp = await model.Temp({index, lvl_id: data.lvl_id, rate_id: data.rate_id, lesson_num: data.lesson_num});


        if (temp.length>0) {

            let template = [];
            let templateObj = {};

            for (var i = 0; i < temp.length; i++) {

                console.log(i)

                let content = await model.Content({temp_id: temp[i].temp_id});

                templateObj = {
                    order: temp[i].order,
                    temp_id: temp[i].temp_id,
                    content: content
                }
                template.push(templateObj);

            }

            return {status: 200, template: template};

        } else {

            return {status: 202, message: 'empty temp'};

        }
   }
   catch (err)
   {
        return {status: 418, message: err};
   }
}
exports.Post = async function(data, index)
{
   try
   {
        if (!data.data) throw new Error('data is undefined');
        if (!data.rate_id) throw new Error('rate_id is undefined');
        if (!data.lesson_num) throw new Error('lesson_num is undefined');
        if (!data.lvl_id) throw new Error('lvl_id is undefined');

        let parseData = JSON.parse(data.data);

        let temp = await model.TempPost({index, rate_id: data.rate_id, lesson_num: data.lesson_num, lvl_id: data.lvl_id});

        let w = await model.W({tempInsertId: temp.insertId});

        if (temp.affectedRows>0) {

            for (var i = 0; i < parseData.length; i++) 
            {
                let type = parseData[i].type;
                let content = parseData[i].content;
                if (content.replace(/\s+/g, '')!='') {
                    let cont = await model.Cont({tempId: temp.insertId, type, content});
                }
            }

            let newContent = await model.NewContent({tempId: temp.insertId});

            if (newContent.length>0) 
            {
                let tempinfo = await model.TempInfo({tempId: temp.insertId});

                return {status: 202, temp_id: tempinfo.temp_id, order: tempinfo.order, content: newContent};
            } 
            else 
            {
                return {status: 202, message: 'content not found'};
            }

        } 
        else 
        {
            return {status: 202, message: 'template not created'};
        }
   }
   catch (err)
   {
        return {status: 418, message: 'mes'+err};
   }
}
exports.Patch = async function(data, index)
{
    console.log('popal na Patch: '+data.temp_id)
   try
   {
        if (!data.data) throw new Error('data is undefined');
        if (!data.temp_id) throw new Error('temp_id is undefined');
        if (!data.rate_id) throw new Error('rate_id is undefined');
        if (!data.lesson_num) throw new Error('lesson_num is undefined');
        if (!data.lvl_id) throw new Error('lvl_id is undefined');

        let oldContent = await model.DeleteContent({temp_id: data.temp_id});

        let parseData = JSON.parse(data.data);

        for (var i = 0; i < parseData.length; i++) {
            let type = parseData[i].type;
            let content = parseData[i].content;
            if (content.replace(/\s+/g, '')!='') {
                let cont = await model.Cont({tempId: data.temp_id, type, content});
            }
        }

        let newContent = await model.NewContent({tempId: data.temp_id});

        if (newContent.length>0) {

            let tempinfo = await model.TempInfo({tempId: data.temp_id});

            return {status: 200, temp_id: data.temp_id, order: tempinfo.order, content: newContent};

        } else {

            return {status: 202, message: 'content not found'};

        }

   }
   catch (err)
   {
        return {status: 418, message: err}
   }
}
exports.Delete = async function(data, index)
{
   try
   {
        if (!data.temp_id) throw new Error('temp_id is undefined');
        let content = await model.DeleteContent({temp_id: data.temp_id});
        let template = await model.DeleteTemplate({temp_id: data.temp_id});

        if (template.affectedRows>0) {
            return {status: 200, message: 'template deleted'};
        } else {
            return {status: 200, message: 'template not found'};
        }
   }
   catch (err)
   {
        return {status: 418, message: err};
   }
}



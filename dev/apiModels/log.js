let SQL = require('../apiFunctions/query')

// Select
	exports.getAllLogs = async (order, id, limit, text) => {
		if (order) {
			return await SQL(`	select id, act, date_format(dt,'%d.%m.%Y %H:%i:%s') as dt, isteacher, danger  
								from log 
								where id>?
								and (
									date_format(dt,'%d.%m.%Y %H:%i:%s') like concat('%', ? ,'%') 
									or act like concat('%', ? ,'%') 
								) 
								order by id limit ?`, [id, text, text, limit]);
		}	else {
			if (id) {
				return await SQL(`	select id, act, date_format(dt,'%d.%m.%Y %H:%i:%s') as dt, isteacher, danger  
									from log 
									where id<? 
									and (
										date_format(dt,'%d.%m.%Y %H:%i:%s') like concat('%', ? ,'%') 
										or act like concat('%', ? ,'%') 
									)
									order by id desc limit ?`, [id, text, text, limit]);
			} else {
				return await SQL(`	select id, act, date_format(dt,'%d.%m.%Y %H:%i:%s') as dt, isteacher, danger  
									from log 
									where id<( select max(id) from log )
									and (
										date_format(dt,'%d.%m.%Y %H:%i:%s') like concat('%', ? ,'%') 
										or act like concat('%', ? ,'%') 
									)
									order by id desc limit ?`, [text, text, limit]);
			}
		}		
	}
	exports.getFilteredLogs = async (order, id, limit, filter, text) => {
		if (order) {
			return await SQL(`	select id, act, date_format(dt,'%d.%m.%Y %H:%i:%s') as dt, isteacher, danger  
								from log 
								where (id>? and isteacher = ?) 
								and (
									date_format(dt,'%d.%m.%Y %H:%i:%s') like concat('%', ? ,'%') 
									or act like concat('%', ? ,'%') 
								)
								order by id limit ?`, [id, filter, text, text, limit]);
		}	else {
			if (id) {
				return await SQL(`	select id, act, date_format(dt,'%d.%m.%Y %H:%i:%s') as dt, isteacher, danger  
									from log 
									where (id<? and isteacher = ?) 
									and (
										date_format(dt,'%d.%m.%Y %H:%i:%s') like concat('%', ? ,'%') 
										or act like concat('%', ? ,'%') 
									)
									order by id desc limit ?`, [id, filter, text, text, limit]);
			} else {
				return await SQL(`	select id, act, date_format(dt,'%d.%m.%Y %H:%i:%s') as dt, isteacher, danger  
									from log 
									where (id<(select max(id) from log) and isteacher = ?)
									and (
										date_format(dt,'%d.%m.%Y %H:%i:%s') like concat('%', ? ,'%') 
										or act like concat('%', ? ,'%') 
									)
									order by id desc limit ?`, [filter, text, text, limit]);
			} 	
		}		
	}


// Update

// Insert
	exports.add = async function(action, danger) {
		return (await SQL('insert into log(act, danger) values (?, ?)', [action, danger])).affectedRows
	}
// Delete 
	exports.remove = async (id) => {
		return (await SQL('delete from log where id = ?', id)).affectedRows
	}
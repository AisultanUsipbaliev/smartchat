let SQL = require('../apiFunctions/query')

// select 
	exports.getRates = async () => {
		return await SQL('select * from rate where active = 1')
	}
	exports.getActiveRate = async (id) => {
		return (await SQL('select * from rate where rate_id = ? and active = 1', [id]))[0]
	}	
	exports.getRate = async (id) => {
		return (await SQL('select * from rate where rate_id = ?', [id]))[0]
	}
	exports.getRateList = async (column, order, from, limit, text) => {
		return await SQL(`	select r.rate_id, r.rate_name, r.rate_title, r.rate_cost, r.lessons, r.rate_content, r.sale, r.oldCost, r.active, r.image
							from rate r
							where
							r.rate_name like concat('%', ? ,'%') 
							or r.rate_cost like concat('%', ? ,'%')
							or r.rate_content like concat('%', ? ,'%')
							order by ? ${order} limit ?, ?`, [text,text,text,column,from,limit]);
	}

// insert
	exports.insertRate = async (rate_name, rate_content, rate_title, lessons, rate_cost, sale, oldCost, image) => {
		return await SQL(`insert into rate (rate_name, rate_content, rate_title, lessons, rate_cost, sale, oldCost, image, unlim, group_type, active) values(?,?,?,?,?,?,?,?,0,1,1)`,
						[rate_name, rate_content, rate_title, lessons, rate_cost, sale, oldCost, image]);
	}

// update
	exports.updateRate = async (rate_id, rate_name, rate_content, rate_title, lessons, rate_cost, sale, oldCost, image) => {
		return await SQL(`	update rate set rate_name = ?, rate_content = ?, rate_title = ?, lessons = ?, rate_cost = ?, sale = ?, oldCost = ?, image = ? where rate_id = ?`, 
						[rate_name, rate_content, rate_title, lessons, rate_cost, sale, oldCost, image, rate_id]);
	}

	exports.changeActivate = async (rate_id, newStat) => {
		return await SQL(`update rate set active = ? where rate_id = ?`, [newStat, rate_id]);
	} 

// delete
	exports.deleteRate = async (rateId) => {
		return (await SQL('delete from rate where rate_id = ? ', [rateId])).affectedRows
	}
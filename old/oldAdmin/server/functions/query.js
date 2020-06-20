const mysql = require('mysql2/promise');

module.exports = async (query, data) =>
{
  let con = await mysql.createConnection(config.mysql_server);
  try {
    if(data)  { let [result] = await con.query(query, data); return result }
    else      { let [result] = await con.query(query); return result }
  } catch(err) { 
    console.log('SQL::ERROR:: ' + query + '[ ' + JSON.stringify(data? data:{}) + ']', err); 
  } finally { con.end() }
}
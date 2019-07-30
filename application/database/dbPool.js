//mysql2 has better performance/reliability and supports prepared statements
const mysql2 = require("mysql2");

//improves the latency of queries by avoiding the overhead of establishing new connections for every request
const pool = mysql2.createPool({

	// TODO - implement proxy connection
	connectionLimit: 50,
	host: "chessdb.cabihvrofnfu.us-west-1.rds.amazonaws.com",
	user: "root",
	password: "Team7isthebestteam",
	database: "csc667teamchess"

});

function testDB(){

	pool.getConnection(function(err, connection) {
  		if (err) throw err; // not connected!
  		console.log("Connected to MySQL database successfully...");
  		connection.release();

  	});

}

function queryDB(sql, inserts, callback){

	//'escapes' all user inputed values in SQL query to avoid SQL injection attack
	preparedQuery = mysql2.format(sql, inserts);

	/*
	pool execute command combines pool.getConnection(), connection.query and pool.closeConnection() in a single statement
	this both reuses existing connections and avoids leaving any connections 'open'
	If you execute same query again, it will be picked from a LRU cache
    	which will save query preparation time and result in better performance
   	 */
    	pool.execute(preparedQuery, function (err, results, fields) {

    		if (err) throw err;
    		callback(results);

   	});

}

function closePool(){

    	pool.end();
    	
}

module.exports = {
	testDB,
	queryDB,
	closePool
};

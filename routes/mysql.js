

var ejs = require('ejs');// importing module ejs
var mysql = require('mysql');// importing module mysql
var pool = [];
/*
 * exports.createConnectionPool = function() { pool = mysql.createPool({ connectionLimit : 500,
 * waitForConnections : true, queueLimit : 0, multipleStatements: true, host : 'localhost', // host
 * where mysql server is running user : 'root', // user for the mysql application password :
 * 'abcd@1234', // password for the mysql application database : 'ebaydb', port : 3306 }); };
 */
function createConnection() {
	var connection = mysql.createConnection({
		host : 'localhost', // host where mysql server is running
		user : 'root', // user for the mysql application
		password : 'abcd@1234', // password for the mysql application
		database : 'ebaydb', // database name
		port : 3306
	// port, it is 3306 by default for mysql
	});

	return connection;
}

exports.createConnectionPool = function() {

	for (var i = 0; i < 500; i++) {

		
		pool.push(createConnection());
	}
};

exports.destroyConnections = function() {

	for (var i = 0; i < 500; i++) {
		pool[i].end();
	}

};


function getConnection() {
	var pooledConn = null;
	var isConnAvail = false;
	if(pool.length>0){
		return pool.pop();
	}else{
		setTimeout(getConnection(),1000);
	}
	
}


function releaseConn(pooledConn){
	pool.push(pooledConn);
}

// fetching the data from the sql server
exports.fetchUserDtlsWithCredentials = function(callback, sqlQuery, options) {
	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
};

exports.updateLastLoginTime = function(callback, sqlQuery, options) {
	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
	

};

exports.createNewUserAcct = function(callback, sqlQuery) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				

			});
			releaseConn(connection);
};

exports.addNewUserRecord = function(callback, sqlQuery, options) {

	console.log("\nIn server :registerNewUser");
	console.log("\nQuery for adding registering new user : " + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {

				if (err) {
					console.log("ERROR : " + err.message);
					console.log("ERROR : " + err.code);
					callback(err, rows);
				} else {
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});

			releaseConn(connection);

};

exports.fetchListings = function(callback, sqlQuery) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});

			releaseConn(connection);
};

exports.fetchMaxBidAmt = function(callback, sqlQuery) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				

			});
			releaseConn(connection);
	};

exports.addItemToCart = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);
	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
		
};

exports.addDtlsToCart = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
		
};

exports.fetchCartForUser = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
		
};

exports.removeItemFromCartDtl = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});

			releaseConn(connection);
};

exports.removeCartEntry = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
		
};

exports.updateAcctForPaypalDtls = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
};

exports.addItemDtls = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
};

exports.addListingDtls = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
};

exports.addShippingDtls = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
};

exports.addOrderDtls = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
	
};

exports.updateBuyerAcctForAmt = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
	
};

exports.insertTxnDtlsForOrderinDb = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});

			releaseConn(connection);
};

exports.updateSellerForAmtCrdtInDb = function(callback, sqlQuery) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
		
};

exports.updateItemInventoryInDb = function(callback, sqlQuery) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});

			releaseConn(connection);
};

exports.updateCartStatus = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
};

exports.insertBidDtls = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
		
};

//---------------------------------------------------
exports.fetchUserBuyDtls = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});

			releaseConn(connection);
};

exports.fetchUserSellDtls = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
		
};

exports.fetchUserBidDtls = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
};

exports.fetchUserPersonalDtls = function(callback, sqlQuery, options) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection();
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				
			});
			releaseConn(connection);
		
};

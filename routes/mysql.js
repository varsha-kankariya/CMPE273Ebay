/**
 * 
 */

var ejs = require('ejs');// importing module ejs
var mysql = require('mysql');// importing module mysql
var pool;
exports.createConnectionPool = function() {
	pool = mysql.createPool({
		connectionLimit : 500,
		waitForConnections : true,
		queueLimit : 0,
		multipleStatements: true,
		host : 'localhost', // host where mysql server is running
		user : 'root', // user for the mysql application
		password : 'abcd@1234', // password for the mysql application
		database : 'ebaydb',
		port : 3306
	});

};

// fetching the data from the sql server
exports.fetchUserDtlsWithCredentials = function(callback, sqlQuery, options) {
	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery, options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});

};

exports.createNewUserAcct = function(callback, sqlQuery) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();

			});

		}
	});
};

exports.addNewUserRecord = function(callback, sqlQuery, options) {

	console.log("\nIn server :registerNewUser");
	console.log("\nQuery for adding registering new user : " + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {

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
				connection.release();
			});

		}
	});

};

exports.fetchListings = function(callback, sqlQuery) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};


exports.addItemToCart = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};

exports.addDtlsToCart = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options,function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};


exports.fetchCartForUser = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options,function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};

exports.removeItemFromCartDtl = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};



exports.removeCartEntry = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};

exports.updateAcctForPaypalDtls = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};


exports.addItemDtls = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};


exports.addListingDtls = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};

exports.addShippingDtls = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};


exports.addOrderDtls = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};

exports.updateBuyerAcctForAmt = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};


exports.insertTxnDtlsForOrderinDb = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};

exports.updateSellerForAmtCrdtInDb = function(callback, sqlQuery) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};



exports.updateItemInventoryInDb = function(callback, sqlQuery) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};



exports.updateCartStatus = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};

exports.insertBidDtls = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};

//---------------------------------------------------
exports.fetchUserBuyDtls = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};

exports.fetchUserSellDtls = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};

exports.fetchUserBidDtls = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};


exports.fetchUserPersonalDtls = function(callback, sqlQuery,options) {

	console.log("\nSQL Query::" + sqlQuery);

	pool.getConnection(function(err, connection) {
		if (err) {
			throw err;
		} else {
			connection.query(sqlQuery,options, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
				console.log("\nConnection released..");
				connection.release();
			});

		}
	});
};








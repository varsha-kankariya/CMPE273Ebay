/**
 * New node file
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var sql_queries = require('./sql_queries');
var bcrypt = require('bcrypt-nodejs');

//var winston = require('winston');

function generateHash(password) {
	 return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

function populateCartAndTotalCost(req, results) {

	var cartItems = [];
	var totalCostOfCart = 0;
	for (var i = 0; i < results.length; i++) {

		var totalCostOfEachItem = Number(results[i].total_cost);

		//This totalCost represents the total cost of the Cart
		console.log("In server : logn.js : populateCartAndTotalCost() : cost from result : " + totalCostOfEachItem);
		totalCostOfCart += totalCostOfEachItem;

		var itemDtls = {
			listing_id : results[i].listing_id,
			cart_id : results[i].cart_id,
			cart_dtl_id : results[i].cart_dtl_id,
			qty : results[i].qty,
			totalCost : totalCostOfEachItem,
			per_unit_cost : results[i].per_unit_cost,
			item_name : results[i].item_name,
			item_desc : results[i].item_desc,
			seller_name : results[i].seller_name,
			seller_id : results[i].seller_id
		};

		cartItems.push(itemDtls);
	}
	//Set the cart in the session
	req.session.cartItems = cartItems;
	console.log("In server : logn.js : populateCartAndTotalCost() : cartItems as string : " + JSON.stringify(cartItems));
	//Set the total cost in the session
	req.session.totalCostOfCart = totalCostOfCart;
	console.log("In server : logn.js : populateCartAndTotalCost() : totalCostOfCart : " + totalCostOfCart);
}

/**
 * Checks if the user who is trying to log in is already a registered user.If yes-> the cart details
 * are fetched from database and kept in session If no-> user is informed that he/she needs to
 * register
 */
exports.checkLogin = function(req, res) {
	// These two variables come from the form on
	// the views/login.hbs page
	var email_id = req.param("email_id");
	var userPasswd = req.param("passwd");
	var json_resp;
	// If the username and password match
	global.winston.log('info',email_id +" : User trying to login to the system.");
	mysql.fetchUserDtlsWithCredentials(function(err, results) {
		if (err) {
			console.log("Error in checkLogin() : "+err.message);
			throw err;
		} else {
			if (results.length > 0) {

				bcrypt.compare(userPasswd, results[0].passwd, function(err, isPasswdValid) {

					if (err) {
						global.winston.log('info',email_id +" : Invalid Login");
						console.log("Invalid Login");
						json_resp = {
							"statusCode" : 401
						};
						res.send(json_resp);
						res.end();///Erro while comparing the hashes
					} else {

						if (isPasswdValid == true) { //Valid Login

							console.log("valid Login");
							var userDtlsAsStr = JSON.stringify(results[0]);
							console.log("Stringified userDtls : " + userDtlsAsStr);
							req.session.user_seq_id = results[0].user_id;
							req.session.email_id = results[0].email_id;
							req.session.acct_id = results[0].acct_id;
							global.winston.log('info',req.session.email_id +" : Valid Login");
							console.log("Fetching user dtls : Acct Id : " + results[0].acct_id);

							console.log("In server : user email id : " + req.session.email_id);

							mysql.fetchCartForUser(function(err, results) {

								if (err) {
									console.log("Error while fetching cart for user : "+ err.message);
									throw err;
								} else {
									global.winston.log('info',req.session.email_id +" : Fetching cart for the user");
									console.log("In server : logn.js : checkLogin() : results as string : " + JSON.stringify(results));
									if (results.length > 0) {
										//Set the cart_id in the session
										req.session.cart_id = results[0].cart_id;
										//Set the cart status in the session
										req.session.cart_status = results[0].cart_status;
										//Populate the cartItems array of the session with the result from the db and also the totalCost of the cart
										populateCartAndTotalCost(req, results);
									} else {
										req.session.cartItems = [];
										req.session.totalCostOfCart = 0;
									}

									console.log("In server :  User details after login : " + userDtlsAsStr);
									json_resp = {
										"statusCode" : 200,
										"cartItems" : JSON.stringify(req.session.cartItems),
										"totalCostOfCart" : req.session.totalCostOfCart,
										"userDtls" : userDtlsAsStr
									};

									res.send(json_resp);
									res.end();
								}

							}, sql_queries.FETCH_CART_FOR_USER, [ req.session.user_seq_id ]);

						} else { //Invalid Login
							console.log("Invalid Login");
							global.winston.log('info',req.session.email_id +" : Invalid Login");
							json_resp = {
								"statusCode" : 401
							};
							res.send(json_resp);
							res.end();
						}

					}

				});

			}
			//If no user record is found in db that means the user has not registered yet
			else {
				console.log("Invalid Login");
				global.winston.log('info',email_id +" : Invalid Login");
				json_resp = {
					"statusCode" : 401
				};
				res.send(json_resp);
				res.end();
			}

		}
	}, sql_queries.FETCH_USER_DTLS, [ email_id ]);

};

exports.redirectToHomepage = function(req, res) {

	var json_resp = "";
	var strListings = "";
	var actualList;
	console.log("In server : redirectToHomepage() ");
	global.winston.log('info',req.session.email_id +" : Redirecting to home page");
	// Checks before redirecting whether the session is valid
	if (req.session.email_id) {
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded

		//fetch the listings for the user

		mysql.fetchListings(function(err, results) {
			
			if (err) {
				console.log("Error in redirectToHomepage(): " + err.message);
				throw err;
			} else {
				actualList = results;
				console.log("Fetched listings for all users");

				strListings = JSON.stringify(actualList);

				console.log("Listings for user : " + strListings);

				console.log("Not to maintain headers");
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

				var json_resp = {

					"cartItems" : JSON.stringify(req.session.cartItems),
					"totalCostOfCart" : req.session.totalCostOfCart,
					"listings" : strListings
				};

				console.log("JSON response  : " + json_resp.listings);

				res.send(json_resp);
				res.end();

			}

		}, sql_queries.FETCH_LISTINGS_OF_ALL_USERS);

		/*
		 * res.render("homepage", { username : req.session.username });
		 */
	} else {
		res.redirect('/');
	}
};

function createNewUserRecord(req, res, acct_id) {
	var json_resp;
	var hashedPasswd = generateHash(req.body.passwd);
	console.log("Hashed Password :" + hashedPasswd);
	global.winston.log('info',req.body.email_id +" : Registering new user");
	mysql.addNewUserRecord(function(err, results) {

		if (err) {

			if (err.code == 'ER_DUP_ENTRY') {
				console.log("In server : Some error while registering the user : " + err.code);
				global.winston.log('info',req.body.email_id +" : User already has a account");
				json_resp = {
					"status_code" : 402
				};
			} else {
				console.log("Error in createNewUserRecord() : "+err.message);
				json_resp = {
					"status_code" : 401
				};
			}
			res.send(json_resp);

		} else {
			if (results.insertId) {
				global.winston.log('info',req.body.email_id +" : New user account created");
				console.log("In server : Registering a new user : " + results.insertId);
				json_resp = {
					"user_id" : results.insertId,
					"status_code" : 200
				};
			} else {
				console.log("Could not register the user!!");
				json_resp = {
					"status_code" : 401
				};
			}

			res.send(json_resp);
		}

	}, sql_queries.ADD_NEW_USER_REC, [ req.body.first_name, req.body.last_name, req.body.contact_no, req.body.birthdate, req.body.email_id, hashedPasswd, acct_id ]);
}

exports.registerUser = function(req, res) {
	var json_resp;
	console.log("Creating a new account for the user!!");

	mysql.createNewUserAcct(function(err, results) {
		if (err) {
			global.winston.log('info',req.body.email_id +" : Error : " + err.message);
			throw err;
		} else {
			if (results.insertId) {
				console.log("Created account for new user!!!");

				createNewUserRecord(req, res, results.insertId);
			} else {
				console.log("COuld not create account for new user!!");
				json_resp = {
					"statusCode" : 401
				};
				res.send(json_resp);
				res.end();
			}
		}

	}, sql_queries.ADD_NEW_USER_ACCT);

};

// Logout the user - invalidate the session
exports.logout = function(req, res) {
	console.log("In server : Destroying session");
	global.winston.log('info',req.session.email_id +" : User logging out");
	req.session.destroy();

	res.redirect('/');
};

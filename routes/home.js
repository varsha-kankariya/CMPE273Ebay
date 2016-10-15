"use strict;"

var ejs = require("ejs");
var mysql = require('./mysql');
var sql_queries = require('./sql_queries');

function prepareItemDtlForCart(req, cart_dtl_id) {

	var qty = Number(req.param("qty"));
	var per_unit_cost = Number(req.param("per_unit_cost"));
	var totalCost = qty * per_unit_cost;
	//Here the 'qty' is the orderd no of pieces by the user
	//Here the 'totalCost' is per item
	var itemDtls = {
		listing_id : req.param("listing_id"),
		cart_id : req.session.cart_id,
		cart_dtl_id : cart_dtl_id,
		qty : req.param("qty"),
		totalCost : totalCost,
		per_unit_cost : per_unit_cost,
		item_name : req.param("item_name"),
		item_desc : req.param("item_desc"),
		seller_name : req.param("seller_name"),
		seller_id : req.param("seller_id")
	};
	console.log("In server : home.js : prepareItemDtlForCart() : ItemDtl :" + JSON.stringify(itemDtls));
	return itemDtls;
}

function addDtlsToCartForItem(req, res) {
	var json_resp;
	//Get the user_id
	var user_id = req.param("user_id");
	//Get the listing_id
	var listing_id = req.param("listing_id");
	//Get the quantity of the items to be added to the cart
	var qty = Number(req.param("qty"));
	//Cost of per piece of the item
	var per_unit_cost = Number(req.param("per_unit_cost"));
	//Get cart_id of the cart
	var cart_id = req.session.cart_id;
	//Calculate the total cost of the item for the quantity selected
	var totalCost = per_unit_cost * qty;
	//JSON string for cartItems
	var cartItemsAsStr = '';

	var totalCostOfCartAsNo = Number(req.session.totalCostOfCart);
	mysql.addDtlsToCart(function(err, result) {
		if (err) {
			throw err;
		} else {
			if (result.insertId) {

				//Push the item details to the cart in session
				console.log("Pushing the items to the cart in session");
				req.session.cartItems.push(prepareItemDtlForCart(req, result.insertId));
				//Increase the total cost of the cart by current listing's cost
				totalCostOfCartAsNo += totalCost;
				req.session.totalCostOfCart = totalCostOfCartAsNo;
				console.log("In server : home.js : totalCostOfCart : " + req.session.totalCostOfCart);
				console.log("In server : home.js : cart dtls from session :" + req.session.cartItems[0].item_name);
				cartItemsAsStr = JSON.stringify(req.session.cartItems);
				console.log("In server : home.js : cart dtls as string :" + cartItemsAsStr);
				global.winston.log('info',req.session.email_id +" : Added item to the cart : Listing Id : " + listing_id);
				json_resp = {

					"statusCode" : 200,
					"cartItems" : cartItemsAsStr,
					"totalCostOfCart" : req.session.totalCostOfCart
				};
			} else {
				global.winston.log('info',req.session.email_id + " : Couldn't add item to the cart.");
				console.log("In server : couldn't add cart details to the database. ");
				json_resp = {
					"statusCode" : 401
				};
			}
			res.send(json_resp);
			res.end();
		}
	}, sql_queries.ADD_DATA_TO_CART_DTL, [ cart_id, listing_id, qty, totalCost ]);

}

function addItemsToCartForFirstTime(req, res) {
	var user_seq_id = req.param("user_id");
	var json_resp;
	mysql.addItemToCart(function(err, results) {

		if (err) {
			throw err;
		} else {

			if (results.insertId) {
				var cart_id = results.insertId;
				req.session.cart_id = cart_id;
				addDtlsToCartForItem(req, res);

			} else {
				console.log("In server : could not add item to the cart");
				json_resp = {
					"statusCode" : 401

				};
				res.send(json_resp);
				res.end();
			}

		}

	}, sql_queries.ADD_DATA_TO_CART, [ user_seq_id, 'IN_PROGRESS' ]);

}

exports.addItemToCart = function(req, res) {

	var cart_id = req.session.cart_id;
	global.winston.log('info',req.session.email_id +" : Adding item to the cart : Listing Id: " + req.param("listing_id"));
	console.log("In server : addItemToCart() : No of items in cart : " + req.session.cartItems.length);
	//If the item to be added is the first item
	if (req.session.cartItems.length == 0) {
		console.log("In server : adding the first item to the cart");
		addItemsToCartForFirstTime(req, res);
	} else {
		console.log("In server : Cart already present.So just adding details");
		addDtlsToCartForItem(req, res);
	}
};

	function addListingDtlsToDb(req, res, item_seq_id) {

		var json_resp;

		mysql.addListingDtls(function(err, results) {

			if (err) {
				throw err;
			} else {
				if (results) {
					console.log("Added listing details successfully!!");
					json_resp = {
						"statusCode" : 200
					};
				} else {
					console.log("In server : Could not add listing details!!!");
					json_resp = {
						"statusCode" : 401

					};

				}
				res.send(json_resp);
				res.end();

			}

		}, sql_queries.ADD_LISTING_DTLS, [ req.param("list_type"), item_seq_id, req.param("price"), req.session.user_seq_id ]);
	}

	function addItemsDtlsToDb(req, res) {

		var json_resp;
		console.log("In server : addItemsDtlsToDb : price of the item  : " + req.param("price"));
		mysql.addItemDtls(function(err, results) {

			if (err) {
				throw err;
			} else {
				if (results) {
					console.log("Added item details successfully!!");
					addListingDtlsToDb(req, res, results.insertId);
				} else {
					console.log("In server : Could not add item details!!!");
					json_resp = {
						"statusCode" : 401

					};
					res.send(json_resp);
					res.end();
				}

			}

		}, sql_queries.ADD_ITEM_DTLS, [ req.param("item_name"), req.param("item_desc"), req.param("price"), req.param("total_qty"), req.session.user_seq_id ]);
	}

	exports.listItem = function(req, res) {

		var json_resp;
		global.winston.log('info',req.session.email_id + " : Adding a new listing.");
		mysql.updateAcctForPaypalDtls(function(err, results) {

			if (err) {
				global.winston.log('info',req.session.email_id + " : Error : "+ err.message);
				throw err;
			} else {
				if (results) {
					console.log("Added Paypal dtls to user's account!!");
					addItemsDtlsToDb(req, res);
				} else {
					console.log("In server : Could not add Paypal dtls to user's account!!!");
					json_resp = {
						"statusCode" : 401

					};
					res.send(json_resp);
					res.end();
				}

			}

		}, sql_queries.UPDATE_ACCT_FOR_PAYPAL_DTLS, [ req.param("paypal_emaiIId"), req.session.acct_id ]);
	};
	
	
	exports.saveBidDtls = function(req,res){
		var json_resp;
		console.log("Saving the bidding details in DB!!!");
		global.winston.log('info',req.session.email_id + " : Bidded on item with listing Id : "+ req.param("listing_id"));
		mysql.insertBidDtls(function(err,results) {
			
			if(err){
				throw err;
			}else{
				if(results){
					json_resp ={
							"statusCode" : 200
					};
				}else{
					json_resp ={
							"statusCode" : 401
					};
				}
				res.send(json_resp);
				res.end();
			}
			
		}, sql_queries.ADD_BID_DTLS, [req.param("listing_id"),req.session.user_seq_id,req.param("bid_amt"),'F']);
	};
	

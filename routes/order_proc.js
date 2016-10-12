var ejs = require("ejs");
var mysql = require('./mysql');
var sql_queries = require('./sql_queries');
var mysqlModule = require('mysql');


function updateItemInventory(req,res){
	
	var sqlQuery = "";
	var json_resp;
	var cartItems = req.session.cartItems;
	for(var i=0; i< cartItems.length; i++){
		sqlQuery+=	mysqlModule.format(sql_queries.UPDATE_ITEM_INVT,[cartItems[i].qty,cartItems[i].listing_id]);
		
	}
	
	mysql.updateItemInventoryInDb(function(err,results) {
		
		if(err){
			throw err;
		}else{
			if(results){
				console.log("Confirmed ore")
				json_resp = {
						"status_code" : 200
					};
				res.send(json_resp);
				res.end();
			}else{
				console.log("updateItemInventory : Could not update item inventory for orders confirmed");
				json_resp = {
						"status_code" : 401
					};
				res.send(json_resp);
				res.end();
			}
		}
		
	}, sqlQuery);
	
}


function updateSellerDtlsForAmtCredited(req,res){
	var sqlQuery = "";
	var json_resp;
	var cartItems = req.session.cartItems;
	console.log("Cart Items while updating seller dtls  = "+ JSON.stringify(cartItems));
	for(var i=0; i< cartItems.length; i++){
		sqlQuery+=	mysqlModule.format(sql_queries.CRDT_AMT_IN_SELLER_ACCT,[cartItems[i].totalCost,cartItems[i].seller_id]);
		
	}
	
	mysql.updateSellerForAmtCrdtInDb(function(err,results){
		
		if(err){
			throw err;
		}else{
			if(results){
				updateItemInventory(req,res);
			}else{
				console.log("updateSellerDtlsForAmtCredited : Could not update seller details for amount to be credited");
				json_resp = {
						"status_code" : 401
					};
				res.send(json_resp);
				res.end();
			}
		}
		
		
		
	},sqlQuery);
	
}



function insertTxnDtlsForOrder(req,res){
	var json_resp;
	
	var txnValues=[];
	var cartItems = req.session.cartItems;
	var order_seq_id = req.session.order_seq_id;
	//Prepare the transaction related values for bulk push
	for(var i=0; i< cartItems.length; i++){
		var item =[];
		item.push(order_seq_id);
		item.push(cartItems[i].listing_id);
		item.push(cartItems[i].seller_id);
		item.push(cartItems[i].totalCost);
		item.push(cartItems[i].qty);
		txnValues.push(item);
	}

	
	
	mysql.insertTxnDtlsForOrderinDb(function(err,results) {
		if(err){
			throw err;
		}else{
			if(results){
			updateSellerDtlsForAmtCredited(req,res);
			}else{
				console.log("insertTxnDtlsForOrder : Could not add txn dtls to table");
				json_resp = {
						"status_code" : 401
					};
				res.send(json_resp);
				res.end();
			}
			
		}
		
		
	}, sql_queries.ADD_TXN_DTL, [txnValues]);
	
}


function updateCartStatus(req,res){
	var json_resp;
	mysql.updateCartStatus(function(err,results) {
		if(err){
			throw err;
		}else{
			if(results){
				insertTxnDtlsForOrder(req,res);
			}else{
				console.log("updateCartStatus : Could not change cart status");
				json_resp = {
						"status_code" : 401
					};
				res.send(json_resp);
				res.end();
			}
		}
	}, sql_queries.UPDATE_CART_STATUS, ['ORDERED', req.session.cart_id]);
	
}

function updateBuyerAcctForAmt(req,res){
	var json_resp;
	console.log("Updating buyer account for amount debited");
	mysql.updateBuyerAcctForAmt(function(err,results) {
		
		if(err){
			throw err;
		}else{
			if(results){
				updateCartStatus(req,res);
			}else{
				console.log("updateBuyerAcctForAmt : there was some error while debiting amount from buyer account");
				json_resp = {
						"status_code" : 401
					};
				res.send(json_resp);
				res.end();
			}
		}
		
		
	}, sql_queries.UPDATE_BUYER_ACCT, [req.param("cardNo"),req.param("cardExpdate"),req.param("cardSecNo"),req.param("totalCostOfOrder"),req.session.acct_id]);
}

function insertOrderDtlsinDb(req,res,shipping_seq_id){
	var json_resp;
	var order_seq_id;
	console.log("Inserting shipping details");
	mysql.addOrderDtls(function(err,results) {
		if(err){
			throw err;
		}else{
			if(results){
				req.session.order_seq_id = results.insertId;
				console.log("insertOrderDtlsinDb :Order Id : "+req.session.order_seq_id);
				updateBuyerAcctForAmt(req,res);
			}else{
				console.log("insertOrderDtlsinDb : There was some error while adding order details");
				json_resp = {
						"status_code" : 401
					};
				res.send(json_resp);
				res.end();
			}
		}
	}, sql_queries.ADD_ORDER_DTL, [req.session.user_seq_id,shipping_seq_id,'IN_PROGRESS',req.session.cart_id]);
	
} 

function insertShippingDtlsinDb(req,res){
	var shipType = JSON.parse(req.param("shipType"));
	var json_resp;
	mysql.addShippingDtls(function(err,results) {
		if(err){
			
			throw err;
		}else{
			
			if(results.insertId){
				
				insertOrderDtlsinDb(req,res,results.insertId);
				
			}else{
				console.log("insertShippingDtlsinDb : There was some error while adding shipping details");
				json_resp = {
						"status_code" : 401
					};
				res.send(json_resp);
				res.end();
				
			}
		}
	}, sql_queries.ADD_SHIPPING_DTL, ['PREPARING',shipType.ship_cost,req.param("ship_street_addr1"),req.param("ship_street_addr2"),req.param("ship_city"),req.param("ship_state"),req.param("ship_cntry"),req.param("ship_zipcode"),req.param("ship_phoneno"),shipType.type]);
	
}



exports.confirmOrder =function(req,res){
	
	insertShippingDtlsinDb(req,res);
	
};
var ejs = require("ejs");
var mysql = require('./mysql');
var sql_queries = require('./sql_queries');


function updateCartStatus(req,res){
	var json_resp;
	mysql.updateCartStatus(function(err,results) {
		if(err){
			throw err;
		}else{
			if(results){
				
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
		
		
	}, sql_queries.DBT_AMT_FROM_BUYER_ACCT, [req.param("totalCostOfOrder"),req.session.user_seq_id]);
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
				order_seq_id = results.insertId;
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
	}, sql_queries.ADD_SHIPPING_DTL, ['PREPARING',shipType.ship_cost,req.param("ship_street_addr2"),req.param("ship_city"),req.param("ship_state"),req.param("ship_cntry"),req.parma("ship_zipcode"),req.param("ship_phoneno"),shipType.type]);
	
}



exports.confirmOrder =function(req,res){
	
	insertShippingDtlsinDb(req,res);
	
};
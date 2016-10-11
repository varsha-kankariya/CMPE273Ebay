var ejs = require("ejs");
var mysql = require('./mysql');
var sql_queries = require('./sql_queries');

//Removes the item from the cart in session
function removeItemFromCartInSession(req){
	
	var cart_dtl_id  = req.param("cart_dtl_id");
	var cartItemsInSess = req.session.cartItems;
	var totalCostOfCart = Number(req.session.totalCostOfCart);
	console.log("In server : cartpage : Total cost before removing the item  : "+ totalCostOfCart);
	for(var i=0;i < cartItemsInSess.length ; i++){
		
		if(cartItemsInSess[i].cart_dtl_id == cart_dtl_id) {
			totalCostOfCart= totalCostOfCart - Number(cartItemsInSess[i].totalCost);
			
			cartItemsInSess.splice(i,1);
			break;
		}
	}
	
	console.log("In server : cartpage : Cart after removing the item : " + JSON.stringify(cartItemsInSess));
	console.log("In server : cartpage : Total cost after removing the item  : "+ totalCostOfCart);
	req.session.cartItems = cartItemsInSess;
	req.session.totalCostOfCart =totalCostOfCart;
	
}



function removeCartEntry(req,res){
	var json_resp;
	console.log("In server : Removing the cart itself from the db");
	var cart_id = req.session_cart_id;
	var user_seq_id = req.session.user_seq_id;
	mysql.removeCartEntry(function(err,results){
		
		if(err){
			throw err;
		}else{
			
			if(results){
				
				json_resp ={
						"statusCode" : 200,
						 "totalCostOfCart" : req.session.totalCostOfCart,
						 "cartItems" :JSON.stringify(req.session.cartItems)
				};
				
			}else{
				json_resp ={
						"statusCode" : 401
						 
				};
			}
			res.send(json_resp);
			res.end();
			
		}
		
		
	},sql_queries.REMOVE_CART_FOR_USER,[cart_id,user_seq_id]);
	
	
}

 function removeItemFromCart(req,res){
	
	console.log("Removing item from cart in database ");
	 var cart_dtl_id  = req.param("cart_dtl_id");
	 var json_resp;
	 mysql.removeItemFromCartDtl(function(err,results){
		 
		 if(err){
			 throw err;
		 }else{
			 if(results){
				 console.log("In server : results after deleting item from the cart_dtl table : "+results.affectedRows);
				 console.log("In server : Removed the item successfully from db");
				 removeItemFromCartInSession(req);
				 if(req.session.cartItems.length == 0){
					 removeCartEntry(req,res);
				 }else{
					 
					 console.log("In server : Cart after removing the item and before sending the response : "+JSON.stringify(req.session.cartItems));
					 json_resp={
							 
							 "statusCode" : 200,
							 "totalCostOfCart" : req.session.totalCostOfCart,
							 "cartItems" :JSON.stringify(req.session.cartItems)
					 };
					 res.send(json_resp);
					 res.end();
				 }
				 
			 }else{
				 console.log("In server : couldn't remove item fron the cart maintained in db!!");
					json_resp = {
							"statusCode" : 401
						};
				 res.send(json_resp);
				 res.end();
			 }
		 }
		 
		 
	 },sql_queries.REMOVE_ITEM_FROM_CART_DTL,[cart_dtl_id]);
	
	
	
}
 
 
 
 exports.removeItemFromCart = removeItemFromCart;
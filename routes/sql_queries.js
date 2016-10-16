var constants  =  require('node-constants');


constants.define(exports, {
	
	ADD_NEW_USER_ACCT : "insert into ebaydb.account_dtls(acct_dtl_id,credit_card_no,exp_date,cvv,amt_dbt,amt_crdt,paypal_emaiIId) values(NULL,null,null,null,0,0,null);",
	
	ADD_NEW_USER_REC :"insert into ebaydb.users (user_id ,first_name,last_name,contact_no,birthdate,email_id,passwd,acct_dtl_id) values(null,?,?,?,?,?,?,?);",
	
	FETCH_USER_DTLS : "select users.user_id as user_id, users.first_name as first_name, users.last_name as last_name, users.contact_no as contact_no, users.birthdate as birthdate, users.email_id as email_id, users.passwd as passwd, users.acct_dtl_id as acct_id, users.last_login as last_login from ebaydb.users users where users.email_id = ?;",
	
	UPDATE_LAST_LOGIN_TIME : "update ebaydb.users set users.last_login = now() where users.user_id = ?;",
    
	FETCH_LISTINGS_OF_ALL_USERS : "select listings.listing_id as listing_id,listings.seller_id as seller_id, listings.list_type as list_type,listings.bid_end_date as bid_end_date,items.item_name as item_name,items.item_desc as item_desc,items.price as price,(items.total_qty-items.sold_qty) as qty,users.first_name as first_name,users.last_name as last_name from ebaydb.listings listings , ebaydb.items items, ebaydb.users users where listings.item_id  = items.item_id and items.seller_id = users.user_id;",
	
	FETCH_MAX_BID_AMTS : "select bidding_dtls.listing_id as listing_id,max(bidding_dtls.bid_amt) as max_bid_amt from  ebaydb.bidding_dtls as bidding_dtls group by bidding_dtls.listing_id;",	
	
	ADD_DATA_TO_CART : "insert into ebaydb.cart(cart_id,buyer_id,cart_status) values(null,?,?);",
	
	ADD_DATA_TO_CART_DTL : "insert into ebaydb.cart_dtl(cart_dtl_id,cart_id,listing_id,qty,total_cost) values(NULL, ?,?,?,?);",
		
	FETCH_CART_FOR_USER : "select cart.cart_id as cart_id, cart.cart_status as cart_status, cart_dtl.cart_dtl_id as cart_dtl_id,cart_dtl.listing_id as listing_id, cart_dtl.qty as qty, items.price as per_unit_cost,cart_dtl.total_cost as total_cost,items.item_name as item_name,items.item_desc as item_desc,concat_ws(' ',users.first_name,users.last_name ) as seller_name,users.user_id as seller_id from ebaydb.cart cart, ebaydb.cart_dtl cart_dtl, ebaydb.listings listings, ebaydb.items items, ebaydb.users users where cart.buyer_id = '?' and cart.cart_status in ('IN_PROGRESS','CHECK_OUT') and cart.cart_id = cart_dtl.cart_id and cart_dtl.listing_id = listings.listing_id and listings.item_id = items.item_id and items.seller_id = users.user_id;",
	
	REMOVE_ITEM_FROM_CART_DTL : "delete from ebaydb.cart_dtl where cart_dtl.cart_dtl_id = ?;",
	
	//----------Queries to be fired when the user confirms the order----------------
	
	//This query may not be required as we are changing the status of the cart instead of removing
	REMOVE_CART_FOR_USER : "delete from ebaydb.cart where cart.cart_id = ? and cart.buyer_id = ?;",
		
	ADD_SHIPPING_DTL : "insert into ebaydb.shipping_dtl(ship_dtl_id,ship_status,ship_cost,ship_addr1,ship_addr2,ship_city,ship_state,ship_country,ship_zipcode,ship_phoneno,ship_type) values(null,?,?,?,?,?,?,?,?,?,?);",
		
	ADD_ORDER_DTL :"insert into ebaydb.order_dtl(order_dtl_id,buyer_id,order_date,shipping_id,order_status,cart_id) values(null,?,now(),?,?,?);",
	
	ADD_TXN_DTL : "insert into ebaydb.txn_dtl(order_dtl_id,listing_id,seller_id,amount,qty) values ?;",
	
	UPDATE_BUYER_ACCT : "update ebaydb.account_dtls acct_dtls set acct_dtls.credit_card_no = ?,acct_dtls.exp_date= ?,acct_dtls.cvv=?,acct_dtls.amt_dbt = (acct_dtls.amt_dbt + ?) where acct_dtls.acct_dtl_id=?;",
		
	CRDT_AMT_IN_SELLER_ACCT : "update ebaydb.account_dtls acct_dtls set acct_dtls.amt_crdt = acct_dtls.amt_crdt + ? where acct_dtls.acct_dtl_id = (select users.acct_dtl_id from ebaydb.users users where users.user_id = ?);",
	
	UPDATE_ITEM_INVT : "update ebaydb.items items set items.sold_qty = items.sold_qty + ? where items.item_id =(select listings.item_id from ebaydb.listings listings where listings.listing_id = ?);",
		
	UPDATE_CART_STATUS : "update ebaydb.cart cart set cart.cart_status = ? where cart.cart_id = ?;",	
		
		//-------------
	UPDATE_ACCT_FOR_PAYPAL_DTLS :"update ebaydb.account_dtls set paypal_emaiIId = ? where acct_dtl_id = ?;",
	
	ADD_ITEM_DTLS :"insert into ebaydb.items (item_id, item_name, item_desc, price, total_qty, sold_qty,seller_id) values(NULL,?,?,?,?,0,?);",
	
	ADD_LISTING_DTLS : "insert into ebaydb.listings(listing_id,list_type,item_id,min_amt,created_date,max_bid_days,bid_end_date,seller_id) values(null,?,?,?,now(),4,(now()+ interval 4 day),?);",
	
	ADD_BID_DTLS :"insert into ebaydb.bidding_dtls(bidding_id,listing_id,bidder_id,bid_amt,bid_date,winning_bid) values(null,?,?,?,now(),?);",

	//-------Fetch details for user such as buy /bid/sell/personal
	FETCH_USER_SELL_DTLS :"select items.item_name as item_name, items.item_desc as item_desc, items.total_qty as total_qty, items.sold_qty as sold_qty,items.price as price, listings.created_date as created_date, listings.list_type as list_type, listings.bid_end_date as bid_end_date from ebaydb.items items, ebaydb.listings listings where items.seller_id = ? and listings.item_id = items.item_id;",
	
	FETCH_USERS_BUY_DTLS :"select items.item_name as item_name, items.item_desc as item_desc ,cart_dtl.qty as qty, cart_dtl.total_cost as total_cost, users.first_name as seller_first_name, users.last_name as seller_last_name from ebaydb.cart cart, ebaydb.cart_dtl cart_dtl,ebaydb.listings listings,ebaydb.items items, ebaydb.users users where cart.buyer_id = ? and cart.cart_status = 'ORDERED' and cart.cart_id = cart_dtl.cart_id and cart_dtl.listing_id = listings.listing_id and listings.item_id = items.item_id and items.seller_id = users.user_id;",
	
	FETCH_USERS_BID_DTLS :"select items.item_name as item_name, items.item_desc as item_desc, listings.min_amt as min_amt, listings.bid_end_date as bid_end_date, bidding_dtls.bid_amt as bid_amt, bidding_dtls.bid_date as bid_date from ebaydb.bidding_dtls bidding_dtls, ebaydb.listings listings, ebaydb.items items, ebaydb.users users where bidding_dtls.bidder_id = ? and bidding_dtls.listing_id = listings.listing_id and listings.item_id = items.item_id and items.seller_id = users.user_id;",
	
	FETCH_USERS_PERSONAL_INFO :"select users.first_name as first_name, users.last_name as last_name, users.birthdate as birthdate, users.contact_no as contact_no, users.email_id as email_id, users.last_login as last_login,acct_dtls.credit_card_no as credit_card_no, acct_dtls.exp_date as exp_date, acct_dtls.cvv as cvv, acct_dtls.paypal_emaiIId as paypal_emailId, acct_dtls.amt_dbt as amt_dbt, acct_dtls.amt_crdt as amt_crdt from ebaydb.users users, ebaydb.account_dtls acct_dtls where users.user_id = ? and users.acct_dtl_id = acct_dtls.acct_dtl_id;"
	
});
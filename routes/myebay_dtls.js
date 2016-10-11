"use strict;"

var ejs = require("ejs");
var mysql = require('./mysql');
var sql_queries = require('./sql_queries');

exports.getBuyInfo = function(req, res) {

	var json_resp;
	mysql.fetchUserBuyDtls(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results) {
				json_resp ={
						"statusCode" : 200,
						"dtls" :JSON.stringify(results)
				};
			} else {
				console.log("In server : couldn't fetch buy details of the user from the database. ");
				json_resp = {
					"statusCode" : 401
				};
			}
			res.send(json_resp);
			res.end();
		}

	}, sql_queries.FETCH_USERS_BUY_DTLS, [req.session.user_seq_id]);

};

exports.getPersonalInfo = function(req, res) {

	var json_resp;
	mysql.fetchUserBuyDtls(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results) {
				json_resp ={
						"statusCode" : 200,
						"dtls" :JSON.stringify(results)
				};
			} else {
				console.log("In server : couldn't fetch personal details of the user from the database. ");
				json_resp = {
					"statusCode" : 401
				};
			}
			res.send(json_resp);
			res.end();
		}

	}, sql_queries.FETCH_USERS_PERSONAL_INFO, [req.session.user_seq_id]);

};

exports.getSellInfo = function(req, res) {

	var json_resp;
	mysql.fetchUserBuyDtls(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results) {
				json_resp ={
						"statusCode" : 200,
						"dtls" :JSON.stringify(results)
				};
			} else {
				console.log("In server : couldn't fetch sell details of the user from the database. ");
				json_resp = {
					"statusCode" : 401
				};
			}
			res.send(json_resp);
			res.end();
		}

	}, sql_queries.FETCH_USER_SELL_DTLS, [req.session.user_seq_id]);

};

exports.getBidInfo = function(req, res) {

	var json_resp;
	mysql.fetchUserBuyDtls(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results) {
				json_resp ={
						"statusCode" : 200,
						"dtls" :JSON.stringify(results)
				};
			} else {
				console.log("In server : couldn't fetch bid details of the user from the database. ");
				json_resp = {
					"statusCode" : 401
				};
			}
			res.send(json_resp);
			res.end();
		}

	}, sql_queries.FETCH_USERS_BID_DTLS, [req.session.user_seq_id]);

};
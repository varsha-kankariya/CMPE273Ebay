var assert = require('assert');
var chai = require('chai');
var expect = require('chai').expect;
var request = require('request');
chaiHttp = require('chai-http');
chai.use(chaiHttp);


describe('Shopping',function(){
		
	var signin = "http://localhost:3000";
	it("sign in",function(done){
		
		
		chai.request(signin)
		.post('/login')
		.send({"email_id" : "xyz@gmail.com","passwd" : "bbbbbbbbb@1"})
		.end(function(err,res){
			
			console.log(res.body);
			assert.notEqual(res.text.indexOf("ebay"),-1	);
			done();
		});
	});


});
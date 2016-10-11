"use strict";

angular.module('ebay').controller('homeCntrl', [ '$rootScope', '$scope', '$http', '$state','$stateParams', function($rootScope, $scope, $http, $state,$stateParams) {

	$scope.ordered_qty = 1;
	$scope.invalidData = false;
	$scope.isBid = false;
	$scope.isBuy = false;
	$scope.list_type;
	$scope.per_unit_price;
	$scope.min_bid_amt;
	$scope.total_qty;
	$scope.msg = $stateParams.msg;
	
	$scope.addItemToCart = function(listing) {
		
		console.log("Id of the seller for the item : "+ listing.seller_id);
		//Here the quantity means the ordered quantity by the user
		var req_data = {

			"user_id" : $rootScope.user_dtls.user_id,
			"listing_id" : listing.listing_id,
			"qty" : $scope.ordered_qty,
			"per_unit_cost" : listing.price,
			"item_name" : listing.item_name,
			"item_desc" : listing.item_desc,
			"seller_name" : listing.first_name + ' ' + listing.last_name,
			"seller_id" : listing.seller_id
		};
		$http({
			method : "POST",
			url : '/addToCart',
			data : req_data
		}).success(function(data) {
			// checking the response
			// data for statusCode
			if (data.statusCode == 401) {
				console.log("In Angular : There was some issue while processing the request");
			} else {
				// Making a get call to
				// the
				// '/redirectToHomepage'
				// API
				// window.location.assign("/homepage");
				//This is the total cost of all the items in the cart 	
				$rootScope.totalCostOfCart = data.totalCostOfCart;
				$rootScope.cartItems = JSON.parse(data.cartItems);
				console.log("Total Cost of the cart : " + $rootScope.totalCostOfCart);
				console.log("In ang-home.js : Checking the cart items : " + $rootScope.cartItems[0].item_name);

			}
		}).error(function(error) {
			console.log("In Angular : There was some issue at the server : " + error);
		});

	};

	$scope.enableListingMode = function(listing_type) {
		$scope.list_type = listing_type;
		if (listing_type == 'BUY') {

			$scope.isBid = false;
			$scope.isBuy = true;

		} else if (listing_type == 'BID') {

			$scope.isBid = true;
			$scope.isBuy = false;
			$scope.total_qty = 0;
		}
	};

	$scope.listItem = function() {

		var itemPrice;
		var dispMsg ="";
		if ($scope.list_type == 'BUY') {
			itemPrice = $scope.per_unit_price;

		} else if ($scope.list_type == 'BID') {
			itemPrice = $scope.min_bid_amt;
			$scope.total_qty =1;
		}
		console.log("In ang : listItem : price of the item : " + itemPrice);
		var req_data = {
			"item_name" : $scope.item_name,
			"item_desc" : $scope.item_desc,
			"list_type" : $scope.list_type,
			"price" : itemPrice,
			"total_qty" : $scope.total_qty,
			"paypal_emaiIId" : $scope.paypal_emaiIId

		};

		$http({
			method : "POST",
			url : '/listItem',
			data : req_data
		}).success(function(data) {

			if (data.statusCode == 200) {

				dispMsg = "Congrats You have listed the item successfully!!!";
			} else if (data.statusCode == 401) {
				
				dispMsg = "There was some issue.Please try listing the item again!!!";
			}
			$state.go('msg_disp',{"msg" : dispMsg});
		}).error(function(error) {
			console.log("Error while listing the item : " + error);
			dispMsg = "There was some issue.Please try listing the item again!!!";
			$state.go('msg_disp',{"msg" : dispMsg});
		});

	}
	
	
	$scope.checkIfBidValid=function(listing){
		
		console.log("checkIfBidValid : Checking if bid is valid !!");
		var bid_end_date = new Date(listing.bid_end_date);
		var currDate = new Date();
		
		if(bid_end_date>=currDate){
			console.log("Valid Bid!!");
			listing.isBidValid =  true;
		}else{
			console.log("Invalid Bid!!");
			listing.isBidValid =  false;
			alert("The bid has expired!!");
		}
		
	};
	
	$scope.saveBidAmt=function(listing,bid_amt){
		console.log("Saving bidding details");
		var dispMsg= '';
		var req_data ={
				
				"listing_id" : listing.listing_id,
				"bid_amt" : bid_amt
				
		};
		$http({
			method : "POST",
			url : '/saveBidDtls',
			data : req_data
		}).success(function(data) {

			if (data.statusCode == 200) {
				
				console.log("Your bid was added successfully!!Results will be conveyed through emails!!");
				dispMsg = "Your bid was added successfully!!Results will be conveyed through emails!!";
			} else if (data.statusCode == 401) {
				
				console.log("There was some issue at the server.Please try placing the bid again!!!");
				dispMsg ="There was some issue at the server.Please try placing the bid again!!!";
			}
			$state.go('msg_disp',{"msg" : dispMsg});
		}).error(function(error) {
			console.log("Error while listing the item : " + error);
			dispMsg = "There was some issue at the server.Please try placing the bid again!!!";
			$state.go('msg_disp',{"msg" : dispMsg});
		});
	};
	
	
	$scope.ifValidBid = function(listing){
		var bid_end_date = new Date(listing.bid_end_date);
		var currDate = new Date();
		if(listing.list_type == 'BID'){
   		if(bid_end_date>=currDate){
   			console.log("Valid Bid!!");
   			listing.isBidValid =  true;
   			return true;
   		}else{
   			console.log("Invalid Bid!!");
   			listing.isBidValid =  false;
   			return false;
   		}
		}else{
			return true;
		}
	}

} ]);

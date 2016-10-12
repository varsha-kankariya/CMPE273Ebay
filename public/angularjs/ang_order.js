angular.module('ebay').controller('orderPageCntrl', [ '$rootScope', '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {
	
	$scope.cardNo=1111111111111111;
	$scope.cardSecNo = 111;
	$scope.ship_street_addr1 = "123 Sanrose";
	$scope.ship_street_addr2 = "2";
	$scope.ship_city="San Jose";
	$scope.ship_state = "CA";
	$scope.ship_cntry = "US";
	$scope.ship_zipcode = 11111;
	$scope.ship_phoneno = 1111111111;
	
	$scope.confirmOrder = function(){
		var dispMsg = "";
		var req_data ={
				
				"cardNo" :$scope.cardNo,
				"cardExpdate" : $scope.cardExpdate,
				"cardSecNo" :$scope.cardSecNo,
				"ship_street_addr1" :$scope.ship_street_addr1,
				"ship_street_addr2" : $scope.ship_street_addr2,
				"ship_city" : $scope.ship_city,
				"ship_state" : $scope.ship_state,
				"ship_cntry" : $scope.ship_cntry,
				"ship_zipcode" : $scope.ship_zipcode,
				"ship_phoneno" : $scope.ship_phoneno,
				"shipType" : JSON.stringify($rootScope.shipType),
				"totalCostOfOrder" : $rootScope.totalOrderCost
				
		};
		
		
		$http({
			method : "POST",
			url : '/confirmOrder',
			data : req_data
		}).success(function(data) {
			// checking the response
			// data for statusCode
			if (data.statusCode == 401) {
				console.log("In Angular : There was some issue while removing item from the cart");
				dispMsg = "There was some issue while confirming your order.Please try again!!";
				$state.go('msg_disp',{"msg" : dispMsg});
			} else {
				
				
				console.log("Total Cost of the cart : " + $rootScope.totalCostOfCart);
				console.log("In ang-home.js : Checking the cart items : " + JSON.stringify($rootScope.cartItems));

				dispMsg = "Your order has been placed successfully.Check out more exciting offers on our home page!!!!";
				$state.go('msg_disp',{"msg" : dispMsg});
			}
		}).error(function(error) {
			console.log("In Angular : There was some issue at the server : " + error);
		});
		
	};
	
	
	
	
	
}]);
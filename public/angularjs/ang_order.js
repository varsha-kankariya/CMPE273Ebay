angular.module('ebay').controller('orderPageCntrl', [ '$rootScope', '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {
	
	$scope.confirmOrder = function(){
		
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
				"shipType" : JSON.parse($rootScope.shipType),
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
			} else {
				
				$rootScope.totalCostOfCart = data.totalCostOfCart;
				$rootScope.cartItems = JSON.parse(data.cartItems);
				console.log("Total Cost of the cart : " + $rootScope.totalCostOfCart);
				console.log("In ang-home.js : Checking the cart items : " + JSON.stringify($rootScope.cartItems));

				$state.go('ebayPage');
			}
		}).error(function(error) {
			console.log("In Angular : There was some issue at the server : " + error);
		});
		
	};
	
	
	
	
	
}]);
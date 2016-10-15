angular.module('ebay').controller('cartPageCntrl', [ '$rootScope', '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {

	$scope.fastShipVal = {

		type : "FAST_SHIP",
		disp_val : "Fast Shipping(2 business days)",
		ship_cost : 15,
	};

	$scope.stdShipVal = {

		type : "STD_SHIP",
		disp_val : "Standard Shipping (10 to 15  business days)",
		ship_cost : 0
	};

	$scope.freeShipVal = {
		type : "FREE_SHIP",
		disp_val : "Free shipping as order total is above $40",
		ship_cost : 0
	};
	$rootScope.shipType ="";
	

	$scope.removeFromCart = function(cart_dtl_id) {
		console.log("In angular js : removing item from the cart : " + cart_dtl_id);

		var req_data = {
			"cart_dtl_id" : cart_dtl_id
		};
		$http({
			method : "POST",
			url : '/removeFromCart',
			data : req_data
		}).success(function(data) {
			// checking the response
			// data for statusCode
			if (data.statusCode == 401) {
				console.log("In Angular : There was some issue while removing item from the cart");
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
				console.log("In ang-home.js : Checking the cart items : " + JSON.stringify($rootScope.cartItems));

				$state.go('cartPage', {}, {
					reload : true
				});
			}
		}).error(function(error) {
			console.log("In Angular : There was some issue at the server : " + error);
		});

	};

	
	
	$scope.updateShippingDtls = function(shipDtls){
		$rootScope.shipType = shipDtls;
		$rootScope.totalOrderCost = Number($rootScope.totalCostOfCart) + Number(shipDtls.ship_cost);
		
	};

	$scope.checkout = function() {
		
		console.log("In ang_cartpage : Shipping details" + JSON.stringify($rootScope.shipType) );
		if(!$rootScope.shipType){
			$rootScope.shipType = $scope.stdShipVal;
		}
		$state.go('order_dtl');
	};
	
	
	$scope.checkCost = function(){
		
		if (Number($rootScope.totalCostOfCart) > 40){
			return true;
		}
		return false;
		
	};

} ]);

angular.module('ebay').controller('headerCntrl', [ '$rootScope', '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {

	$scope.myMsg = "DOne";

	$scope.displayCartItems = function() {
		$rootScope.totalOrderCost = $rootScope.totalCostOfCart;
		$state.go('cartPage');

	};

	$scope.dispBuyInfo = function() {
		var dispMsg;
		$http({

			method : "POST",
			url : "/getBuyInfo"
		}).success(function(data) {

			if (data.statusCode == 200) {

				$rootScope.buy_dtls = JSON.parse(data.dtls);
				$scope.myMsg = "DOne!!!";
				$state.transitionTo('buy_dtl');
			} else {
				console.log("Could not fetch buy dtls of the user.");
				dispMsg = "Sorry!! Could not fetch buy details.Please try again later!!";
				$state.go('msg_disp', {
					"msg" : dispMsg
				});
			}
		}).error(function(err) {
			console.log("Could not fetch buy dtls of the user Err : " + err);
			dispMsg = "Sorry!! Could not fetch bid details.Please try again later!!";
			$state.go('msg_disp', {
				"msg" : dispMsg
			});

		});

	};

	$scope.dispPersonalInfo = function() {
		var dispMsg;
		$http({

			method : "POST",
			url : "/getPersonalInfo"
		}).success(function(data) {

			if (data.statusCode == 200) {

				$rootScope.user_info = JSON.parse(data.dtls)[0];
				console.log("Personal Dtls : " + data.dtls);
				$state.transitionTo('userdtl');
			} else {
				console.log("Could not fetch personal info of the user.");
				dispMsg = "Sorry!! Could not fetch account details.Please try again later!!";
				$state.go('msg_disp', {
					"msg" : dispMsg
				});
			}
		}).error(function(err) {

			console.log("Could not fetch personal dtls of the user Err : " + err);
			dispMsg = "Sorry!! Could not fetch personal details.Please try again later!!";
			$state.go('msg_disp', {
				"msg" : dispMsg
			});

		});

	};

	$scope.dispSellInfo = function() {
		var dispMsg;
		console.log("In dispSellInfo() : ");
		$http({

			method : "POST",
			url : "/getSellInfo"
		}).success(function(data) {

			if (data.statusCode == 200) {
				console.log("Sell info : " + data.dtls);
				$rootScope.user_sell_dtls = JSON.parse(data.dtls);
				console.log("----------------------------------");
				console.log(data.dtls);
				$state.transitionTo('selldtl');
			} else {
				console.log("Could not fetch sell info of the user.");
				dispMsg = "Sorry!! Could not fetch selling details.Please try again later!!";
				$state.go('msg_disp', {
					"msg" : dispMsg
				});
			}
		}).error(function(err) {

			console.log("Could not fetch selling dtls of the user Err : " + err);
			dispMsg = "Sorry!! Could not fetch selling details.Please try again later!!";
			$state.go('msg_disp', {
				"msg" : dispMsg
			});
		});

	};

	$scope.dispBidInfo = function() {
		var dispMsg = "";
		$http({

			method : "POST",
			url : "/getBidInfo"
		}).success(function(data) {

			if (data.statusCode == 200) {

				$rootScope.bid_dtls = JSON.parse(data.dtls);
				$state.transitionTo('bid_dtl');
			} else {
				console.log("Could not fetch bid dtls of the user.");
				dispMsg = "Sorry!! Could not fetch bid details.Please try again later!!";
				$state.go('msg_disp', {
					"msg" : dispMsg
				});
			}
		}).error(function(err) {
			console.log("Could not fetch bid dtls of the user Err : " + err);
			dispMsg = "Sorry!! Could not fetch bid details.Please try again later!!";
			$state.go('msg_disp', {
				"msg" : dispMsg
			});

		});

	};

	$scope.goToHomePage = function() {

		console.log("In angular: goToHomePage() ");
		$http({
			method : "GET",
			url : '/homepage',
		}).success(function(data) {

			console.log("Listings as strings : " + data.listings);
			$rootScope.listings = JSON.parse(data.listings);
			$rootScope.cartItems = JSON.parse(data.cartItems);
			$rootScope.totalCostOfCart = data.totalCostOfCart;
			$state.transitionTo('ebayHome');
		}).error(function(error) {

			console.log("In angular : goToHomePage() : Redirected to homepage with error");
			console.log("In angular : goToHomePage() Error: " + error);

		});
	};
} ]);

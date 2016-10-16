//defining the login controller
angular.module('ebay').controller('loginCntrl', [ '$rootScope', '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false

	$scope.invalid_login = true;
	$scope.validlogin = true;
	$scope.invalid_register = true;
	$scope.valid_register = true;
	$scope.email_id = "xyz@gmail.com";
	$scope.passwd = "bbbbbbbbb@1";

	$scope.submitLoginDtls = function() {
		$http({
			method : "POST",
			url : '/checklogin',
			data : {
				"email_id" : $scope.email_id,
				"passwd" : $scope.passwd
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.validlogin = true;

			} else {

				$.sessionTimeout({
					logoutUrl : '/logout',
					warnAfter : 5 * 60 * 1000,
					redirAfter : 30 * 60 * 1000,

					onRedir : function() {
						console.log("onRedir :Your session has expired");

					}
				});

				$rootScope.totalCostOfCart = data.totalCostOfCart;
				$rootScope.cartItems = JSON.parse(data.cartItems);

				$rootScope.user_dtls = JSON.parse(data.userDtls);
				console.log("In client : userDtls : Dtls as string :" + $rootScope.user_dtls);
				redirectToHomePage();
				$state.transitionTo('ebayHome');
			}
			//Making a get call to the '/redirectToHomepage' API
			//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.validlogin = true;
			$scope.invalid_login = true;
		});
	};

	var removeInvalidBidListings = function() {

		var listings = $rootScope.listings;

		for (var i = 0; i < listings.length; i++) {
			
			if (listings[i].list_type == 'BID') {
				console.log("Listing Name :" + listings[i].item_name);
				
				var currDate = new Date();
				var bid_date = new Date(listings[i].bid_end_date);
				if (bid_date < currDate) {
					console.log("Removing invalid bid as it has expired");
					console.log("Removed listing Name :" + listings[i].item_name);
					listings.splice(i, 1);
				}
			}

		}
		$rootScope.listings = listings;
		

	};

	var redirectToHomePage = function() {

		console.log("In angular: redirectToHomePage() ");
		$http({
			method : "GET",
			url : '/homepage',
		}).success(function(data) {

			console.log("Listings as strings : " + data.listings);
			$rootScope.listings = JSON.parse(data.listings);
			removeInvalidBidListings();
			$rootScope.cartItems = JSON.parse(data.cartItems);
			$rootScope.totalCostOfCart = data.totalCostOfCart;
		}).error(function(error) {

			console.log("In angular : redirectToHomePage() : Redirected to homepage with error");
			console.log("In angular : redirectToHomePage() Error: " + error);

		});
	};

	$scope.registerNewUser = function() {
		console.log("In angular : Method for registering a new user!!!");
		var userDtls = {

			"first_name" : $scope.first_name,
			"last_name" : $scope.last_name,
			"birthdate" : $scope.birthdate,
			"contact_no" : $scope.contact_no,
			"email_id" : $scope.email_id,
			"passwd" : $scope.passwd
		};

		$http({
			method : "POST",
			url : '/registerUser',
			data : userDtls
		}).success(function(data) {
			//checking the response data for statusCode

			console.log("In angular : Status Code for registerNewUser : " + data.status_code)

			if ((data.status_code == 401) || (data.status_code == 402)) {
				$scope.invalid_register = false;
				$scope.valid_register = true;
			} else {
				console.log("In Angular : Valid login!!")
				$scope.invalid_register = true;
				$scope.valid_register = false;
			}
			//Making a get call to the '/redirectToHomepage' API
			//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.invalid_register = true;
			$scope.valid_register = true;
		});

	};

} ]);

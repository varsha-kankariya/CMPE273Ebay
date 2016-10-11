
var ebay = angular.module('ebay', [ 'ui.router' ]);
ebay.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$stateProvider.state('login', {
		url : '/login',
		views : {
			'header' : {
				templateUrl : 'templates/header.html',
			},
			'content' : {
				templateUrl : 'templates/login.html',
			}
		},
		controller : 'login'
	});

	$stateProvider.state('ebayHome', {
		url : '/ebayPage',
		views : {
			'header' : {
				templateUrl : 'templates/home_header.html',
				controller : 'headerCntrl'
			},
			'content' : {
				templateUrl : 'templates/home_page.html',
				controller : 'homeCntrl'
			}
		}
		
	});

	$stateProvider.state('cartPage', {
		url : '/shoppingCart',
		views : {
			'header' : {
				templateUrl : 'templates/home_header.html',
				controller : 'headerCntrl'
			},
			'content' : {
				templateUrl : 'templates/cart_page.html',
				controller : 'cartPageCntrl'
			}
		}
		
	});
	
	
	$stateProvider.state('order_dtl', {
		url : '/shoppingCart',
		views : {
			'header' : {
				templateUrl : 'templates/home_header.html',
				controller : 'headerCntrl'
			},
			'content' : {
				templateUrl : 'templates/order_dtls.html',
				controller : 'orderPageCntrl'
			}
		}
		
	});
	
	$stateProvider.state('msg_disp', {
		url : '/msgDisp/:msg',
		views : {
			'header' : {
				templateUrl : 'templates/home_header.html',
				controller : 'headerCntrl'
			},
			'content' : {
				templateUrl : 'templates/list_msg_display.html',
				controller : 'homeCntrl',	
				params :['msg']
			}
		}
		
	});
	
	
	$stateProvider.state('buy_dtl', {
		url : '/buydtl',
		views : {
			'header' : {
				templateUrl : 'templates/home_header.html',
				controller : 'headerCntrl'
			},
			'content' : {
				templateUrl : 'templates/user_buy_info.html',
				controller : 'userDtlCntrl'
			
			}
		}
		
	});
	
	
	$stateProvider.state('selldtl', {
		url : '/selldtl',
		views : {
			'header' : {
				templateUrl : 'templates/home_header.html',
				controller : 'headerCntrl'
			},
			'content' : {
				templateUrl : 'templates/user_sell_info.html',
				controller : 'userDtlCntrl'
					
			}
			
		}
	
	});
	
	$stateProvider.state('bid_dtl', {
		url : '/biddtl',
		views : {
			'header' : {
				templateUrl : 'templates/home_header.html',
				controller : 'headerCntrl'
			},
			'content' : {
				templateUrl : 'templates/user_bid_info.html',
				controller : 'userDtlCntrl'
			}
		}
		
	});
	
	$stateProvider.state('userdtl', {
		url : '/userdtl',
		views : {
			'header' : {
				templateUrl : 'templates/home_header.html',
				controller : 'headerCntrl'
			},
			'content' : {
				templateUrl : 'templates/user_info.html',
				controller : 'userDtlCntrl'
			}
		}
		
	});
	
	
	$urlRouterProvider.otherwise('/login');
});

ebay.run([ '$state', function($state) {
	$state.transitionTo('login');
} ]);
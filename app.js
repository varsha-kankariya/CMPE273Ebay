
/**
 * Module dependencies.
 */

var express = require('express')
	, winston =require('winston')
  , routes = require('./routes')
  , http = require('http')
  , login = require('./routes/login')
  , path = require('path')
  , home = require('./routes/home')
  , cartpage = require('./routes/cartpage')
  , order_proc = require('./routes/order_proc')
  , myebay_dtls = require('./routes/myebay_dtls')
  , mysql = require('./routes/mysql')
  , chai = require('chai')
  , chaiHttp = require('chai-http')
  //Importing the 'client-sessions' module
  , session = require('client-sessions');

winston.emitErrs = true;

winston.add(winston.transports.File,{
            level: 'info',
            filename: 'temp.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        });
winston.remove(winston.transports.Console);
global.winston = winston;


var app = express();

// all environments
//configure the sessions with our application
app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//GET METHODS
app.get('/', routes.index);

app.get('/logout', login.logout);
//POST METHODS
app.post('/checklogin', login.checkLogin);
app.post('/registerUser', login.registerUser);
app.get('/homepage',login.redirectToHomepage);

app.post('/addToCart', home.addItemToCart);
app.post('/removeFromCart' , cartpage.removeItemFromCart);
app.post('/listItem',home.listItem);
app.post('/confirmOrder',order_proc.confirmOrder);
app.post('/saveBidDtls',home.saveBidDtls);
app.post('/getBuyInfo',myebay_dtls.getBuyInfo);
app.post('/getPersonalInfo',myebay_dtls.getPersonalInfo);
app.post('/getSellInfo',myebay_dtls.getSellInfo);
app.post('/getBidInfo',myebay_dtls.getBidInfo);

var server = http.createServer(app);
server.on('close', function() {
	  console.log(' Stopping ...');
	});
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  mysql.createConnectionPool();
});



module.exports = app;

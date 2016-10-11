

exports.getHelloWorld = function(req, res){
	console.log("In Hello World Application");
  res.render('helloworld', { title: 'HelloWorld' });
};
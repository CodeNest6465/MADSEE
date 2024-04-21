var express = require('express'); 
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/images', express.static(__dirname + '/public/images'));
app.get('/',function(req,resp)
{
	resp.sendFile(__dirname+"/"+"public/index.html")
});
app.post('/login',function(req,resp)
{
	if(req.body.username=='admin'&& req.body.password=='admin123')
	{
		console.log('Logged in successfully');
		resp.sendFile(__dirname+"/"+"public/success.html")
	}
	else
	{
		console.log('invalid credentials');
		resp.sendFile(__dirname+"/"+"public/error.html")
	}
});

app.get('/git',function (req, resp){
	resp.sendFile(__dirname+"/"+"public/gitppro.html")
	});

	app.get('/stock_data',function (req, resp){
	resp.sendFile(__dirname+"/"+"public/stock.html")
	});

	app.get('/stock_data_local',function (req, resp){
		resp.sendFile(__dirname+"/"+"public/stocklocal.html")
		});

app.listen(5515,function(){
	console.log('Listening at port 5515');
});

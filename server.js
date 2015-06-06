var app = require('koa')(),
    http= require('http'),
    serve= require('koa-static');


app.use(serve(__dirname+'/public'));

// This must come after last app.use()
var server = http.Server(app.callback());

var transfer = require('./server/transfer');
transfer.setup(server);


server.listen(4000);
console.info('Now running on localhost:4000');
const express = require('express');
const app = express();
// const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
var fs = require("fs");

const port = process.env.PORT || 8000;
 
app.use(express.static("./static"));
app.get("/mess", function(req, res) {
	// console.log("query");
	console.log(req.query);
	io.emit("mess", req.query);

	fs.appendFile('log.txt', req.query ,'utf8', function (err) {
	    console.log(err);
	});
});


// クライアントからio接続イベント
io.on('connection', function(client){
	console.log("connecting!");
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});





// サーバデバッグ用
process.stdin.resume();
process.stdin.setEncoding('utf8');
// 標準入力がくると発生するイベント
process.stdin.on('data', function (chunk) {
    chunk.trim().split('\n').forEach(function(line) {
        // 1行ずつ表示
        // console.log('>' + line);
		if(line == 'a') {
			console.log(clients);
		}

    });
});
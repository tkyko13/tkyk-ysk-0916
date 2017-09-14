const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('db.sqlite3');
const port = process.env.PORT || 8000;
const logFilePath = 'log.txt';

 
var balloonTotalNum = 0;

app.use(express.static("./static"));

// getでメッセージをもらう
app.get("/mess", function(req, res) {
	console.log("get query");
	console.log(req.query);
	resMsg(req.query.m, true);
	res.send("mess ok");
});

// getでバルーンをもらう
app.get("/balloon", function(req, res) {
	console.log("get query");
	console.log(req.query);
	resBal(req.query.t, true);
	res.send("balloon ok");
});

// クライアントからio接続イベント
io.on('connection', function(client){
	console.log("connecting!");

	// ログから過去のデータをクライアントに送信
	var logFile = fs.readFileSync(logFilePath, 'utf-8');
	// console.log("logFile : ");
	// console.log(logFile);
	var msgs = logFile.split("\n");
	for(var i=0; i<msgs.length; i++) {
		// io.emit("mess", {m:msgs[i]});
		resMsg(msgs[i], false, client);
	}

	// メッセージの受け取り
	client.on('mess', function(data) {
		console.log("socket mess");
		console.log(data);

		resMsg(data.m, true);
	});

	// 風船の受け取り
	client.on('balloon', function(data) {
		console.log("socket balloon");
		console.log(data);

		resBal(data.t, true);
	});
});

function resMsg(msg, logFlg, client) {
	// mというkeyにいれて送る
	if(client) {
		client.emit("mess", {m:msg});
	}
	else {
		io.emit("mess", {m:msg});
	}

	// ログをファイルに残す
	if(logFlg) {
		var logText = "";
		// logText += "hoge" + ",";
		logText += msg + "\n";
		fs.appendFile(logFilePath, logText, 'utf8', function (err) {
		    if(err) {
		    	console.log(err);
			}
		});
	}


}

function resBal(type, logFlg) {
	// tというkeyにいれて送る
	io.emit("balloon", {t:type});

	// ログをファイルに残す
	// if(logFlg) {
	// 	var logText = "";
	// 	// logText += "hoge" + ",";
	// 	logText += msg + "\n";
	// 	fs.appendFile(logFilePath, logText, 'utf8', function (err) {
	// 	    if(err) {
	// 	    	console.log(err);
	// 		}
	// 	});
	// }
}


http.listen(port, function(){
  console.log('listening on *:' + port);
});



// サーバデバッグ用
app.get("/dev", function(req, res) {
	// console.log("query");
	console.log("dev req = " + req.query);
	

	// ログをファイルを空にする
	if(req.query.removeLog == 1) {
		fs.writeFile(logFilePath, "" , function (err) {
		    console.log(err);
		});
	}
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
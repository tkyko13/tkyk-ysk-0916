var stage;
// var backBmp;
var base;
var msgContainer;
var balloonContainer;
var uiContainer;
var socket;
var fukis = [];

var ratio;
const bgWidth = 960;
const bgHeight = 1280;

var penBtn;
var balloonBtn;

var randomPointer;

var mode = "";

function init(_mode) {
	mode = _mode;
    stage = new createjs.Stage("myCanvas");

    // 画像のロード
 //    var img = new Image();
	// img.onload = onImgLoad;
	// img.src = "../img/welcomeBoard.png";
	// img.src = "../img/dummy.png";

	onImgLoad();
}

function onImgLoad(e) {

	if (createjs.Touch.isSupported()) {
	 	createjs.Touch.enable(stage);
	}
	
	// 
	base = new createjs.Container();
	stage.addChild(base);

	// 画像をステージに追加
	// backBmp = new createjs.Bitmap(e.target);
	// base.addChild(backBmp);

	// 風船コンテナ
	balloonContainer = new createjs.Container();
	base.addChild(balloonContainer);

	// メッセージコンテナ作成，追加
	msgContainer = new createjs.Container();
	base.addChild(msgContainer);

	// uiコンテナ
	uiContainer = new createjs.Container();
	if(mode != "view") {
		base.addChild(uiContainer);
	}
	

	// socket準備
	socket = io();

	// ボタン２つ
	penBtn = new PenBtn(socket);
	uiContainer.addChild(penBtn);
	balloonBtn = new BalloonBtn(socket);
	uiContainer.addChild(balloonBtn);

	// メッセージ受信
	socket.on("mess", function(data){
		console.log("mess data - ");
		console.log(data);

		popFukidashi(data.m);
	});

	// 風船受信
	socket.on('balloon', function(data) {
        var b = new Balloon(data.t, balloonContainer, ratio);
        balloonContainer.addChild(b);
    });

	// リサイズイベントと実行
	window.addEventListener("resize", onResize);
	onResize();

	createjs.Ticker.addEventListener("tick", onEnterframe);
    function onEnterframe(e) {
    	// if(Math.random() < 0.1) {
    	// 	popFukidashi(randomStr(3, 50));
    	// }

        stage.update();
    }

}

function popFukidashi(msg) {
	if(msg && msg.length > 0) {
		var pos = getMsgPos();
		var x = pos.x;//Math.random() * stage.canvas.width * (1/ratio);
        var y = pos.y;//Math.random() * stage.canvas.height * (1/ratio);
        var type = "left";
        if(x > stage.canvas.width/2) {
            type = "right";
        }
        var fuki = new MsgFukidashi(msg, type);
        fuki.x = x;
        fuki.y = y;
        msgContainer.addChild(fuki);
        fuki.popup();
        // 末尾に追加
        fukis.push(fuki);

        // 古いけらば古いほど吹き出しにアルファをかける
        var overNum = fukis.length - 20;
        if(overNum > 0) {

	        for(var i=0; i<overNum; i++) {
	        	if(i < fukis.length-1) {
	        		fukis[i].alpha = i / 20;
	        	}
	        	else {
	        		break;
	        	}
	        }
    	}
        if(fukis.length > 50) {
        	// 先頭の一番古い吹き出しを消す
            msgContainer.removeChild(fukis[0]);
            fukis.shift();
        }

		// var t = createMsg(data.m, Math.random()*window.innerWidth, Math.random()*window.innerHeight);
		// msgContainer.addChild(t);
	}
}



// var face = new createjs.Shape();
function getMsgPos(fuki) {
	var ratioW = stage.canvas.width / bgWidth;

	const margUp = 50;

	var avoid1 = {right:350*ratioW, y1:350*ratio, h1:330*ratio, h2:120*ratio};
	avoid1.y2 = stage.canvas.height - avoid1.h2;
	var avoid2 = {left:avoid1.right, right:730*ratioW, y1:280*ratio, h1:370*ratio, h2:120*ratio};
	avoid2.y2 = stage.canvas.height - avoid2.h2;

	// face.graphics.clear();
	// face.graphics.beginStroke("red");
	// face.graphics.drawRect(0, avoid1.y1, avoid1.right, avoid1.h1);
	// face.graphics.drawRect(0, avoid1.y2, avoid1.right, avoid1.h2);
	// face.graphics.drawRect(avoid2.left, avoid2.y1, avoid2.right-avoid2.left, avoid2.h1);
	// face.graphics.drawRect(avoid2.left, avoid2.y2, avoid2.right-avoid2.left, avoid2.h2);
	// stage.addChild(face);

	var rx = Math.random()*stage.canvas.width;
	var ry = 0;

	if(rx < avoid1.right) {
		ry = margUp+Math.random()*(stage.canvas.height-margUp - avoid1.h1-avoid1.h2);
		if(avoid1.y1 < ry) {
			ry += avoid1.h1;
		}
	}
	else if(rx < avoid2.right) {
		ry = margUp+Math.random()*(stage.canvas.height-margUp - avoid2.h1-avoid2.h2);
		if(avoid2.y1 < ry) {
			ry += avoid2.h1;
		}
	}
	else {
		ry = margUp+Math.random()*(stage.canvas.height-margUp);
	}
	

	return {x:rx * (1/ratio), y:ry * (1/ratio)};
}


// リサイズ処理
function onResize(e) {
	// 画面幅・高さを取得
	var w = window.innerWidth;
	var h = window.innerHeight;
	// Canvas要素の大きさを画面幅・高さに合わせる
	stage.canvas.width = w;
	stage.canvas.height = h;

	// 背景画像の高さに合わせる
	// 最悪，画像の横が見えちゃう
	ratio = h / bgHeight;

	if(base) {
		base.scaleX = ratio;
		base.scaleY = ratio;
	}


	// if(backBmp) {
	// 	backBmp.regX = backBmp.image.width/2;
	// 	// backBmp.regY = backBmp.image.height/2;
	// 	backBmp.x = w * (1/ratio)/2;
	// 	backBmp.y = 0;//h/2;
	// 	// backBmp.scaleX = ratio;
	// 	// backBmp.scaleY = ratio;
	// }

	if(penBtn) {
		penBtn.x = 70;
		penBtn.y = h * (1/ratio) - 70;
	}
	if(balloonBtn) {
		balloonBtn.x = 190;
		balloonBtn.y = h * (1/ratio) - 70;
	}
	// 画面更新する
	stage.update();
}

function msgCancel() {
	var msgDev = document.getElementById("msgDev");
    msgDev.style.visibility = "hidden";
    // var msgTa = document.getElementById("msgTextarea");
    // msgTa.value = "";
}
function msgSubmit() {
	var msgTa = document.getElementById("msgTextarea");
	var msg = msgTa.value;
	if(msg) {
		socket.emit('mess', {m:msg});
	}
	msgTa.value = "";
	var msgDev = document.getElementById("msgDev");
    msgDev.style.visibility = "hidden";

}



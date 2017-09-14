var stage;
var backBmp;
var base;
var msgContainer;
var balloonContainer;
var uiContainer;
var socket;
var fukis = [];

var ratio;

var penBtn;
var balloonBtn;

function init() {
    stage = new createjs.Stage("myCanvas");

    // 画像のロード
    var img = new Image();
	img.onload = onImgLoad;
	img.src = "../img/welcomeBoard.png";
	// img.src = "../img/dummy.png";
}

function onImgLoad(e) {
	
	// 
	base = new createjs.Container();
	stage.addChild(base);

	// 画像をステージに追加
	backBmp = new createjs.Bitmap(e.target);
	base.addChild(backBmp);

	// 風船コンテナ
	balloonContainer = new createjs.Container();
	base.addChild(balloonContainer);

	// メッセージコンテナ作成，追加
	msgContainer = new createjs.Container();
	base.addChild(msgContainer);

	// uiコンテナ
	uiContainer = new createjs.Container();
	base.addChild(uiContainer);

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

		if(data.m && data.m.length > 0) {
			var x = Math.random() * stage.canvas.width * (1/ratio);
	        var y = Math.random() * stage.canvas.height * (1/ratio);
	        var type = "left";
	        if(x > stage.canvas.width/2) {
	            type = "right";
	        }
	        var fuki = new MsgFukidashi(data.m, type);
	        fukis.push(fuki);
	        fuki.x = x;
	        fuki.y = y;
	        msgContainer.addChild(fuki);
	        fuki.popup();

	        if(fukis.length > 50) {
	            msgContainer.removeChild(fukis[0]);
	            fukis.shift();
	        }

			// var t = createMsg(data.m, Math.random()*window.innerWidth, Math.random()*window.innerHeight);
			// msgContainer.addChild(t);

		}
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
        stage.update();
    }

}

function getMsgPos(fuki) {
	
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
	ratio = h / backBmp.image.height;

	if(base) {
		base.scaleX = ratio;
		base.scaleY = ratio;
	}

	if(backBmp) {
		backBmp.regX = backBmp.image.width/2;
		// backBmp.regY = backBmp.image.height/2;
		backBmp.x = w * (1/ratio)/2;
		backBmp.y = 0;//h/2;
		// backBmp.scaleX = ratio;
		// backBmp.scaleY = ratio;
		
	}

	if(penBtn) {
		penBtn.x = 50;
		penBtn.y = h * (1/ratio) - 50;
	}
	if(balloonBtn) {
		balloonBtn.x = 150;
		balloonBtn.y = h * (1/ratio) - 50;
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



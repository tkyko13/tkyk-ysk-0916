var stage;
var backBmp;
var msgContainer;
var balloonContainer;
var uiContainer;
var socket;
var fukis = [];

var penBtn;
var balloonBtn;

function init() {
    stage = new createjs.Stage("myCanvas");

    // リサイズイベント
	window.addEventListener("resize", onResize);

    // 画像のロード
    var img = new Image();
	img.onload = onImgLoad;
	img.src = "../img/welcomeBoard.png";
}

// リサイズ処理
function onResize(e) {
	// 画面幅・高さを取得
	var w = window.innerWidth;
	var h = window.innerHeight;
	// Canvas要素の大きさを画面幅・高さに合わせる
	stage.canvas.width = w;
	stage.canvas.height = h;
	if(backBmp) {
		backBmp.regX = backBmp.image.width/2;
		backBmp.regY = backBmp.image.height/2;
		backBmp.x = window.innerWidth/2;
		backBmp.y = window.innerHeight/2;
		var ratio = window.innerHeight / backBmp.image.height;
		backBmp.scaleX = ratio;
		backBmp.scaleY = ratio;
	}
	if(penBtn) {
		penBtn.x = 50;
		penBtn.y = h - 50;
	}
	if(balloonBtn) {
		balloonBtn.x = 150;
		balloonBtn.y = h - 50;
	}
	// 画面更新する
	stage.update();
}

function onImgLoad(e) {
	// 画像をステージに追加
	backBmp = new createjs.Bitmap(e.target);
	stage.addChild(backBmp);

	// メッセージコンテナ作成，追加
	msgContainer = new createjs.Container();
	stage.addChild(msgContainer);

	// 風船コンテナ
	balloonContainer = new createjs.Container();
	stage.addChild(balloonContainer);

	// uiコンテナ
	uiContainer = new createjs.Container();
	stage.addChild(uiContainer);

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
			var x = Math.random() * stage.canvas.width;
	        var y = Math.random() * stage.canvas.height;
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
	            stage.removeChild(fukis[0]);
	            fukis.shift();
	        }

			// var t = createMsg(data.m, Math.random()*window.innerWidth, Math.random()*window.innerHeight);
			// msgContainer.addChild(t);

		}
	});

	// 風船受信
	socket.on('balloon', function(data) {
        var b = new Balloon(data.t, stage);
        stage.addChild(b);
    });

	// 初期化最後にリサイズ
	onResize();

	createjs.Ticker.addEventListener("tick", onEnterframe);
    function onEnterframe(e) {
        stage.update();
    }

}




var stage;
var backBmp;
var msgContainer;
var socket;

function init() {
    stage = new createjs.Stage("myCanvas");

    // リサイズイベント
	window.addEventListener("resize", onResize);
	onResize();

    // 画像のロード
    var img = new Image();
	img.onload = onImgLoad;
	img.src = "../img/welcomeImg.png";
}

// リサイズ処理
function onResize(e) {
	// 画面幅・高さを取得
	var w = window.innerWidth;
	var h = window.innerHeight;
	// Canvas要素の大きさを画面幅・高さに合わせる
	stage.canvas.width = w;
	stage.canvas.height = h;
	// 画面更新する
	stage.update();
}

function onImgLoad(e) {
	// 画像をステージに追加
	backBmp = new createjs.Bitmap(e.target);
	backBmp.regX = backBmp.image.width/2;
	backBmp.regY = backBmp.image.height/2;
	backBmp.x = window.innerWidth/2;
	backBmp.y = window.innerHeight/2;
	var ratio = window.innerWidth / backBmp.image.width;
	backBmp.scaleX = ratio;
	backBmp.scaleY = ratio;
	stage.addChild(backBmp);

	// メッセージコンテナ作成，追加
	msgContainer = new createjs.Container();
	stage.addChild(msgContainer);

	// socket準備
	socket = io();
	// メッセージ受信
	socket.on("mess", function(data){
		console.log("mess - "+data);

		var t = createMsg(data.m, Math.random()*window.innerWidth, Math.random()*window.innerHeight);
		msgContainer.addChild(t);

		stage.update();
	});

	stage.update();
}

function createMsg(msg, x, y) {
	var margW = 5;

	var t = new createjs.Text(msg, "24px sans-serif");
	t.textAlign = "center";
	t.textBaseline = "middle";
	// t.font = "36px";
	// t.maxWidth = 50;
	var tBox = t.getBounds();

	var g = new createjs.Graphics();
	g.setStrokeStyle(1);
	g.beginStroke("#000000");
	g.beginFill("#FFFFFF");
	g.drawRoundRect(-tBox.width/2-margW, -tBox.height/2, tBox.width+margW, tBox.height, 5);
	var s = new createjs.Shape();
	s.graphics = g;

	var base = new createjs.Container();
	base.x = x;
	base.y = y;
	base.addChild(s);
	base.addChild(t);

	return base;
}



function MsgContainer() {
	var fukiArr = [];
	this.Container_constructor();
	this.addEventListener("tick", onEnterframe);
    function onEnterframe(e) {

    }

}
createjs.extend(MsgContainer, createjs.Container);
createjs.promote(MsgContainer, "Container");

function MsgFukidashi() {
	this.Container_constructor();

	this.width = 0;
	this.height = 0;
	this.alpha = 0;
	createjs.Tween.get(this)
	.wait(500)
	.to({alpha:1, width:300, height:300}, 1000)
	.call(handleComplete);
    function handleComplete() {
        //Tween complete
    }

	this.addEventListener("tick", onEnterframe);
    function onEnterframe(e) {
    	
    }
}
createjs.extend(MsgFukidashi, createjs.Container);
createjs.promote(MsgFukidashi, "Container");



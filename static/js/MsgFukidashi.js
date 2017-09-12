class MsgFukidashi extends createjs.Container{
    constructor() {
        super();

        // 吹き出しグラフィックスと文字のマージン
        this.hMarg = 20;
        this.vMarg = 20;
        // サマリー表示の文字数
        // const summaryLen = 20;
        this.minWidth = 60;
        this.minHeight = 25;
        this.maxWidth = 0;
        this.maxHeight = 0;
        // 全表示の改行までの文字数
        const allWarapLen = 30;
        // 全表示の時間,ミリ秒
        const allViewTime = 3000;

        var msg = randomStr(20, 50);
        this.type = "left";// or firght

        this._msgText = new createjs.Text("");
        var mt = this._msgText;
        this._fukidashiShape = new createjs.Shape();
        var fs = this._fukidashiShape;

        // テキストフィールド設定
        mt.text = breakLines(msg, allWarapLen);
        // mt.x = -this.minWidth/2 - this.hMarg/2;
        // mt.y = -this.minHeight - this.vMarg/2;

        if(this.type == "left") {
           mt.textAlign = "left";
           mt.x = this.hMarg/2;
           mt.y = -this.minHeight + this.vMarg/2;
        }
        var tBox = mt.getBounds();
        // 全表示時の大きさ
        this.maxWidth = tBox.width + this.hMarg;
        this.maxHeight = tBox.height + this.vMarg;

        // 吹き出しグラフィックス設定
        fs.graphics.beginFill("#FFFFFF");
        fs.graphics.beginStroke("#000000");
        // shape.graphics.drawRoundRect(-tBox.width/2, -tBox.height/2, tBox.width, tBox.height, 5);
        // fs.graphics.drawRoundRect(tBox.width - hMarg/2, -tBox.height/2 - vMarg/2, tBox.width + hMarg, tBox.height + vMarg, 7);
        // fs.x = -tBox.width;
        // fs.y = tBox.height/2;
        if(this.type == "left") {
            fs.graphics.drawRoundRect(0, -this.minHeight, this.minWidth, this.minHeight, 5);
            fs.x = 0;
            fs.y = 0;
        }



        // 追加
        this.addChild(fs);
        this.addChild(mt);

        // 初期アニメーション
        this.popup();
    }

    popup() {

        var t = this;
        var gComm = this._fukidashiShape.graphics.command;
        var mt = this._msgText;
        var toX, toY, backX, backY;
        if(this.type == "left") {
            toX = 0;//-this.maxWidth/2;
            toY = -this.maxHeight;
            backX = 0;
            backY = this.minHeight;
        }
        createjs.Tween.get(mt)
        .to({x:toX + t.hMarg/2, y:toY + t.vMarg/2}, 1000, createjs.Ease.bounceOut);

        createjs.Tween.get(gComm)
        .to({x:toX, y:toY, w:this.maxWidth, h:this.maxHeight}, 1000, createjs.Ease.bounceOut)
        .call(onComp);

        function onComp() {
            createjs.Tween.get(gComm)
            .wait(3000)
            .to({x:backX, y:-backY, w:t.minWidth, h:t.minHeight}, 1000, createjs.Ease.bounceOut)
            
            .call(handleComplete);
            function handleComplete() {
                
            }
        }
    }

}
// export default MsgFukidashi;



function randomStr(min=0, max=1) {
    // 生成する文字列の長さ
    var l = min + Math.random() * (max-min);

    // 生成する文字列に含める文字セット
    var c = "abcdefghijklmnopqrstuvwxyz0123456789あいうえおかきくきこ";

    var cl = c.length;
    var r = "";
    for(var i=0; i<l; i++){
      r += c[Math.floor(Math.random()*cl)];
    }
    return r;
}

function breakLines(_str, chars) {
    var result_str = "";
    var myPattern = /\r|\n|\r\n/g;
    var str_array = _str.split(myPattern);
    var count = str_array.length;
    for (i = 0; i < count; i++) {
        str_array[i] =breakSingleLine( str_array[i], chars);
    }
    return str_array.join("\r");
}
function breakSingleLine(_str, chars) {
    var lines_str = "";
    var begin = 0;
    var end = _str.length;
    var doIt = true;
    while (doIt) {
        var last = begin + chars - 1;
        if (last <= end) {
            var nextChar = _str.charAt(last + 1);
        if (nextChar == "。" || nextChar == "、") {
            last--;
        }
        lines_str += _str.substring(begin, last + 1) + "\r";
        begin = last + 1;
        } else {
            lines_str += _str.substring(begin, end + 1);
            doIt = false;
        }
    }
    return lines_str;
}
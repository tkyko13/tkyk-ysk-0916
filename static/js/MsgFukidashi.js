class MsgFukidashi extends createjs.Container{
    constructor(_msg, type) {
        super();

        // 吹き出しグラフィックスと文字のマージン
        this.hMarg = 30;
        this.vMarg = 30;
        // サマリー表示の文字数
        // const summaryLen = 20;
        this.minWidth = 60;
        this.minHeight = 25;
        this.maxWidth = 0;
        this.maxHeight = 0;
        // 全表示の改行までの文字数
        const allWarapLen = 10;
        // 全表示の時間,ミリ秒
        const allViewTime = 3000;

        var msg = _msg;// randomStr(20, 50);// msg
        this.type = type;//"left" or right

        // cssに記述ないといけない
        this._msgText = new createjs.Text("", "20px shin");
        // this._msgText = new createjs.Text("", "20px");
        
        var mt = this._msgText;
        this._fukidashiShape = new createjs.Shape();
        var fs = this._fukidashiShape;

        // テキストフィールド設定
        mt.text = breakLines(msg, allWarapLen);
        var tBox = mt.getBounds();
        // 全表示時の大きさ
        this.maxWidth = tBox.width + this.hMarg;
        this.maxHeight = tBox.height + this.vMarg;

        // mt.x = -this.minWidth/2 - this.hMarg/2;
        // mt.y = -this.minHeight - this.vMarg/2;
        mt.alpha = 0;

        if(this.type == "left") {
            mt.textAlign = "left";
            mt.x = this.hMarg/2;
            // mt.y = -this.minHeight + this.vMarg/2;
            mt.y = -this.maxHeight + this.vMarg/2 + 10;
        }
        else if(this.type == "right") {
            mt.textAlign = "left";
            // mt.x = -this.minWidth - this.hMarg/2;
            mt.x = -this.maxWidth + this.hMarg/2;
            // mt.y = -this.minHeight + this.vMarg/2;
            mt.y = -this.maxHeight + this.vMarg/2 + 10;
        }
        

        // 吹き出しグラフィックス設定
        fs.alpha = 0.7;
        fs.graphics.beginFill("#FFFFFF");
        fs.graphics.beginStroke("#000000");
        // shape.graphics.drawRoundRect(-tBox.width/2, -tBox.height/2, tBox.width, tBox.height, 5);
        // fs.graphics.drawRoundRect(tBox.width - hMarg/2, -tBox.height/2 - vMarg/2, tBox.width + hMarg, tBox.height + vMarg, 7);
        // fs.x = -tBox.width;
        // fs.y = tBox.height/2;
        if(this.type == "left") {
            fs.graphics.drawRoundRect(0, -this.minHeight, this.minWidth, this.minHeight, 18);
            fs.x = 0;
            fs.y = 0;
        }
        else if(this.type == "right") {
            fs.graphics.drawRoundRect(-this.minWidth, -this.minHeight, this.minWidth, this.minHeight, 18);
            fs.x = 0;
            fs.y = 0;
        }



        // 追加
        this.addChild(fs);
        this.addChild(mt);

        // 初期アニメーション
        // this.popup();
    }

    popup() {

        var t = this;
        var gComm = this._fukidashiShape.graphics.command;
        var mt = this._msgText;
        var toX, toY, backX, backY;
        if(this.type == "left") {
            toX = 0;
            toY = -this.maxHeight;
            backX = 0;
            backY = -this.minHeight;
        }
        else if(this.type == "right") {
            toX = -this.maxWidth;
            toY = -this.maxHeight;
            backX = -this.minWidth;
            backY = -this.minHeight;
        }
        
        createjs.Tween.get(mt)
        .wait(650)
        .to({x:toX + t.hMarg/2, y:toY + t.vMarg/2, alpha:1}, 200);

        createjs.Tween.get(gComm)
        .to({x:toX, y:toY, w:this.maxWidth, h:this.maxHeight}, 800, createjs.Ease.bounceOut)
        .call(onComp);

        function onComp() {
            
        //     createjs.Tween.get(mt)
        //     .wait(3000)
        // .   to({x:backX + t.hMarg/2, y:backY + t.vMarg/2}, 1000, createjs.Ease.bounceOut);


        //     createjs.Tween.get(gComm)
        //     .wait(3000)
        //     .to({x:backX, y:backY, w:t.minWidth, h:t.minHeight}, 1000, createjs.Ease.bounceOut)
            
        //     .call(handleComplete);
        //     function handleComplete() {
                
        //     }
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
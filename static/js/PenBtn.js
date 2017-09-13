class PenBtn extends createjs.Container {
    constructor(socket) {
        super();

        // var callback = null;

        var _this = this;

        var bitmap = new createjs.Bitmap("img/btn_pen.png");
        bitmap.image.onload = imgLoaded;
        function imgLoaded() {
            bitmap.x = -bitmap.image.width/2;
            bitmap.y = -bitmap.image.height/2;
            _this.addChild(bitmap);
        }

        this.addEventListener("click", onClick);
        function onClick(e) {
            var input = window.prompt("入力してください", "初期入力文字");

            // if(callback !=null) {
            //     callback(input);
            // }
            if(input) {
               socket.emit('mess', {m:input});
            }
        }
    }
}
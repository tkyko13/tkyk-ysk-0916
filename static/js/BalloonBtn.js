class BalloonBtn extends createjs.Container {
    constructor(socket) {
        super();

        var _this = this;

        this.mouseChildren = false;
        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").drawRect(-50, -50, 100, 100);
        this.hitArea = hit;
        
        var bitmap = new createjs.Bitmap("img/btn_balloon.png");
        bitmap.image.onload = imgLoaded;
        
        function imgLoaded() {
            bitmap.x = -bitmap.image.width/2;
            bitmap.y = -bitmap.image.height/2;
            _this.addChild(bitmap);
        }

        this.addEventListener("click", onClick);
        function onClick(e) {
            var type = Math.floor(1+Math.random()*5);
            socket.emit('balloon', {t:type});
        }
    }
}
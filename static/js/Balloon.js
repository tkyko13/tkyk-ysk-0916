class Balloon extends createjs.Container {
    constructor(type, stage, ratio) {
        super();

        var _this = this;

        var imgNames = ["balloon_01.png", "balloon_02.png", "balloon_03.png", "balloon_04.png", "balloon_05.png"];
        
        var ind = type-1;//Math.floor(Math.random()*path.length-1);
        var path = "img/" + imgNames[ind];

        var bitmap = new createjs.Bitmap(path);
        bitmap.image.onload = imgLoaded;
        function imgLoaded() {
            _this.addChild(bitmap);

            bitmap.x = bitmap.image.width / 2;
            var scale = 0.8 + Math.random()*0.2;
            bitmap.scaleX = scale;
            bitmap.scaleY = scale;

            _this.x = Math.random()*window.innerWidth*(1/ratio);
            _this.y = 100+Math.random()*window.innerHeight*(1/ratio)-100;

            var toY = _this.y - (50+Math.random()*200);
            // var toY = 0;

            createjs.Tween.get(_this)
            .to({y:toY, alpha:0}, 1500, createjs.Ease.quadIn)
            .call(onComp);
            function onComp() {
                // 消す処理をする
                stage.removeChild(_this);
            }
        }

        
    }
}
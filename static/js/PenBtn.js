class PenBtn extends createjs.Container {
    constructor(socket) {
        super();

        // var callback = null;

        var _this = this;

        this.mouseChildren = false;
        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").drawRect(-50, -50, 100, 100);
        this.hitArea = hit;

        var bitmap = new createjs.Bitmap("img/btn_pen.png");
        bitmap.image.onload = imgLoaded;
        function imgLoaded() {
            bitmap.x = -bitmap.image.width/2;
            bitmap.y = -bitmap.image.height/2;
            _this.addChild(bitmap);
        }

        this.addEventListener("click", onClick);
        function onClick(e) {
            // var input = window.prompt("Happy Wedding!!", "お祝いのメッセージをお願いします");

            // if(callback !=null) {
            //     callback(input);
            // }
            // if(input) {
            //    socket.emit('mess', {m:input});
            // }

            // var msgDev = document.getElementById("msgDev");
            // msgDev.style.visibility = "visible";
            // var msgTa = document.getElementById("msgTextarea");
            // msgTa.focus();

            $("#dialog").dialog({
                modal: true,
                buttons: {
                    "OK": function() {
                        $( this ).dialog("close");
                        var input = $("#dialogText").val();
                        if(input != "") {
                            socket.emit('mess', {m:input});
                        }
                        
                        $("#dialogText").val("");
                    },
                    "キャンセル": function() {
                        $( this ).dialog("close");
                        $("#dialogText").val("");
                    }
                }

            });
        }
    }
}
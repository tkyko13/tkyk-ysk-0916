class RandomPointer {
	// ratio決め
	// var ratioW = stage.canvas.width / bgWidth;
	// var ratioH = stage.canvas.height / bgHeight;
	// // 吹き出し用ランダム座標取得クラス
	// randomPointer = new RandomPointer();
	// randomPointer.pushArea(0, 50, 350*ratioW, 350*radioH);
	// randomPointer.pushArea(350*ratioW, 50, 380*ratioW, 280*radioH);
	// randomPointer.pushArea(730*ratioW, 50, 220*ratioW, 280*radioH);
	// randomPointer.pushArea(730*ratioW, 330*radioH, 220*ratioW, 370*radioH);
	// randomPointer.pushArea(0, 330*radioH, 220*ratioW, 370*radioH);
	
	constructor() {
		this.areas = [];
	}

	pushArea(x, y, w, h) {
		this.areas.push({x:x, y:y, w:w, h:h, count:0});
	}

	getPoint() {
		var lowerCount = this.areas[0].count;
		for(var i=0; i<this.areas.length; i++) {
			if(this.areas[i].count < lowerCount) {
				lowerCount = this.areas[i].count;
			}
		}
		var lowerAreas = [];
		for(var i=0; i<this.areas.length; i++) {
			if(this.areas[i].count == lowerCount) {
				lowerAreas.push(this.areas[i]);
			}
		}
		var r = Math.floor(Math.random()*lowerAreas.length);
		var a = lowerAreas[r];
		a.count ++;

		var x = a.x + Math.random()*a.w;
		var y = a.y + Math.random()*a.h;
		return {x:x, y:y, index:r};
	}

	// getAreaIndex(x, y) {
	// 	for(var i=0; i<this.areas.length; i++) {
	// 		if(this.areas[i].x < x && x < this.areas[i].x+this.areas[i].w
	// 			&& this.areas[i].y < y && y < this.areas[i].y+this.areas[i].h) {
	// 			return this.areas[i];
	// 		}
	// 	}
	// 	return null;
	// }

	removePoint(index) {
		this.areas[index].count --;
	}

	// testDraw(base) {

	// }

}
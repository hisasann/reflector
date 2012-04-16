(function(){
/*
 * Reflector JavaScript Library version 1.0
 * http://lab.hisasann.com/reflector/
 *
 * Copyright (c) 2009 hisasann http://hisasann.com/
 * Dual licensed under the MIT and GPL licenses.
 */

var Reflector = function(){}

var div, canvas, height, width, elem, divHeight;

Reflector.prototype = {
	_attr : "reflection",
	_opacity : 0.5,
	_height : 0.5,

	isIE : (document.all && !window.opera),

	reflect : function(){
		this.images = this.get();
		for (var i=0,len=this.images.length; i<len; ++i) {
			elem = this.images[i];
			this.createCanvas();
		}
	},

	simpleReflect : function(obj) {
		elem = obj;
		this.createCanvas();
	},

	createCanvas : function(){
		div = document.createElement("div"),
		canvas = document.createElement("canvas"),
		refHeight = Math.floor(elem.height * this._height);
		refWidth = elem.width;
		divHeight = Math.floor(elem.height * (1 + this._height));

		if(canvas.getContext)
			this.forModern();
		else
			this.forIE();
	},

	forModern : function(){
		canvas.style.height = refHeight + "px";
		canvas.style.width = refWidth + "px";
		canvas.height = refHeight;
		canvas.width = refWidth;

		// クラスを外枠のdivに設定
		div.className = elem.className;
		elem.className = "";

		// インラインスタイルを外枠のdivに設定
		div.style.cssText = elem.style.cssText;
		div.style.height = divHeight + "px";
		div.style.width = refWidth + "px";

		elem.style.cssText = 'vertical-align: bottom';

		elem.parentNode.replaceChild(div, elem);
		div.appendChild(elem);
		div.appendChild(canvas);

		var ctx = canvas.getContext("2d")
		with(ctx){
			save();
			translate(0, elem.height-1);
			scale(1,-1);
			drawImage(elem, 0, 0, elem.width, elem.height);
			restore();
			var gradient = createLinearGradient(0, 0, 0, refHeight);
			gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
			gradient.addColorStop(0, "rgba(0, 0, 0, " + this._opacity + ")");
			globalCompositeOperation = "destination-out";
			fillStyle = gradient;
			fillRect(0, 0, refWidth, refHeight);
			fill();
		}
	},

	forIE : function(){
		var reflection = document.createElement("img");
		// インラインスタイルを合わせる
		reflection.style.cssText = elem.style.cssText;
		elem.style.cssText = 'vertical-align: bottom';
		
		// クラスを合わせる
		reflection.className = elem.className;
		
		with(reflection){
			src = elem.src;
			style.width = refWidth + "px";
			style.height = elem.height + "px";
			style.display = "block";
			style.marginBottom = "-"+(elem.height - refHeight)+"px";
			style.filter = 'flipv progid:DXImageTransform.Microsoft.Alpha(opacity='+(this._opacity*100)+', style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy='+(this._height*100)+')';
		}

		// IEの場合はdivタグで囲わない。
		// もしimgタグの親にaタグがいた場合、divタグにwidth・heightを指定しているとリンクをクリックできなくなるため
		elem.parentNode.appendChild(reflection);
	},

	get : function(){
		var children = document.getElementsByTagName("*") || document.all;
		var elements = new Array();

		for (var i=0,len=children.length; i<len; ++i) {
			var child = children[i];
			var attr = child.getAttribute("reflection");

			if(attr && attr == "true") {
				elements.push(child);
			}
		}

		return elements;
	}
}

function getActiveStyle(div_obj, property, value) {
    //IE (IE6.0,IE7.0,Opera)
    if( div_obj.currentStyle ) {
        return div_obj.currentStyle[property];
    //Mozilla (Firefox,Netscape,WinSafari)
    } else if(document.defaultView.getComputedStyle) {
		//null replace Emptystring reson is Netscape
        return document.defaultView.getComputedStyle(div_obj, (value==null?"":value)).getPropertyValue(property);
    }
    return "";
}

window.Reflector = new Reflector();

})();

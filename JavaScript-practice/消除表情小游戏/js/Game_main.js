var data = [
	'img/demonI.png',
	'img/demonII.png',
	'img/demonIII.png',
	'img/demonIV.png',
	'img/demonV.png'
];
(function(){
	/*======================================================================*/
	//获取相关的元素以及要用到的变量;
	var btn = document.querySelector('.btn');
	var win = document.querySelector('.win');
	var lose = document.querySelector('.lose');
	var winNum = document.querySelector('.winNum');
	var loseNum = document.querySelector('.loseNum');
	var content = document.querySelector('.content');
	var num = 0,i = 0,j = 0,speed = 3000,w = 600;

	/*======================================================================*/
	//btn的点击事件以及会触发的一些事件,一切从btn被点后发生;
	btn.onclick = function(){
		linearMove(win,{left:-100},6);
		linearMove(lose,{left:-100},6);
		linearMove(btn,{bottom:-70,opacity:0},6,function(){
			elImg();
		});
	};
	//(函数事件1):创建img元素并随机往页面添加
	function elImg(){
		data.sort(function(item,i){
			return Math.random() - .5;
		});
		var img = new Image();
		img.src = data[num%data.length];
		img.style.position = 'absolute';
		img.style.left = Math.ceil(Math.random()*w) + 'px';
		num++;
		content.appendChild(img);
		img.onOff = true;
		img.onclick = function(){
			if(img.onOff){
				img.onOff = false;
				clearInterval(img.timer);
				img.src = 'img/demonVI.png';
				toShake(img,"left",20,function(){
					//加速
					j++;
					switch(j){
						case 5: speed = 2600;break;
						case 8: speed = 2200;break;
						case 10: speed = 1800;break;
						case 15: speed = 1200;break;
					}
					content.removeChild(img);
					winNum.innerHTML = j + "分";
					elImg();
				})
			}
		};
		mTween(img,{top:346},speed,"linear",function(){
			content.removeChild(img);
			toShake(content,"top",20,function(){
				//游戏失败
				i++;
				if(i > 2){
					toShake(content,"left",30,function(){
						/*alert('游戏失败!');*/
						i = 0,j = 0;
						btn.innerHTML = '游戏失败!!点击重来';
						loseNum.innerHTML = i + "分";
						winNum.innerHTML = j + "分";
						speed = 3000;
						linearMove(win,{left:14},6);
						linearMove(lose,{left:14},6);
						linearMove(btn,{bottom:150,opacity:100},6);
					});
					return;
				}
				loseNum.innerHTML = i + "分";
				elImg();
			});
		});
	}
})();

/*======================================================================*/
var Tween = {
	linear: function (t, b, c, d){
		return c*t/d + b;
	}
};
/* 当css的参数个数小于3，获取否则 设置 */
function css(el,attr,val) {
	if(arguments.length < 3) {
		var val  = 0;
		if(el.currentStyle) {
			val = el.currentStyle[attr];
		} else {
			val = getComputedStyle(el)[attr];
		}
		if(attr == "opacity") {
			val*=100;
		}
		return parseFloat(val);
	}
	if(attr == "opacity") {
		el.style.opacity = val/100;
		el.style.filter = "alpha(opacity = "+val+")";
	} else {
		el.style[attr] = val + "px";
	}
}
/*动画Tween效果*/
function mTween(el,target,time,type,callBack) {
	clearInterval(el.timer);
	var t = 0;
	var b = {}; 
	var c = {}; 	
	var d = time/20; 
	for(var s in target) {
		b[s] = css(el,s);  
		c[s] = target[s] - b[s];
	}
	el.timer = setInterval(function(){
		t++;
		if(t>d) {
			clearInterval(el.timer);
			callBack&&callBack();	
		} else {
			for(var s in target) {
				var val = Tween[type](t,b[s],c[s],d);
				css(el,s,val);
			}
		}
	},20);
}
function linearMove(el,target,speed,callBack){
	clearInterval(el.timer);
	var d = 0;
	var t = 0;
	var speeds = {};
	for(var s in target){
		var now = css(el,s);
		var dis = target[s] - now;
		var sD = Math.ceil(Math.abs(dis/speed));
		d = Math.max(d,sD);
	}
	for(var s in target){
		var now = css(el,s);
		var dis = target[s] - now;
		speeds[s] = dis/d;
	}
	el.timer = setInterval(function(){
		t++;
		if(t >= d){
			clearInterval(el.timer);
			callBack&&callBack();
		}
		for(var s in target){
			var now = css(el,s);
			now += speeds[s];
			css(el,s,now);
		}
	},20);
}
//抖函数 元素 X/Y 回调函数
function toShake(el,attr,second,callBack){//second 持续多少秒
	clearInterval(el.shake);
	// if(el.shake){//定时器关闭后方可进行再一次执行下边,本次不需要
	// 	return;
	// }
	var arr = [];
	var b = css(el,attr);
	var nub = 0;
	for(var i = second-1; i >= 0; i--){
		i%2?arr.push(i):arr.push(-i);
	}
	el.shake = setInterval(function(){
		if(nub >= second){
			clearInterval(el.shake);
			callBack&&callBack();
		} else {
			var val = b + arr[nub];
			css(el,attr,val);	
			nub++;
		}
	},50)
}

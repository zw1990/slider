/*
	target:容器
	showControls：生成圆点或其他控制
	prevNext：左右控制
	eventType: 触发事件类型
	current: 设置默认当前屏
	stay: 停留时间
	auto: 设置自动播放,取值:true 或false
*/
var slider = function(o){
	this.setting = typeof o === 'object' ? o : {};
	this.target = this.setting.target || "slider";
	this.showControls = this.setting.showControls || false;
	this.prevNext = this.setting.prevNext || false;
	this.eventType = this.setting.eventType || "mouseover";
	this.currentTimer = null;
	this.timer = null;
	this.speed = 0;
	this.stay = this.setting.stay || "1000";
	this.current = this.setting.current || 0;
	this.auto = this.setting.auto || false;
	this.slideAfterfn = this.setting.slideAfterfn || null;
	this.init();
	this.handleEvent();
}
slider.prototype = {
	init: function(){
		this.obj = document.getElementById(this.target);
		this.oUl = this.obj.getElementsByTagName("ul")[0];
		this.ulLis = this.oUl.getElementsByTagName("li");
		this.width = this.ulLis[0].offsetWidth;
		this.number = this.ulLis.length;
		this.oUl.style.width = this.width * this.number + "px";

		if(this.showControls){
			var oDiv = document.createElement("div");
			var aLis = [];
			for(var i = 0; i < this.number; i++){
				aLis.push("<li>"+ (i+1) +"</li>");
			}
			oDiv.innerHTML = "<ol class='controls'>"+ aLis.join('') +"</ol>";
			this.obj.appendChild(oDiv.firstChild);
			this.aLis = this.obj.getElementsByTagName("ol")[0].getElementsByTagName("li");
			this.aLis[0].className = "active";
			oDiv = null;
		}

		if(this.prevNext){
			this.oPrev = document.createElement("a");
			this.oNext = document.createElement("a");
			this.oPrev.className = "prev";
			this.oPrev.innerHTML ="&laquo;";
			this.oNext.className = "next";
			this.oNext.innerHTML ="&raquo;";
			this.obj.appendChild(this.oPrev);
			this.obj.appendChild(this.oNext);
		}
	},
	handleEvent: function(){
		var that = this;
		if(this.auto){
			this.currentTime = setInterval(function(){
				console.log(1);
				that.autoPlay();
			},that.stay)
		}
		// 鼠标经过当前屏上暂停切换
		this.addEvent(this.obj,"mouseover",function(){
			clearInterval(that.currentTime);
		})
		this.addEvent(this.obj,"mouseout",function(){
			that.currentTime = setInterval(function(){
				that.autoPlay();
			},that.stay)
		})

		if(this.showControls){
			for(var i= 0; i< this.aLis.length; i++){
				var el = this.aLis[i];
				(function(i){
					that.addEvent(el,that.eventType,function(){
						clearInterval(that.currentTime);
						that.play(i,that.slideAfterfn(that));
						that.current = i;
					})
				})(i)
			}
		}

		if(this.prevNext){
			this.addEvent(this.oPrev,"click",function(){
				alert(1)
				clearInterval(that.currentTime);
				that.current = that.current - 1;
				if(that.current < 0){
					that.current = that.number - 1;
				}
				that.play(that.current,that.slideAfterfn(that));
			})
			this.addEvent(this.oNext,"click",function(){
				clearInterval(that.currentTime);
				that.current = that.current + 1;
				if(that.current > that.number - 1){
					that.current = 0;
				}
				that.play(that.current,that.slideAfterfn(that));
			})
		}
	},
	addEvent: function(el, type, fn){
		if(window.addEventListener){
			el.addEventListener(type,fn);
		}else if(window.attachEvent){
			el.attachEvent("on" + type,fn);
		}
	},
	autoPlay: function(){
		this.current++;
		if(this.current >= this.number){
			this.current = 0;
		}
		this.play(this.current,this.slideAfterfn(this));
	},
	play: function(index,fn){
		var that = this;
		var mLeft = -index * this.width;
		that.toMove(mLeft);

		if(this.showControls){
			for(var i=0; i < this.number; i++){
				i == index ? this.aLis[i].className = "active" : this.aLis[i].className = "";
			}
		}
		fn&&fn(this);

	},
	toMove: function(s){
		this.speed = s;
		this.oUl.style.left = this.speed + "px";
		if(Math.abs(this.oUl.offsetLeft) - this.oUl.offsetWidth === 0){
			this.oUl.style.left = 0;
			this.speed = 0;
		}
	}
}
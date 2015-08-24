/*
 *author:li li
 *data:2015-7-26
 *desc:using namespace OJoy,including util and effect.

*/
'use strict';
/*;(function(global){
	var OJoy=global.OJoy||{};
	OJoy.util=OJoy.util||{};
	OJoy.effect=OJoy.effect||{};

	
	global.onload=function(){
		OJoy.util.show();
	}
	OJoy.util={
		show:function(){
			alert(document.body);
		}
	};
	OJoy.effect={
		
	};
})(window);*/
window.onload=function(){
// 导航
;(function(){
	var oNavBox=document.getElementById('js_nav');
	//保证导航在浏览器兼容下达到fixed的效果
	var json=getPos(oNavBox);
	if(window.navigator.userAgent.indexOf('MSIE 6.0')!=-1){
		window.onscroll=window.resize=function(){
			var scrollT=document.documentElement.scrollTop||document.body.scrollTop;
			oNavBox.style.top=json.top+scrollT+'px';
		}
	}
})();
;(function(){
	
	var oBox=document.getElementById('js_navbox');
	var aBall=oBox.getElementsByTagName('b');
	function clearBallClass(){
		for(var i=0;i<aBall.length;i++){
			aBall[i].className='';
		}
		aBall[0].className='on';
	}
	/*点击头像扩散开*/
	
	var oC=oBox.children[0];
	for (var i = 0; i < aBall.length; i++) {
		aBall[i].a=270;
		aBall[i].style.display="block";
	}

	var r=oBox.offsetWidth/2;
	function startRota(obj,iTarget){
		var start=obj.a;
		var dis=iTarget-start;
		var count=Math.floor(1000/30);
		var n=0;
		clearInterval(obj.timer);
		obj.timer=setInterval(function(){
			n++;
			var b=1-n/count;
			var cur=start+dis*(1-Math.pow(b,3));//得到向目标角度过程中30毫秒走的角度值
			//角度要转换为弧度
			obj.style.left=r+r*Math.sin(cur*Math.PI/180)+'px';
			obj.style.top=r-r*Math.cos(cur*Math.PI/180)+'px';
			//记住当前角度值直至最后的角度值
			obj.a=cur;
			if (n==count) {
				clearInterval(obj.timer);
			};
		},30);
	}
	var bOk=true;
	//那么再点击一次，分布均匀的圆又收回去，那么当前各自的角度要记住
	oC.onclick=function(){
		if (bOk) {
			for (var i = 0; i < aBall.length; i++) {
				startRota(aBall[i],68+32*i);
				// aBall[i].style.display="block";
			}
		}else{
			for (var i = 0; i < aBall.length; i++) {
				(function(index){
					startRota(aBall[index],270);
				})(i);
				clearBallClass();
			}
			
		}
		bOk=!bOk;
	};
	/*点击圈上选项的操作*/
	for (var i = 0; i < aBall.length; i++) {
		(function(index){
			aBall[index].onclick=function(){
				for(var i=0;i<aBall.length;i++){
					aBall[i].className='';
				}
				this.className='on';
				var oTarget=document.getElementById('#b'+index);
				var t=getPos(oTarget).top;
				toScroll(t);
			}
		})(i);
	}

	//控制页面滚动定位
	var timer=null;
	var bS=false;
	window.onscroll=function(){
		if (bS) {
			clearInterval(timer);
		};
		bS=true;//定时器滚动的话仍是false

		//加载技能页面
		drawChart();
	}
	function toScroll(iTarget){
		var start=document.documentElement.scrollTop||document.body.scrollTop;
		var dis=iTarget-start;
		clearInterval(timer);
		var count=Math.floor(1000/30);
		var n=0;
		timer=setInterval(function(){
			bS=false;
			n++;
			var a=1-n/count;
			document.documentElement.scrollTop=document.body.scrollTop=start+dis*(1-Math.pow(a,3));
			if(n==count){
				clearInterval(timer);
			}
		},30);
	}
})();

//点击中间头像
;(function(){
	var oLogo=document.getElementById('js_logo');
	var oHeadCenBox=document.getElementById('js_headcen');
	var oIntroBox=document.getElementById('js_introBox');
	
	//初始化介绍框和中间框的位置
	oHeadCenBox.style.marginLeft=0;
	oHeadCenBox.style.left=(document.documentElement.clientWidth-oHeadCenBox.offsetWidth)/2+'px';
	//oHeadCenBox.style.marginLeft=0;
	oIntroBox.style.top=-oIntroBox.offsetHeight+'px'; 

	var bOk=false;
	oLogo.onclick=function(){
		if(bOk){
			var head_left=Math.round((document.documentElement.clientWidth-oHeadCenBox.offsetWidth)/2);
			var intro_top=-oIntroBox.offsetHeight-100;
			toBounce(oHeadCenBox,'left',head_left);
			toBounce(oIntroBox,'top',intro_top);
			bOk=false;
		}else{
			var head_left=Math.round(document.documentElement.clientWidth*0.15);
			var intro_top=100;
			toBounce(oHeadCenBox,'left',head_left);
			toBounce(oIntroBox,'top',intro_top);
			bOk=true;
		}
			
	}
	//介绍框关闭按钮
	var oClose=oIntroBox.getElementsByTagName('b')[0];
	oClose.onclick=function(){
		var head_left=Math.round((document.documentElement.clientWidth-oHeadCenBox.offsetWidth)/2);
		var intro_top=-oIntroBox.offsetHeight-100;
		toBounce(oHeadCenBox,'left',head_left);
		toBounce(oIntroBox,'top',intro_top);
		bOk=false;
	}
	
	function toBounce(obj,sName,iTarget){
		if(sName=='left'){
			var cur=obj.offsetLeft;
		}else{
			var cur=obj.offsetTop;
		}
		var iSpeed=0;
		clearInterval(obj.timer);
		obj.timer=setInterval(function(){
			switch(sName){
				case 'left':
					iSpeed+=(iTarget-obj.offsetLeft)/5;
				break;
				case 'top':
					iSpeed+=(iTarget-obj.offsetTop)/5;
				break;
			}
			
			iSpeed*=0.7;
			
			cur+=iSpeed;
			obj.style[sName]=cur+'px';
			if(Math.abs(iSpeed)<1)iSpeed=0;
			if(Math.round(iSpeed)==0 && Math.round(cur)==iTarget){
				clearInterval(obj.timer);	
			}
		},30);
	}

})();

//生成技能
;(function(){
	var arr=[{'id':'js_js','color':'#18e','scale':88},{'id':'js_jq','color':'#1f5','scale':100},
			 {'id':'js_ajax','color':'#e81','scale':50},{'id':'js_jsonp','color':'#f18','scale':30},
			 {'id':'js_model','color':'#81f','scale':60},{'id':'js_mvc','color':'#f9f','scale':100},
			 {'id':'js_oo','color':'#ff2','scale':100},{'id':'js_yui','color':'#0fe','scale':20},
			 {'id':'js_php','color':'#f03','scale':100},{'id':'js_node','color':'#333','scale':10}
			 ];
	var bDraw=false;
	window.drawChart=function(){
		var scrollT=document.documentElement.scrollTop||document.body.scrollTop;
		var startT=document.getElementById('#b0').offsetHeight;
		if(!bDraw && scrollT>startT-100){
			for(var i=0;i<arr.length;i++){
				new DrawChart(arr[i]);
			}

			bDraw=true;
		}
	}
	function DrawChart(json){
		var oC=document.getElementById(json.id);
		oC.height=oC.width=oC.parentNode.offsetWidth;
		/*oC.style.background='#333';
		oC.style.borderRadius='50%';*/
		this.oCtx=oC.getContext('2d');
		this.r=oC.width/2;
		this.b=10;
		this.oTxtScale=oC.parentNode.getElementsByTagName('p')[0];
		this.toDraw(json.color,json.scale);
	}
	DrawChart.prototype.toDraw=function(color,scale){
		var start=0;
		var dis=scale-start;
		var n=0;
		var count=Math.floor(2000/30);
		var timer=null;
		clearInterval(timer);
		this.oCtx.strokeStyle=color;
		
		var _this=this;
		timer=setInterval(function(){
    		n++;
			var cur=start+dis*n/count;
			var curArc=cur/100*2*Math.PI;
			_this.oCtx.beginPath();
			_this.oCtx.lineWidth=_this.b;
			_this.oCtx.arc(_this.r,_this.r,_this.r-_this.b,0,curArc);
			_this.oCtx.stroke();
			_this.oTxtScale.innerHTML=parseInt(cur)+'%';
			if(n==count){
				clearInterval(timer);
			}
		},30);	
	}

})();


}

function getStyle(obj,sName){
	return (obj.currentStyle||getComputedStyle(obj,false))[sName];
}
function getPos(obj){
	var l=0;
	var t=0;
	while(obj){
		l+=obj.offsetLeft;
		t+=obj.offsetTop;
		obj=obj.offsetParent;
	}
	return {left:l,top:t};
}
function move(obj,json,options){
	options=options||{};
	options.easing=options.easing||'ease-out';
	options.duration=options.duration||700;
	var start={};
	var dis={};
	for(var name in json){
		start[name]=parseFloat(getStyle(obj,name));
		if(isNaN(start[name])){
			switch(name){
				case 'width':
					start[name]=obj.offsetWidth;
				break;
				case 'height':
					start[name]=obj.offsetHeight;
				break;
				case 'left':
					start[name]=obj.offsetLeft;
				break;
				case 'top':
					start[name]=obj.offsetTop;
				break;
				case 'opacity':
					start[name]=1;
				break;
				case 'borderWidth':
					start[name]=0;
				break;
			}
		}
		dis[name]=json[name]-start[name];
	}
	var n=0;
	var count=Math.floor(options.duration/30);
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		for(var name in json){
			switch(options.easing){
				case 'linear':
					var cur=start[name]+dis[name]*n/count;
				break;
				case 'ease-in':
					var a=n/count;
					var cur=start[name]+dis[name]*Math.pow(a,3);
				break;
				case 'ease-out':
					var a=1-n/count;
					var cur=start[name]+dis[name]*(1-Math.pow(a,3));
				break;
			}
			if(name=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity:'+100*cur+')';
			}else{
				obj.style[name]=cur+'px';
			}
		}
		if(n==count){
			clearInterval(obj.timer);
			options.complete||option.complete();
		}
	},30);
}

/*
 *Author:li li
 *Data:2015-8-14
 *Desc:using namespace OJoy,making the entire site interface, including: util, all effects
 *
*/
'use strict';

/*
*	Entire  website
*/
var OJoy={  
	/*
	* Public function interface ,include 
	*  getStyle ,move ,ajax and so on
	*/
	util:{},  
	/*
	* All fx collection
	*/
	effect:{} 	
};
OJoy.util={	
	/*
	*	@desc: px to rem
	*	@param:  {Numeber}
	*	@return: {Number}
	*/
	toRem:function(n){
		return n/20;
	},
	/*
	*	@desc: get the absolute position in the whole body
	*	@param:  {Object}
	*	@return: {Json{left:xx,top:xx}}
	*/
	getPos:function(obj){
		var left=0;
		var top=0;
		while(obj){
			left+=obj.offsetLeft;
			top+=obj.offsetTop;
			obj=obj.offsetParent;
		}
		return {left:left,top:top};
	}
};
OJoy.effect={
	/*
	*	@desc: adapt to the device  by rem
	*/
	adaptDev:function(){
		document.documentElement.style.fontSize=document.documentElement.clientWidth/16+'px';
		var oPage=document.querySelector('.js_page');
		oPage.style.height=document.documentElement.clientHeight+'px';
		var oBodyBox=document.querySelector('#js_bodyBox');
		oBodyBox.style.width=document.documentElement.clientWidth+'px';
		oBodyBox.style.height=document.documentElement.clientHeight+'px';
	},
	/*---1
	*	@desc: scroll to the computed target location
	*/
	locatePage:function(){
		var aLi=document.querySelectorAll('#js_navbox .navbar ul li');
		var aPages=['js_home','js_about','js_skill','js_work','js_contact'];
		var oNav=document.querySelector('#js_navbox');
		
		for(var i=0;i<aLi.length;i++){
			
			(function(index){
				aLi[index].addEventListener('touchstart',function(){
					for(var i=0;i<aLi.length;i++){
						aLi[i].className='';
					}
					aLi[index].className='cur';
					var oTarget=document.getElementById(aPages[index]);
					var t=oTarget.offsetTop;
					// specially deal with the contact top
					if(index==aLi.length-1){
						t=t-(document.documentElement.clientHeight-oTarget.offsetHeight-oNav.offsetHeight);
					}
					var oBody=document.getElementById('js_body');
					oBody.style.WebkitTransform='translateY('+OJoy.effect.pageTranslateY+'px)';
					OJoy.effect.toMove(-t);
				},false);
			})(i);
		}
	},
	/*
	*	@desc: move to the target position 
	*	@param:  {Numeber}
	*/
	toMove:function(iTarget){
		var oBody=document.getElementById('js_body');
		setTimeout(function(){
			oBody.style.WebkitTransition='1s all ease';
			oBody.style.WebkitTransform='translateY('+iTarget+'px)';
		},0);
		
		OJoy.effect.pageTranslateY=iTarget;
	},
	/*---2
	*	@desc: controll the cubic 
	*	@param:  {}
	*/
	contrlCubic:function(){;
		var oCubic=document.getElementById('js_showbox');
		var lastX=-30;
		var lastY=0;
		/*oCubic.onmousedown=function(ev){
			var disX=ev.clientX-lastX;
			var disY=ev.clientY-lastY;
			document.onmousemove=function(ev){
				var x=ev.clientX-disX;
				var y=ev.clientY-disY;
				oCubic.style.transform='perspective(800px) rotateY('+x+'deg) rotateX(-'+y+'deg)';
				lastX=x;
				lastY=y;
			}
			document.onmouseup=function(){
				document.onmousemove=null;
				document.onmouseup=null;
				oCubic.releaseCapture&&oCubic.releaseCapture();
			}
			oCubic.setCapture&&oCubic.setCapture();
			return false;
		}*/
	},
	/*---3
	*	@desc: draw chart 
	*	@param:  {}
	*/
	drawChart:function(){;
		var aSkills=[['js_javascript',90,'orange'],['js_jqr',58,'#1f8'],['js_h5',80,'#f33'],['js_back',30,'#38f']];
		for(var i=0;i<aSkills.length;i++){
			toDraw(aSkills[i][0],aSkills[i][1],aSkills[i][2]);
		}
		function toDraw(id,num,color){
			var oC=document.getElementById(id);
			oC.width=oC.height=oC.parentNode.offsetWidth;
			var cx=oC.width/2;
			var cy=oC.height/2;
			var r=cx-20;

			var oSpan=oC.parentNode.querySelector('span');

			var gd=oC.getContext('2d');

			clearInterval(oC.timer);
			var i=0;
			oC.timer=setInterval(function(){
				i++;
				if(i==num){
					clearInterval(oC.timer);
				}
				oSpan.innerHTML=i+'%';
				var deg=i/100*2*Math.PI-0.5*Math.PI;

				gd.clearRect(0,0,oC.width,oC.height,false);

				gd.beginPath();
				gd.lineWidth=20;
				gd.strokeStyle='#bbb';
				gd.arc(cx,cy,r,0,2*Math.PI);
				gd.stroke();
				
				gd.beginPath();
				gd.strokeStyle=color;
				gd.arc(cx,cy,r,-0.5*Math.PI,deg);
				gd.stroke();
		
			},30);
		}
	},
	/*---4
	*	@desc: swap the screen by x and y 
	*	@param:  {}
	*/
	pageTranslateY:0,//changed also in toMove(function)
	swapScreen:function(){
		var oBody=document.getElementById('js_body');//the content of the body---y

		var oBox=document.getElementById('js_worksbox');//the tabs---x
		var oUl=oBox.children[0];
		var aLi=oUl.children;
		var aBtn=document.getElementById('js_workbtns').children;
		var ulTranslateX=0;
		
		document.addEventListener('touchstart',function(ev){
			var x=ev.targetTouches[0].pageX;
			var y=ev.targetTouches[0].pageY;
			var disX=x-ulTranslateX;
			var disY=y-OJoy.effect.pageTranslateY;

			oUl.style.WebkitTransition='none';
			oBody.style.WebkitTransition='none';

			var dir='';
			
			function move(ev){
				var mx=ev.targetTouches[0].pageX;
				var my=ev.targetTouches[0].pageY;

				if(!dir){
					if(Math.abs(my-y)>=3){//once swap by y, you can't swap by x 
						dir='ud';
					}else if(Math.abs(mx-x)>=3){
						dir='rl';
					}
				}else{

					if(dir=='ud'){
						OJoy.effect.pageTranslateY=my-disY;
						(OJoy.effect.pageTranslateY>=0) && (OJoy.effect.pageTranslateY=0);

						(OJoy.effect.pageTranslateY<=document.documentElement.clientHeight-oBody.offsetHeight) && (OJoy.effect.pageTranslateY=document.documentElement.clientHeight-oBody.offsetHeight);
	
						oBody.style.WebkitTransform='translateY('+OJoy.effect.pageTranslateY+'px)';
					}else if(dir=='rl'){
						ulTranslateX=mx-disX;
						(ulTranslateX<-aLi[0].offsetWidth*(aLi.length-1)) && (ulTranslateX=-aLi[0].offsetWidth*(aLi.length-1));
						(ulTranslateX>0) && (ulTranslateX=0);
						
						oUl.style.WebkitTransform='translateX('+ulTranslateX+'px)';
					}
				}
			}
			function end(){
				document.removeEventListener('touchmove',move,false);
				document.removeEventListener('touchend',end,false);

				if(dir=='ud'){

				}else if (dir=='rl') {
					var n=-Math.round(ulTranslateX/aLi[0].offsetWidth);
					if(n<=0){
						n=0;
					}else if(n>=(aLi.length-1)){
						n=(aLi.length-1);
					}
					for(var j=0;j<aBtn.length;j++){
						aBtn[j].className='';
					}
					aBtn[n].className='cur';
					ulTranslateX=-aLi[0].offsetWidth*n;
					oUl.style.WebkitTransition='.5s all ease';
					oUl.style.WebkitTransform='translateX('+ulTranslateX+'px)';
				}
			}
			document.addEventListener('touchmove',move,false);
			document.addEventListener('touchend',end,false);
			ev.preventDefault();
		},false); 
	}
};

;(function(global){
	var OJoy=global.OJoy||{};
	OJoy.util=OJoy.util||{};
	OJoy.effect=OJoy.effect||{};

	//adapt to device
	global.onload=global.onresize=OJoy.effect.adaptDev;
	//loading the object
	document.addEventListener('DOMContentLoaded',function(){
		
		//1.locate in the page by the nav
		OJoy.effect.locatePage();

		//2.rotate the cubic
		OJoy.effect.contrlCubic();

		//3.draw chart of skills
		var bOnce=false;//make sure to draw charts once time
		var timer=null;
		var drawPage=document.getElementById('js_skill');
		var drawT=drawPage.offsetTop;

		timer=setInterval(function(){

			if(bOnce==false){
				if(OJoy.effect.pageTranslateY<=-drawT){
					OJoy.effect.drawChart();
					bOnce=true;
				}
			}else if(bOnce==true){
				clearInterval(timer);
			}
		},3000);

		// 4. change the 'WORKS' tabs
		OJoy.effect.swapScreen();

		
	},false);

})(window);
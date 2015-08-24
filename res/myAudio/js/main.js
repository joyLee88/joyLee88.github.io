window.onload=window.onresize=function(){
	document.documentElement.style.fontSize=document.documentElement.clientWidth/16+'px';
};
document.addEventListener('DOMContentLoaded',function(){
	//1. 音乐单
		var aAudio=[{'sing':'loving you','singer':'侧田'},{'sing':'残缺的歌','singer':'王啸坤'},{'sing':'Just A Feeling','singer':'Maroon5'},{'sing':'我希望你快乐','singer':'品冠'}];

	//2. 初始化显示
		//初始化歌曲进度条绘制
		showPicProgress(0);
		function showPicProgress(scale){
			var pW=document.getElementById('js_progressbox').offsetWidth/2;
			var oProgress=document.getElementById('js_progress');
			var oCtx=oProgress.getContext('2d');
			oCtx.clearRect(0,0,2*pW,2*pW);//清除上一次的内容，以便切歌的时候
			oCtx.strokeStyle='#fff';
			oCtx.lineWidth=21;
			oCtx.beginPath();
			oCtx.arc(pW,pW,pW-10,-0.5*Math.PI,2*Math.PI*scale-0.5*Math.PI);
			oCtx.stroke();

		}
		//制作音乐播放器
		var oA=new Audio();
		oA.src='src/'+'0.mp3';
		
		//初始化界面歌曲内容显示
		var iNow=0;
		initShowUI();
		function initShowUI(){
			var oIntro=document.getElementById('js_intro');
			var oPic=document.getElementById('js_pic');
			oIntro.innerHTML=aAudio[iNow].sing+'-<em>'+aAudio[iNow].singer+'</em>';
			oPic.style.backgroundImage='url(img/'+iNow+'.jpg)';
		}

	//3.开始进行播放控制
		var oUl=document.querySelector('.barbox ul');
		var oPrev=oUl.children[0];
		var oPlay=oUl.children[1];
		var oPlayBarBox=document.querySelector('.playbox');
		var oPlayBar=document.querySelector('.playprog');
		var oPlayGoing=oPlayBar.children[0];
		var oPlayGoBtn=oPlayGoing.children[0];
		var oPlayTotal=document.querySelector('.total');
		var oPlayCur=document.querySelector('.cur');
		var oNext=oUl.children[2];
		var oVlm=oUl.children[3];
		var oVlumBar=oUl.children[4];
		var oVlmGoing=oVlumBar.children[0].children[0];
		var oVlumGoBtn=oVlmGoing.children[0];
		var oList=oUl.children[5];
		var oListBox=document.querySelector('.t');
		var bSing=false;//标记播放状态
		var bMuted=false;//标记是否静音

		//控制播放
		function playSing(){

			oA.src='src/'+iNow+'.mp3';
			oA.play();
			var oPic=document.getElementById('js_pic');
			oPic.style.WebkitAnimationPlayState='running';
			oPlay.children[0].src='img/play.png';	
		}
		function toDou(num){
			return num<10?'0'+num:num;
		}
		//控制暂停
		function stopSing(){
			oA.pause();
			var oPic=document.getElementById('js_pic');
			oPic.style.WebkitAnimationPlayState='paused';
			oPlay.children[0].src='img/pause.png';
		}

	/*	document.addEventListener('touchstart',function(ev){
			ev.preventDefault();
		},false);*/
		//切歌

		/*oPrev.onclick=function(){
			bSing=true;//默认切换歌单是自动播放的
			iNow--;
			if(iNow<0)iNow=aAudio.length-1;

			oA.src='src/'+iNow+'.mp3';
			playSing();
			initShowUI();
		};*/
		oPrev.addEventListener('touchstart',function(ev){
			bSing=true;//默认切换歌单是自动播放的
			iNow--;
			if(iNow<0)iNow=aAudio.length-1;

			oA.src='src/'+iNow+'.mp3';
			playSing();
			initShowUI();
		},false);
		/*oNext.onclick=function(){
			bSing=true;
			iNow++;
			if(iNow==aAudio.length)iNow=0;
			oA.src='src/'+iNow+'.mp3';
			playSing();
			initShowUI();
		};*/
		oNext.addEventListener('touchstart',function(ev){
			bSing=true;
			iNow++;
			if(iNow==aAudio.length)iNow=0;
			oA.src='src/'+iNow+'.mp3';
			playSing();
			initShowUI();
		},false);
		/*oPlay.onclick=function(){
			if(bSing){
				stopSing();
			}else{
				playSing();
			}
			bSing=!bSing;
		};*/
		oPlay.addEventListener('touchstart',function(ev){
			if(bSing){
				stopSing();
			}else{
				playSing();
			}
			bSing=!bSing;
		},false);
		//图片显示
		oA.ontimeupdate=function(){
			var scale=oA.currentTime/oA.duration;
			showPicProgress(scale);//图片进度展示效果
			changeProgress(scale);//进度条实时变化
			//时间显示
			oPlayTotal.innerHTML=toDou(parseInt(oA.duration/60))+':'+toDou(parseInt(oA.duration%60));
			oPlayCur.innerHTML=toDou(parseInt(oA.currentTime/60))+':'+toDou(parseInt(oA.currentTime%60));
			getCurrentStyle();
		};

		oA.onended=function(){
			oPlayTotal.innerHTML='00:00';
			oPlayCur.innerHTML='00:00';
			//oNext.onclick();
			//alert(iBtn%3)
			switch(iBtn%3){
				case 0://顺序
					oNext.onclick();
				break;
				case 1://随机
					var k=parseInt(Math.random()*aAudio.length);
					iNow=k;
					oNext.onclick();
				break;
				case 2://循环
					iNow--;
					oNext.onclick();
				break;
			}
		};
		//音量控制
		oVlm.onclick=function(){
			if(bMuted){
				oA.muted=false;
				oVlm.children[0].src='img/audio-high.png';
			}else{
				oA.muted=true;
				oVlm.children[0].src='img/audio-mute.png';
			}
			bMuted=!bMuted;
		};
		drag(oVlumGoBtn);//拖动音量条
		function drag(obj){
			
			obj.onmousedown=function(ev){
				// 默认只要改变声音条，说明是不希望静音的
				oA.muted=false;
				bMuted=false;
				oVlm.children[0].src='img/audio-high.png';

				var oEvent=ev||event;
				var disX=oEvent.clientX-obj.offsetLeft;
				var oTip=document.createElement('b');
				obj.parentNode.appendChild(oTip);
				document.onmousemove=function(ev){
					var oEvent=ev||event;
					//拖的是圆，但是动的圆的父级，动的进度条；背景进度条在这里仅仅提供一个长度控制
					var l=oEvent.clientX-disX;
					var scale=getBtnPos(obj,l);
					oA.volume=scale;
					oTip.innerHTML=parseInt(scale*100)+'%';

				};
				document.onmouseup=function(){
					obj.parentNode.removeChild(oTip);
					document.onmousemove=null;
					document.onmouseup=null;
					obj.releaseCapture&&obj.releaseCapture();
				};
				obj.setCapture&&obj.setCapture();
				return false;
			}
		}
		function getBtnPos(obj,l){//拖拽和点击公用定位
			if(l<=0){
				l=0;
			}else if(l>=obj.parentNode.parentNode.offsetWidth-obj.offsetWidth){
				l=obj.parentNode.parentNode.offsetWidth-obj.offsetWidth;
			}
			var scale=l/(obj.parentNode.parentNode.offsetWidth-obj.offsetWidth);
			
			obj.parentNode.style.width=scale*100+'%';
			//上面是按钮范围的比例，返回数据的比例
			return scale;
		}
		oVlumBar.children[0].onclick=function(ev){//点击音量条
			// 默认只要改变声音条，说明是不希望静音的
			oA.muted=false;
			bMuted=false;
			oVlm.children[0].src='img/audio-high.png';
			var l=ev.clientX-getPos(oVlumBar.children[0]);
			var scale=getBtnPos(oVlumGoBtn,l);
			oA.volume=scale;
		};
		function getPos(obj){
			var left=0;
			while(obj){
				left+=obj.offsetLeft;
				obj=obj.offsetParent;
			}
			return left;
		}

		//控制播放进度
		function changeProgress(scale){//这个scale是播放进度条长度，但是我希望的播放进度条长度最短有按钮的长度，所以要处理
			oPlayGoing.style.width=scale*100+'%';
		}
		dragProgress(oPlayGoBtn);//拖动播放进度条
		function dragProgress(obj){//由于声音和播放进度的多区别，所以仅仅这拖拽没有公用
			
			obj.onmousedown=function(ev){
				// 默认只要改变进度条，说明是不希望暂停的
				playSing();
				bSing=true;

				var oEvent=ev||event;
				var disX=oEvent.clientX-obj.offsetLeft;
				document.onmousemove=function(ev){
					var oEvent=ev||event;
					//拖的是圆，但是动的圆的父级，动的进度条；背景进度条在这里仅仅提供一个长度控制
					var l=oEvent.clientX-disX;
					var scale=getBtnPos(obj,l);
					oA.currentTime=oA.duration*scale;
				};
				document.onmouseup=function(){
					document.onmousemove=null;
					document.onmouseup=null;
					obj.releaseCapture&&obj.releaseCapture();
				};
				obj.setCapture&&obj.setCapture();
				return false;
			}
		}
		oPlayBar.onclick=function(ev){//点击音量条
			var l=ev.clientX-getPos(oPlayGoBtn);
			var scale=getBtnPos(oPlayGoBtn,l);
			oA.currentTime=oA.duration*scale;
			playSing();
			bSing=true;
		};

	//4.歌单显示
		var oListBtn=oListBox.children[0];
		var oListUl=oListBox.children[1];
		var oListBarBox=oListBox.children[2];
		var oListBar=oListBarBox.children[0];
		var bOpen=false;
		oList.onclick=function(){
			if(bOpen){
				oListBox.style.WebkitAnimation='.5s tRotateBack linear forwards';
			}else{
				addSing();
				oListBox.style.WebkitAnimation='.5s tRotate ease forwards';
			}
			bOpen=!bOpen;
		}
		//添加歌单
		addSing();
		function addSing(){
			oListUl.innerHTML='';
			for(var i=0;i<aAudio.length;i++){
				var oLi=document.createElement('li');
				oLi.innerHTML=aAudio[i].sing+'-'+'<em>'+aAudio[i].singer+'</em>';
				oListUl.appendChild(oLi);
				if (iNow==i) {
					oLi.className='current';
				}
				(function(index){
					oLi.onclick=function(){
						bSing=true;
						iNow=index;
						oA.src='src/'+iNow+'.mp3';
						playSing();
						initShowUI();
					}
				})(i);
				
			}
		}
		function getCurrentStyle(){//这个应该放在歌曲时间更新时间上去
			var aLi=oListUl.children;
			for(var i=0;i<aLi.length;i++){
				aLi[i].className='';
			}
			aLi[iNow].className='current';
		}
		//自定义滚动
		dragBar();
		function dragBar(){
			oListBar.onmousedown=function(ev){
				var oEvent=ev||event;
				var disY=oEvent.clientY-oListBar.offsetTop;
				document.onmousemove=function(ev){
					var oEvent=ev||event;
					var t=oEvent.clientY-disY;
					changeWheel(t);
				};
				document.onmouseup=function(){
					document.onmousemove=null;
					document.onmouseup=null;
				}
				return false;
			}
		}
		function changeWheel(t){
			t<=0&&(t=0);
			t>=(oListBar.parentNode.offsetHeight-oListBar.offsetHeight)&&(t=oListBar.parentNode.offsetHeight-oListBar.offsetHeight);
				oListBar.style.top=t+'px';
			//
			oListUl.style.top=-t/(oListBar.parentNode.offsetHeight-oListBar.offsetHeight)*(oListUl.offsetHeight-oListBox.offsetHeight)+'px';
		}
		addWheel(oListBox,function(bDown){
			var t=oListBar.offsetTop;
			if(bDown){
				t+=10;
			}else{
				t-=10;
			}
			changeWheel(t);
		});
		function addWheel (obj,fn) {
			if (window.navigator.userAgent.toLowerCase().indexOf('firefox')!=-1) {
				//ff
				obj.addEventListener('DOMMouseScroll',fnWheel,false);
			}else{
				obj.onmousewheel=fnWheel;
			};

			function fnWheel(ev){
				var oEvent=ev||event;
				var bDown=true;
				if (oEvent.wheelDelta) {
					//ie 向下为负
					if (oEvent.wheelDelta<0) {
						bDown=true;
					}else{
						bDown=false;
					};
				}else{
					if (oEvent.detail>0) {
						bDown=true;
					}else{
						bDown=false;
					};
				};
				fn(bDown);
				//事件绑定  阻止浏览器滚动条默认事件
				oEvent.preventDefault&&oEvent.preventDefault();
				return false;
			}
		}

		//控制播放模式
		var aBtn=['shun','shuffle','repeat-2'];
		var iBtn=0;
		oListBtn.onclick=function(){
			iBtn++;
			oListBtn.children[0].src='img/'+aBtn[iBtn%3]+'.png';
			//在一首歌播完后，onended检测该按钮选择
		}
	

},false);
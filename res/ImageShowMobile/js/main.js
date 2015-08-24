;(function(g){
	g.onload=function(){
		document.documentElement.style.fontSize=document.documentElement.clientWidth/68.3+'px';
		g.onresize=function(){
			document.documentElement.style.fontSize=document.documentElement.clientWidth/68.3+'px';
		};
		// 0.选择想要的效果，显示该效果
		var aChoose=document.querySelectorAll('ol li span');
		var aBox=document.querySelectorAll('.box');//图片盒子
		var aName=['3D滑动','多图单页','翻页','爆破','颗粒翻转','3D图片环'];
		var aSeen=[false,false,false,false,false,false];
		var oName=document.querySelector('.txt span');

		for(var i=0;i<aChoose.length;i++){
			(function(index){
				aChoose[index].onmousedown=function(){
					for(var i=0;i<aBox.length;i++){
						aBox[i].style.display='none';
					}
					oName.innerHTML=aName[index];
					aBox[index].style.display='block';
					if(aSeen[index]==false){//只new一次，提高程序运行效率
						toRunFn(index);
						aSeen[index]=true;
					}
				};
			})(i);
		}
		
		// 1.3D滑动：参数id:3D滑动盒子的id
		// 鼠标滑动效果待加
		
		;(function(){
			g.Slides=function(id){
				this.oSlideBox=document.getElementById(id);
				var oPrev=this.oSlideBox.querySelector('.prev');
				var oNext=this.oSlideBox.querySelector('.next');
				this.aLi=this.oSlideBox.querySelectorAll('ul li');
				//得到初始化的一组classsname，记下每一个li的class，没有的当然是undefined
				this.aClass=[];
				for(var i=0;i<this.aLi.length;i++){
					this.aClass[i]=this.aLi[i].className;
				}
				//解决多次连续点击的问题
				this.bReady=true;

				var _this=this;
				oPrev.onmousedown=function(){
					_this.prevClick();
					_this.changeLiClass();
				};
				oNext.onmousedown=function(){
					_this.nextClick();
					_this.changeLiClass();
				};		
			};
			//改变数组
			Slides.prototype.prevClick=function(){
				if(this.bReady==false)return;//如果动画没播完，就不响应
				this.bReady=false;
				this.aClass.push(this.aClass.shift());
				//就以当前图cur类名元素来判断动画是否走完了
				var oCur=this.oSlideBox.querySelector('.cur');
				var _this=this;
				oCur.addEventListener('transitionend',function(){
					_this.bReady=true;
				},false);
			};
			Slides.prototype.nextClick=function(){
				if(this.bReady==false)return;//如果动画没播完，就不响应
				this.bReady=false;
				this.aClass.unshift(this.aClass.pop());
				var oCur=this.oSlideBox.querySelector('.cur');
				var _this=this;
				oCur.addEventListener('transitionend',function(){
					_this.bReady=true;
				},false);
			};
			//将改变的数组赋给每一个li的class
			Slides.prototype.changeLiClass=function(){
				for(var i=0;i<this.aLi.length;i++){
					this.aLi[i].className=this.aClass[i];
				}
			};
			new Slides('js_slidebox');
		})();
		

		// 2.多图显示：css3即可实现

		// 3.翻页效果，参数id:盒子的id，n:图片总张数
		;(function(){
			//2)js部分
			/*当前看到的是第m张，点击下一张，page1瞬间回到右半边，即将transition清空
			从而以下布局：
			pagebox 100% 背景图为(m).jpg全图;
 				子page1 50%宽度 定位right:0 
 					子span作为正面	背景图为(m).jpg右半部分 ——与box左背景合成一张图 
 					子span作为背面	背景图为(m+1).jpg左半部分;
 				子page2 50%宽度 同样定位right:0 背景图为(m+1).jpg右半部分——与上面背面合成一张图;
 			*/ 
			g.PageTurn=function(id,n){
				this.oPageBox=document.getElementById(id);
				var oPrev=this.oPageBox.querySelector('.prev');
				var oNext=this.oPageBox.querySelector('.next');
				this.oPage1=this.oPageBox.querySelector('.page1');
				this.oFront=this.oPage1.children[0];
				this.oBack=this.oPage1.children[1];
				this.oPage2=this.oPageBox.querySelector('.page2');
				this.n=n;//共有n张图片
				this.m=0;//当前是第几张，从0开始

				//解决多次连续点击的问题
				this.bReady=true;

				var _this=this;
				this.oPageBox.addEventListener('touchstart',function(){
					_this.nextClick();
				},false);			
			};
			PageTurn.prototype.nextClick=function(){
				if(this.bReady==false)return;//如果动画没播完，就不响应
				this.bReady=false;
				this.oPage1.style.WebkitTransition='1s all ease';
				this.oPage1.style.WebkitTransform='rotateY(-180deg)';
				var _this=this;
				_this.m++;//必须放在transitionend前面，因为会根据属性多次执行
				_this.oPage1.addEventListener('transitionend',function(){
					//点击下一页，并保证前一个翻页动画是播完了的，就瞬间回到原位置
					_this.oPage1.style.WebkitTransition='none';
					_this.oPage1.style.WebkitTransform='rotateY(0deg)';
					//并偷偷改变了内容
					_this.oFront.style.backgroundImage=_this.oPageBox.style.backgroundImage='url(img/b'+_this.m%_this.n+'.jpg)';
					_this.oBack.style.backgroundImage=_this.oPage2.style.backgroundImage='url(img/b'+((_this.m+1)%_this.n)+'.jpg)';

					
					_this.bReady=true;
				},false);
			};
		})();

		// 4.爆破效果，参数id:盒子的id，R:分多少行，C:分多少列,n:图片张数
		;(function(){
			g.Explode=function(id,R,C,n){
				/* 
				2)上面覆盖的span背景图m爆破，此时：box背景图为m+1;
				  保证结束动画，此时，span背景图换为m+1瞬间回到原始位置，box背景图为m+2
				 */
				this.oExBox=document.getElementById(id);
				//平铺span	注意offset类的属性必在display为block时候才会得到
				
				for(var r=0;r<R;r++){
					for(var c=0;c<C;c++){
						var oSpan=document.createElement('span');
						this.oExBox.appendChild(oSpan);

						oSpan.style.width=(this.oExBox.offsetWidth-4)/C+'px';
						oSpan.style.height=(this.oExBox.offsetHeight-4)/R+'px';
						oSpan.style.backgroundImage='url(img/b0.jpg)';
						oSpan.style.left=c*oSpan.offsetWidth+'px';
						oSpan.style.top=r*oSpan.offsetHeight+'px';
						oSpan.style.backgroundPosition='-'+c*oSpan.offsetWidth+'px -'+r*oSpan.offsetHeight+'px';
					}
				}
				this.bReady=true;
				this.n=n;
				this.m=0;
				this.aSpan=this.oExBox.querySelectorAll('span');

				var _this=this;
				this.oExBox.addEventListener('touchstart',function(){
					_this.nextClick();
				},false);		
			};
			Explode.prototype.nextClick=function(){
				if(this.bReady==false)return;//如果动画没播完，就不响应
				this.bReady=false;
				this.m++;
				
				for(var i=0;i<this.aSpan.length;i++){//每一个方块点击后爆破的运动轨迹
					this.aSpan[i].style.WebkitTransition='1s all ease';
					//离盒子中心，x轴或是y轴方向越远，运动在x轴或是y轴上的越远;旋转是随机的；z轴上的无所谓
					var x=this.aSpan[i].offsetLeft+this.aSpan[i].offsetWidth/2-this.oExBox.offsetWidth/2;
					var y=this.aSpan[i].offsetTop+this.aSpan[i].offsetHeight/2-this.oExBox.offsetHeight/2;
					this.aSpan[i].style.WebkitTransform='translate3d('+x+'px,'+y+'px,100px) rotateX('+this.rnd(0,180)+'deg) rotateY('+this.rnd(0,180)+'deg)';
					this.aSpan[i].style.opacity=0;
				}
				//爆破后，各个span偷偷瞬间回去，换上给人看到的当前图片，后面的box换上下一张
				var _this=this;
				_this.aSpan[0].addEventListener('transitionend',function(){
					for(var i=0;i<_this.aSpan.length;i++){
						
						_this.aSpan[i].style.WebkitTransition='none';
						_this.aSpan[i].style.opacity=1;
						_this.aSpan[i].style.WebkitTransform='translate3d(0,0,0) rotateX(0deg) rotateY(0deg)';
						_this.oExBox.style.backgroundImage='url(img/b'+(_this.m+1)%_this.n+'.jpg';
						_this.aSpan[i].style.backgroundImage='url(img/b'+(_this.m)%(_this.n)+'.jpg)';
					}
					_this.bReady=true;
				},false);

			};
			Explode.prototype.rnd=function(n,m){
				return parseInt(n+Math.random()*(m-n));
			};
		})();

		// 5.颗粒翻转效果，参数id:盒子的id，R:分多少行，C:分多少列,n:图片张数
		;(function(){
			g.Cubic=function(id,R,C,n){
				/* 
				2)生成的span具有正反两面
				 */
				this.oCubicBox=document.getElementById(id);
				//平铺span	注意offset类的属性必在display为block时候才会得到
				
				for(var r=0;r<R;r++){
					for(var c=0;c<C;c++){
						var oSpan=document.createElement('span');
						this.oCubicBox.appendChild(oSpan);

						oSpan.style.width=(this.oCubicBox.offsetWidth-4)/C+'px';
						oSpan.style.height=(this.oCubicBox.offsetHeight-4)/R+'px';
						oSpan.style.left=c*oSpan.offsetWidth+'px';
						oSpan.style.top=r*oSpan.offsetHeight+'px';

						oSpan.innerHTML='<em class="front"></em><em class="back"></em>';
						//已初始设置正反样式背景图，在这定下背景定位
						oSpan.children[0].style.backgroundPosition='-'+c*oSpan.offsetWidth+'px -'+r*oSpan.offsetHeight+'px';
						oSpan.children[1].style.backgroundPosition='-'+c*oSpan.offsetWidth+'px -'+r*oSpan.offsetHeight+'px';


						/*若是一行一行的动画，设置每一个颗粒翻转的延迟时间，就记下这个：一组span i*time;*/
						oSpan.r=r;
						oSpan.c=c;
						/*在这打算做的一行行阶梯翻转下一个翻转的时间即为(r+c)*time*/
						
					}
				}
				this.bReady=true;
				this.n=n;
				this.m=0;
				this.aSpan=this.oCubicBox.querySelectorAll('span');

				var _this=this;		
				this.oCubicBox.addEventListener('touchstart',function(){
					_this.nextClick();
				},false);	
			};
			Cubic.prototype.nextClick=function(){
				if(this.bReady==false)return;
				this.bReady=false;
				this.m++;
				for(var i=0;i<this.aSpan.length;i++){//开始翻转
					this.aSpan[i].style.WebkitTransition='1s all ease '+(this.aSpan[i].r+this.aSpan[i].c)*200+'ms';
					this.aSpan[i].style.WebkitTransform='rotateY(180deg)';
				}
				//翻转后，各个span偷偷瞬间转回去，换上给人看到的当前图片，背面换上下一张
				var _this=this;
				this.aSpan[this.aSpan.length-1].addEventListener('transitionend',function(){
					for(var i=0;i<_this.aSpan.length;i++){
						
						_this.aSpan[i].style.WebkitTransition='none';
						_this.aSpan[i].style.WebkitTransform='rotateY(0deg)';
						_this.aSpan[i].children[0].style.backgroundImage='url(img/b'+(_this.m)%(_this.n)+'.jpg)';
						_this.aSpan[i].children[1].style.backgroundImage='url(img/b'+(_this.m+1)%_this.n+'.jpg';	
					}
					_this.bReady=true;
				},false);
			};
		})();

		// 6.图片环效果，参数id:盒子的id，n:图片张数
		;(function(){
			g.Circle=function(id,n){
				
				this.oCirBox=document.getElementById(id);
				this.n=n;
				// 先创建
				this.createPic();
				//记录横向旋转
				this.y=0;
				this.lastY=0;
				this.iSpeedY=0;
				this.timer=null;
			};
			Circle.prototype.createPic=function(){
				for(var i=0;i<this.n;i++){
					var oDiv=document.createElement('div');
					oDiv.style.backgroundImage='url(img/'+(i+1)+'.jpg)';
					this.oCirBox.appendChild(oDiv);

					oDiv.innerHTML='<span></span>';
					//制作倒影
					oDiv.children[0].style.backgroundImage='url(img/'+(i+1)+'.jpg)';

					//放出图片，出牌效果
					oDiv.style.WebkitTransition='1s all ease '+(this.n-i)*300+'ms';
					var _this=this;
					//i的问题，不然会瞬间出来
					;(function(oDiv,index){
						setTimeout(function(){
							oDiv.style.WebkitTransform='rotateY('+360/_this.n*index+'deg) translateZ(300px)';
							//z轴抽出，各个div都绕原来位置为中心
						},0);
					})(oDiv,i);

				}
				this.aDiv=this.oCirBox.children;
				//动画播完后用户才能移动
				var _this=this;
				//第一张是最后播完的
				this.aDiv[0].addEventListener('transitionend',function(){
					// _this.keyControl();
					_this.change;
					_this.mouseControl();
				},false);
			};
			Circle.prototype.mouseControl=function(){
				var _this=this;
				this.oCirBox.addEventListener('touchstart',function(ev){
					clearInterval(_this.timer);
					_this.clearMove();//定时器和transition的冲突，先关闭一下，后头去开
					var disX=ev.targetTouches[0].pageX-_this.y;
					document.onmousemove=function(ev){
						_this.y=ev.targetTouches[0].pageX-disX;
						_this.change();
						_this.iSpeedY=ev.targetTouches[0].pageX-_this.lastY;//实时的获取速度，以便松手的时候有值
						_this.lastY=ev.targetTouches[0].pageX;
					};
					document.onmouseup=function(){
						document.onmousemove=null;
						document.onmouseup=null;
						var _this=this;
						this.timer=setInterval(function(){
							_this.iSpeedY*=0.95;
							_this.y+=_this.iSpeedY;
							_this.change();
						},30);
						document.releaseCapture&&document.releaseCapture();
					};
					document.setCapture&&document.setCapture();
					ev.preventDefault();
				},false);
				
			};
			Circle.prototype.move=function(){
				for(var i=0; i<this.aDiv.length; i++){
					this.aDiv[i].style.WebkitTransition='1s all ease';
				}	
			};
			Circle.prototype.clearMove=function(){
				for(var i=0; i<this.aDiv.length; i++){
					this.aDiv[i].style.WebkitTransition='none';
				}	
			};
			Circle.prototype.change=function(){
				for(var i=0;i<this.aDiv.length;i++){//实际是可以用box是去转的，这里用的adiv
					this.aDiv[i].style.WebkitTransform='rotateY('+(360/this.n*i+this.y)+'deg) translateZ(300px)';
					var s=Math.abs((360/this.n*i+this.y)%360);

					s>180 && (s=360-s);

					s=180-s;

					var scale=s/180;
					//造成透明度是从最前面这一张向两边扩散降低的数值

					scale<0.2 && (scale=0.2);
					this.aDiv[i].style.opacity=scale;
				}
			};
		})();



		//选项运行函数:
		/*
			1.这样做最初目的是因为爆破效果需要得到盒子宽高，但是隐藏的时候是没有盒子宽高的；只有在显示那一刻再去触发计算盒子宽高
			2.选择性加载
		*/
		function toRunFn(n){
			switch(n){
				case 0:
					new Slides('js_slidebox');
				break;
				case 1:
				break;
				case 2:
					new PageTurn('js_pagebox',3);
				break;
				case 3:
					new Explode('js_explodebox',4,7,3);
				break;
				case 4:
					new Cubic('js_cubicbox',4,7,3);
				break;
				case 5:
					new Circle('js_circlebox',11);
				break;
			}
		}
		//toRunFn(0);
			//Slides is not defined报错：我想应该是slides是后加载的；而且包了好几层也没办法

			//我只有在slide匿名空间里自调用一次


	};
		
})(window);
function Slide(wrap,cont,point,tag){
  this.winW = document.documentElement.clientWidth;
  this.winH = document.documentElement.clientHeight;
  this.wrap = document.getElementById(wrap);
  this.cont = document.getElementById(cont);
  this.cont_li = this.cont.getElementsByTagName("li");
  this.slide_points = document.getElementById(point).getElementsByTagName(tag);

  this.startN = 0;
  this.prev = 1;
  this.startX = 0;
  this.startY = 0;
  this.endX = 0;
  this.transX = 0;
  this.transY = 0;
}

Slide.prototype = {
  init:function(){
    this.startN = 0;
    this.cont_li[0].className = 'play';
    this.cont_li[0].style.opacity = 1;
    for(var i=1;i<this.cont_li.length;i++){
      this.cont_li[i].style.webkitTransform = 'translate3d(0,'+this.winH+'px,0)';
    }
    this.resize();
    this.addHandler(this.wrap,"touchstart",this.bind_fn(this,this.touch_start));
    this.addHandler(this.wrap,"touchmove",this.bind_fn(this,this.touch_move));
    this.addHandler(this.wrap,"touchend",this.bind_fn(this,this.touch_end));
  },
  resize : function(){
    this.winH = document.documentElement.clientHeight;
    document.body.style.height=this.wrap.style.height = this.winH+"px";

    for(var i=0;i<this.cont_li.length;i++){
      this.cont_li[i].style.height = this.winH+'px';
    }
  },
  addHandler : function(elem,evtype,fn){
    if(elem.attachEvent){
      elem.attachEvent('on'+evtype,fn);
    }else if(elem.addEventListener){
      elem.addEventListener(evtype,fn,false);
    }else{
      elem["on"+evtype] = fn;
    }
  },
  bind_fn : function(obj,func){
    return function(){
      func.apply(obj,arguments);
    };
  },
  touch_start : function(e){
    if(!event.touches.length) return;
    var touch = event.touches[0];
        this.startX = touch.pageX;
        this.startY = touch.pageY;
  },
  touch_move : function(e){
    if(!event.touches.length) return;
    e.preventDefault();
    var touch = event.touches[0];
    this.transX = this.startX-touch.pageX;
    this.transY = this.startY-touch.pageY;


    if(Math.abs(this.transY)>Math.abs(this.transX)){
      this.transY = this.startY-touch.pageY;
      this.prev = this.transY/Math.abs(this.transY);

      var index = this.startN+this.prev;
      if(typeof this.cont_li[index] != 'undefined'){
        this.cont_li[index].style.opacity = 1;
        this.cont_li[index].style.zIndex = 50;
        this.cont_li[index].style.webkitTransitionDuration = 0;
        this.cont_li[index].style.webkitTransform = "translate3d(0,"+(this.prev*this.winH-(this.transY))+"px,0)";

        this.cont_li[this.startN].style.zIndex=20;
      }
    }
  },
  touch_end : function(){
    if(Math.abs(this.transY)>Math.abs(this.transX) && Math.abs(this.transY)>50){
      this.cont_li[this.startN].className = '';
      this.play(this.startN+this.prev);
    }else{
      this.play(this.startN);
    }
    this.transY = this.transX = 0;
  },
  play : function(n){
    var _=this;
    if(n>=this.cont_li.length){
      n = this.cont_li.length-1;
    }
    if(n<0){
      n = 0;
    }
    if(typeof this.cont_li[n] != 'undefined'){
      this.cont_li[_.startN].style.zIndex = 20;
      this.cont_li[n].className = 'play';
      this.cont_li[n].style.webkitTransitionDuration = '300ms';
      this.cont_li[n].style.webkitTransform = 'translate3d(0,0,0)';
      this.cont_li[n].style.opacity=1;
      this.cont_li[n].style.zIndex = 50;

      this.slide_point(n);

      setTimeout(function(){
        _.startN = n;
        if(_.startN+_.prev>=0 && _.startN+_.prev<=_.cont_li.length){
            if (_.cont_li[_.startN-_.prev]) {
                _.cont_li[_.startN-_.prev].style.opacity = 0;
            }
        }
      },300);

    }
    if(n === 0){
      document.getElementById('slide_point').style.display = 'none';
    }else{
      document.getElementById('slide_point').style.display = 'block';
    }
  }
  ,
  slide_point : function(n){
    for(var i=0;i<this.cont_li.length;i++){
      this.slide_points[i].className = "";
    }
    this.slide_points[n].className = "current";
  }
};


var slide1 = new Slide("slide","slide_ul","slide_point","span");
slide1.init();

window.onresize = function(){
  slide1.resize();
};


//圆转动
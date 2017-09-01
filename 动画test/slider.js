/**
 * @author 张家泳
 * @qq 651493317
 * @require Zepto.js | jQuery.js
 * @version 0.3.0 修复2个bug:①单张图片不支持滑动效果；②网速慢时，js修改css布局时产生闪烁效果（注意ul）
 * @example new Slider({wrap: '#slider'}); ../../example/example-3.html
 */


(function($) {
	/**
	 * @description 配置组件，布局依据example-3.html
	 * @type {{wrap: undefined, speed: number, auto: boolean, interval: number}}
	 * @param {selector|$} wrap 组件的包裹层
	 * @param {Number} speed=1000 滑动速度
	 * @param {boolean} auto=true 自动播放
	 * @param {Number} interval=4000 播放间隔
	 */
	var defaultConfig = {
		wrap: undefined,
		speed: 300,
		auto: true,
		interval: 3000
	};

	/**
	 * @description 构造函数
	 * @param options
	 * @returns {Arguments.callee}
	 * @constructor
	 */
	function Slider(options) {
		var self = this;

		if(!(self instanceof arguments.callee)) {
			return new arguments.callee(options);
		}

		self.options = $.extend({}, defaultConfig, options || {});

		if(!(self.options.wrap instanceof $)) {
			self.options.wrap = $(self.options.wrap);
		}

		self.picWrap = self.options.wrap.find('.ui-slider-pic-wrap');
		self.picUl = self.picWrap.children('ul');
		self.btnLi = self.options.wrap.find('.ui-slider-btn-wrap li');

		self._init();
	}
	$.extend(Slider.prototype, {

		_init: function() {
			var self = this;

			self.width = self.options.wrap.width();
			self.length = self.picUl.children('li').length * 2;
			self.index = 0;
			self.dist = 0;
			self.pos = {
				start: 0,
				end: 0,
				old: 0,
				now: 0
			};
			self.timer = null;
			self.timer_delay = null;
			self.tap = {
				time_start: 0,
				time_end: 0,
				interval: 250
			};
			
			//只有一个li，不支持滑动效果
			if(self.length <= 2) {
				self.options.wrap.find('.ui-slider-btn-wrap').hide();
				return false;
			}

			self._initHTML();
			self._bind();

			if(self.options.auto) {
				//确保是停止时间
				self.options.interval += self.options.speed;
				self._initPos();
				self._start();
			}
		},

		/**
		 * @description 初始化HTML
		 * @private
		 */
		_initHTML: function() {
			var self = this;

			self.picUl.width(self.width * self.length);
			self.picUl.html(self.picUl.html() + self.picUl.html());
			self.picUl.children('li').width(self.width);
			self.index = self.length / 2;

		},

		/**
		 * @description 初始化变换位置，对于index
		 * @private
		 */
		_initPos: function() {
			var self = this;

			if(self.index <= 0) {
				self.index = self.length / 2;
			} else if(self.index >= (self.length - 1)) {
				self.index = self.length /2 - 1;
			}

			self.dist = -(self.index * self.width);
			self._move(self.dist);
		},

		/**
		 *
		 * @private
		 */
		_bind: function() {
			var self = this;

			//self对象必须实现`hangleEvent`接口
			self.options.wrap[0].addEventListener('touchstart', self, false);
			self.options.wrap[0].addEventListener('touchmove', self, false);
			self.options.wrap[0].addEventListener('touchend', self, false);

			//监听变换结束，兼容
			self.picUl[0].addEventListener('webkitTransitionEnd', self, false);
			self.picUl[0].addEventListener('msTransitionEnd', self, false);
			self.picUl[0].addEventListener('oTransitionEnd', self, false);
			self.picUl[0].addEventListener('otransitionend', self, false);
			self.picUl[0].addEventListener('transitionend', self, false);
		},

		/**
		 * @description 统一注释事件处理器 DOM2新增功能
		 * @param ev
		 */
		handleEvent: function(ev) {
			//事件处理函数 DOM2新增功能
			var self = this;

			ev.stopPropagation();
			
			switch (ev.type) {
				case 'touchstart': self._touchStart(ev); break;
				case 'touchmove': self._touchMove(ev); break;
				case 'touchend': self._touchEnd(ev); break;
				case 'webkitTransitionEnd':
				case 'msTransitionEnd':
				case 'oTransitionEnd':
				case 'otransitionend':
				case 'transitionend': self._transitionEnd(ev); break;
			}
		},
		_touchStart: function(ev) {
			var self = this;

			self.pos.start = self.pos.old = ev.changedTouches[0].pageX;
			self.tap.time_start = (new Date()).getTime();

			self._stop();
			self._initPos();
		},
		_touchMove: function(ev) {
			var self = this, dist;
			
			self.pos.now = ev.changedTouches[0].pageX;

			dist = self.pos.now - self.pos.old;
			self.dist += dist;
			self._move(self.dist);

			self.pos.old = self.pos.now;
			
			ev.preventDefault();
		},
		_touchEnd: function(ev) {
			var self = this, dist, abs_dist;

			self.pos.end = ev.changedTouches[0].pageX;
			dist = self.pos.end - self.pos.start;
			abs_dist = Math.abs(dist);

			if(abs_dist >= 40 || abs_dist >= (self.width/2)) {
				self.index = dist > 0 ? (self.index - 1) : (self.index + 1);
			}

			self._slide(self.index);

			if(self.options.auto) {
				self.timer_delay = setTimeout(function() {
					self._start();
				}, self.options.speed);
			}
			
			self.tap.time_end = (new Date()).getTime();
			if(self.tap.time_end - self.tap.time_start >= self.tap.interval) {
				ev.preventDefault();
			}
		},
		_transitionEnd: function(ev) {
			var self = this;
			
			self._initPos();
			self.btnLi.removeClass('ui-slider-btn-active')
				.eq(self.index % self.btnLi.length).addClass('ui-slider-btn-active');
		},

		/**
		 * @description X轴变换，兼容
		 * @param {Number} dist X轴变换位置
		 * @param {Number} speed 变换动画时间
		 * @private
		 */
		_translateX: function(dist, speed) {
			var self = this,
				style = self.picUl[0].style;

			//时间
			style.webkitTransitionDuration =
			style.MozTransitionDuration =
			style.msTransitionDuration =
			style.OTransitionDuration =
			style.transitionDuration = speed + 'ms';

			//距离
			style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
			style.msTransform =
			style.MozTransform =
			style.OTransform =
			style.transform = 'translateX(' + dist + 'px)';
		},

		/**
		 * @description 变换移动
		 * @param {Number} dist X轴变换位置
		 * @private
		 */
		_move: function(dist) {
			var self = this;

			self._translateX(dist, 0);
		},

		/**
		 * @description 滑动
		 * @param {Number} index 图片索引
		 * @private
		 */
		_slide: function(index) {
			var self = this;

			self.dist = -(index * self.width);
			self._translateX(self.dist, self.options.speed);
		},

		/**
		 * @description 自动播放
		 * @private
		 */
		_autoPlay: function() {
			var self = this;

			self.timer = setTimeout(function() {
				self.index++;
				self._slide(self.index);
				self._autoPlay();
			}, self.options.interval);
		},

		/**
		 * @description 自动播放 -> 停止
		 * @private
		 */
		_stop: function() {
			var self = this;

			if(self.timer) {
				clearTimeout(self.timer);
				self.timer = null;
			}

			if(self.timer_delay) {
				clearTimeout(self.timer_delay);
				self.timer_delay = null;
			}
		},

		/**
		 * @description 自动播放 -> 开始
		 * @private
		 */
		_start: function() {
			var self = this;

			self._autoPlay();
		}
	});

	window.Slider = Slider;

})(Zepto);
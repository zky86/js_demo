(function(){

var read = function(option, element){
	return (option) ? ($type(option) == 'function' ? option(element) : element.get(option)) : '';
};

this.Tips = new Class({

	Implements: [Events, Options],

	options: {
		/*
		onAttach: $empty(element),
		onDetach: $empty(element),
		*/
		onShow: function(obj, element){
				this.tip.setStyle('display', 'block');
		},
		onHide: function(){
			this.tip.setStyle('display', 'none');
		},
		title: 'title',
		text: function(element){
			return element.get('rel') || element.get('href');
		},
		showDelay: 100,
		hideDelay: 100,
		className: 'tip-wrap',
		offset: {x: 16, y: 16},
		fixed: false,
		width: 200,
		b_ajax		:		false,								// 是否AJAX拿数据， 需要MT支持，未开发
		ajax_url	:		false,
		ajax_pars	:		'',
		ongetdata	:		false
	},

	initialize: function(){
		var params = Array.link(arguments, {options: Object.type, elements: $defined});
		this.setOptions(params.options);
		document.id(this);
		
		if (params.elements) this.attach(params.elements);
	},

	toElement: function(){
		if (this.tip) return this.tip;
		
		this.container = new Element('div', {'class': 'tip'});
		return this.tip = new Element('div', {
			'class': this.options.className+' tips_all',
			styles: {
				position: 'absolute',
				top: 0,
				left: 0
			}
		}).adopt(
			new Element('div', {'class': 'tip-top'}),
			this.container,
			new Element('div', {'class': 'tip-bottom'})
		).injectTop(document.body);
	},

	attach: function(elements){
		$$(elements).each(function(element){
			if(this.options.b_ajax==false){
			var title = read(this.options.title, element),
				text = read(this.options.text, element);
			element.alt = '';
			
			element.erase('title').store('tip:native', title).retrieve('tip:title', title);
			//alert($$('.item_tips')[0].title)
			element.retrieve('tip:text', text);
			
			this.fireEvent('attach', [element]);
			
			}
			var events = ['enter', 'leave'];
			
			if (!this.options.fixed) events.push('move');
			
			events.each(function(value){
				
				var event = element.retrieve('tip:' + value);
				if (!event) event = this['element' + value.capitalize()].bindWithEvent(this, element);
				element.store('tip:' + value, event).addEvent('mouse' + value, event);
			}, this);
		}, this);
		
		return this;
	},

	detach: function(elements){
		$$(elements).each(function(element){
			['enter', 'leave', 'move'].each(function(value){
				element.removeEvent('mouse' + value, element.retrieve('tip:' + value)).eliminate('tip:' + value);
			});
			
			this.fireEvent('detach', [element]);
			
			if (this.options.title == 'title'){ // This is necessary to check if we can revert the title
				var original = element.retrieve('tip:native');
				if (original) element.set('title', original);
			}
		}, this);
		
		return this;
	},

	elementEnter: function(event, element){
		
		this.container.empty();
		if(this.options.b_ajax==false){
			['title', 'text'].each(function(value){
				var content = element.retrieve('tip:' + value);
				if (content) this.fill(new Element('div', {'class': 'tip-' + value}).inject(this.container), content);
			}, this);
		}
		else
		{
			if(element.title_tips==undefined){
				element.title_tips=element.title;
				element.title='';
			}	
		}

		$clear(this.timer);
		
		this.position((this.options.fixed) ? {page: element.getPosition()} : event);
		
		this.timer = this.show.delay(this.options.showDelay, this, element);
		
		
	},

	elementLeave: function(event, element){
		$clear(this.timer);
		this.timer = this.hide.delay(this.options.hideDelay, this, element);
		//this.fireForParent(event, element);
	},

	fireForParent: function(event, element){
		if (!element) return;
		parentNode = element.getParent();
		if (parentNode == document.body) return;
		if (parentNode.retrieve('tip:enter')) parentNode.fireEvent('mouseenter', event);
		else this.fireForParent(parentNode, event);
	},

	elementMove: function(event, element){
		this.position(event);
	},

	position: function(event){
		var size = window.getSize(), scroll = window.getScroll(),
			tip = {x: (this.tip.offsetWidth==0)?this.options.width:this.tip.offsetWidth, y: this.tip.offsetHeight},
			props = {x: 'left', y: 'top'},
			obj = {};
		
		for (var z in props){
			obj[props[z]] = event.page[z] + this.options.offset[z];
			if ((obj[props[z]] + tip[z] - scroll[z]) > size[z]) obj[props[z]] = event.page[z] - this.options.offset[z] - tip[z];
		}
		
		this.tip.setStyles(obj);
	},

	fill: function(element, contents){
		if(typeof contents == 'string') element.set('html', contents);
		else element.adopt(contents);
		
	},

	show: function(element){
		var _this = this;
		if(this.options.b_ajax==true)
		{	
			if(element.title_tips==undefined){
				element.title_tips=element.title;
				element.title='';
			}
			var pars=''
			element.tips_classname=this.options.className;
			if(element.ajax_tips==undefined){
				if(this.options.ongetdata)
				{
					pars=this.options.ajax_pars+this.options.ongetdata(element)
				}
				var url=this.options.ajax_url;
				new Request(
				{
					'url':url,
					'data' : pars,
					'method' : 'get',
					'evalScripts' : false,
					'onComplete' : function(res)
					{
						if(res=='')
						{
							element.ajax_tips=element.title_tips;
						}
						else
						{
							element.ajax_tips=res;
						}
						$$('.'+element.tips_classname+' .tip')[0].innerHTML=element.ajax_tips;
						
						_this.fireEvent('show', [this.tip, element]);
					}
				}).send();	
			}
			else
			{
				$$('.'+this.options.className+' .tip')[0].innerHTML=element.ajax_tips;
				this.fireEvent('show', [this.tip, element]);
			}
		}
		else
		{
			this.fireEvent('show', [this.tip, element]);
		}
	},

	hide: function(element){
		this.fireEvent('hide', [this.tip, element]);
		
	}

});

})();
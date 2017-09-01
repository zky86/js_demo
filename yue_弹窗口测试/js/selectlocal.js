/**
* SelectLocal.js
* author 张家泳 
* qq 651493317
*/


/*
* firstSelect [选择器|jq对象]第一级select控件
* secondSelect [选择器|jq对象]第二级select控件
* thirdSelect [选择器|jq对象]第三级select控件
*/
function SelectLocal(firstSelect, secondSelect, thirdSelect) {	
	var self = this;
	
	self.firstSelect = firstSelect;
	self.secondSelect = secondSelect;
	self.thirdSelect = thirdSelect;
	self.secondTips = '';
	self.thirdTips = '';
	
	if(!(self.firstSelect instanceof $)) {
		self.firstSelect = $(self.firstSelect);
	}
	if(!(self.secondSelect instanceof $)) {
		self.secondSelect = $(self.secondSelect);
	}
	if(self.thirdSelect) {
		if(!(self.thirdSelect instanceof $)) {
			self.thirdSelect = $(self.thirdSelect);
		}
		self.thirdTips = self.thirdSelect.html();
	}
	
	self.secondTips = self.secondSelect.html();
	
	self.init();
}
$.extend(SelectLocal.prototype, {
	init: function() {
		var self = this;
		
		self._bind();
	},
	
	_bind: function() {
		var self = this;
		
		//选择第一级
		self.firstSelect.change(function() {
			self._showNextLevel(self.firstSelect, self.secondSelect, self.secondTips);
			
			if(self.thirdSelect) {
				self.thirdSelect.html(self.thirdTips);
			}
		});
		
		//选择第二级
		if(self.thirdSelect) {
			self.secondSelect.change(function() {
				self._showNextLevel(self.secondSelect, self.thirdSelect, self.thirdTips);
			});
		}
	},
	
	_showNextLevel: function(supLocal, subLocal, tips) {
		var self = this,
			data = $(supLocal[0].options[supLocal[0].selectedIndex]).attr('data-types'),
			sup, supItem, sub, subItem,//提取数据
			i, iLen, j, jLen,//两个循环变量
			html = tips;
		
		if(typeof data !== 'string') {
			return;
		}
		
		sup = data.split(',');
		if(sup[0] === '') {
			sup.shift();
		}
		
		if(sup.length > 1) {
			for(i = 0, iLen = sup.length; i < iLen; i++) {
				supItem = sup[i].split('|');
				
				sub = '';
				if(supItem.length > 2) {
					subItem = supItem[2].split('-');
					if(subItem[0] === '') {
						subItem.shift();
					}
					
					for(j = 0, jLen = subItem.length; j < jLen; j++) {
						sub += ',' + subItem[j] + '|' + subItem[++j];
					}
				}
				
				html += '<option value="' + supItem[0] + '" data-types="' + sub + '">' + supItem[1] + '</option>';
			}
		} else {
			html = '<option value="">-无-</option>';
		}
		
		subLocal.html(html);
	}
});

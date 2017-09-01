/*依赖jquery-1.10.1.min*/

/**
 *  模拟alert
 */


(function($) {
	
	var default_html = '<div id="commonConfirmBox" style="display: none;"><div class="fade"></div><div class="pop-cancel font_wryh"><a href="javascript:;" class="close common-bg dialog-close"></a><div class="text tc dialog-tips"></div><div class="clearfix btn"><a href="javascript:;" class="sure-btn dialog-sure">确定</a><a href="javascript:;" class="cancel-btn dialog-cancel">取消</a></div></div></div>';

    function Dialog(html) {
        var self = this;

		typeof(html) === 'undefined' && (html = default_html);

        self.init(html);
    }

    $.extend(Dialog.prototype, {
        init: function(html) {
            var self = this;

            self.wrap = $(html).appendTo('body');
            self.$sure = self.wrap.find('.dialog-sure');
            self.$cancel = self.wrap.find('.dialog-cancel');
            self.$close = self.wrap.find('.dialog-close');
            self.$tips = self.wrap.find('.dialog-tips');

            self._bind();
        },

        _bind: function() {
            var self = this;

            self.$sure.click(function() { self.hide();});
            self.$cancel.click(function() { self.hide();});
            self.$close.click(function() { self.hide();});
        },

        on: function(type, listener) {
            var self = this;

            switch(type) {
                case 'sure':
                    self.$sure.click(listener);
                    break;
                case 'cancel':
                    self.$cancel.click(listener);
                    break;
                case 'close':
                    self.$close.click(listener);
                    break;
            }
        },

        show: function(tips) {
            var self = this;

            self.wrap.show();
            self.$tips.html(tips);
        },

        hide: function() {
            var self = this;

            self.wrap.hide();
        }

    });

    window.Dialog = Dialog;
})(jQuery);



 function commonAlert(conn){
	if($.trim(conn)==""){
		return false;
	}
	var is_exist = $('#commonAlertBox').length;
	if(is_exist>0){
		$('#commonAlertBox').show();
	}else{
		var boxHtml = '<div id="commonAlertBox"><div class="fade"></div><div class="pop-choice font_wryh"><a href="javascript:;" class="close common-bg"></a><div class="text tc">'+conn+'</div><a href="javascript:;" class="sure-btn">确定</a></div></div>';
		$("body").append(boxHtml);
	}
	
}

$(document)
.on('click', '#commonAlertBox .sure-btn', function(){
	$('#commonAlertBox').hide();
})
.on('click', '#commonAlertBox .close', function(){
	$('#commonAlertBox').hide();
});


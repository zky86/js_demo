/**
 * 数字表单按钮
 * hdw 2014.8.26
 */
define(function(require, exports, module)
{
    var $ = require('$');
    var page_control = require('../../frame/page_control');
    var View = require('../../common/view');

    var utility = require('../../common/utility');
    var item_tpl = require('./tpl/test.handlebars');


    module.exports = View.extend
    ({
        attrs :
        {
            template : item_tpl,
            op : 90
        },
        events :
        {
            'tap [data-role=add]' : function()
            {
                var self = this;

                console.log(456);
            }
        },
         _parseElement : function()
        {
            var self = this;

            var template_model = self.get('affff');

            self.set('templateModel', template_model);

            View.prototype._parseElement.apply(self);
        },
        
       
        setup : function()
        {
            var self = this;
           


        },
        show : function()
        {
            var self = this;
            self.$el.find(".cur[data-role=add]").html('成功运行')
            
        }

    });
});

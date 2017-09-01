/**
 * 提现
 * 汤圆 2014.9.12
 */
define(function(require, exports, module)
{
    var $ = require('$');
    var page_control = require('../../../frame/page_control');
    var View = require('../../../common/view');
    var withdrawal = require('../withdrawal/tpl/main.handlebars');
    var utility = require('../../../common/utility');
    var templateHelpers = require('../../../common/template-helpers');
    var Scroll = require('../../../common/scroll');
    var utility = require('../../../common/utility');
    var global_config = require('../../../common/global_config');
    var number_btn_view = require('../../../widget/number_btn/view');

    var time_url = true ;

    var withdrawal_view = View.extend
    ({

        attrs:
        {
            template: withdrawal
        },
        events :
        {
            'swiperight' : function (){
                page_control.back();
            },
            
            'tap [data-role=page-back]' : function (ev)
            {
                page_control.back();
            },
            'tap [data-role=btn-get]' : function (ev)
            {

                //点击获取验证码
                var $current_target = $(ev.currentTarget);
                var wait=11;  
                if( time_url = true ){
                    utility.ajax_request
                    ({
                        url: global_config.ajax_url.withdraw,
                        type : 'POST',
                        data : 'type=sms',
                        cache: false,
                        beforeSend: function (xhr, options)
                        {
                            //self.trigger('before:login:fetch', xhr, options);
                        },
                        success: function (data)
                        {

                        },
                        error: function ( xhr, options)
                        {
                            //self.trigger('error:login:fetch',  xhr, options);
                        },
                        complete: function (xhr, status)
                        {
                            //self.trigger('complete:login:fetch', xhr, status);
                        }
                    });
                }

                if ($current_target.hasClass('swt') ){

                    $current_target.removeClass('swt')

                    time_url = false ;

                    function time() {  
                        if (wait == 0) {  
                            time_url = true
                            $current_target.addClass('swt');
                            $current_target.html('重新获取')
                        } else {  
                            wait--;  
                            setTimeout(function() { time() },  1000)  ;
                            $current_target.html(wait)
                        }  
                    } 
                    time(); //60秒倒计时
                }
            },
            'tap [data-role=btn-tx]' : function (ev){

                var self = this ;

                //数据收集
                var get_sms_code = utility.int(self.$btn_sms_code.val()); //验证码
                var get_alipay = self.$btn_alipay.val(); //支付宝
                var get_number_menber = self.$number_menber.find('.input-text').val(); //提现金额

                if( get_alipay == '')
                {
                    alert('请输入支付宝账号！');
                    return ;
                };

                if( get_sms_code == '')
                {
                    alert('请输入手机验证码！');
                    return ;
                };

                utility.ajax_request
                ({
                    url: global_config.ajax_url.withdraw,
                    type : 'POST',
                    data :
                    {
                        type : 'money',
                        amount : get_number_menber,
                        third_account : get_alipay,
                        sms_code : get_sms_code
                    },
                    cache: false,
                    beforeSend: function (xhr, options)
                    {
                        //self.trigger('before:login:fetch', xhr, options);
                    },
                    success: function (data)
                    {
                    },
                    error: function ( xhr, options)
                    {
                        //self.trigger('error:login:fetch',  xhr, options);
                    },
                    complete: function (xhr, status)
                    {
                        //self.trigger('complete:login:fetch', xhr, status);
                    }
                });
            }
        },


        /**
         * 安装事件
         * @private
         */
        _setup_events : function()
        {

            var self = this;
            self.collection
            .on('reset',self._reset,self)
            .on('add', self._add_one, self)
            .on('success:fetch',function(response,xhr)
            {
                self._render_city(response,xhr);
            })
            .on('complete:fetch',function(xhr,status)
            {

            });
            
            self.on('update_list',function(response,xhr)
            {

                // 区分当前对象
                var _self = this;

                self._setup_scroll();
                self.view_scroll_obj.refresh();

                // 重置渲染队列
                self._render_queue = [];
            })
            .once('render',self._render_after,self);

            self._setup_scroll();
            self.view_scroll_obj.refresh();
        },

        /**
         * 安装滚动条
         * @private
         */
        _setup_scroll : function()
        {
            var self = this;
            var view_scroll_obj = Scroll(self.$container,
            {

            });
            self.view_scroll_obj = view_scroll_obj;
        },
        /**
         * 安装底部导航
         * @private
         */

        _reset : function()
        {
            var self = this;
            self.collection.length && self.collection.each(self._add_one,self);
        },
        _add_one : function(model)
        {
            var self = this;
            self._render_queue.push(model.toJSON());
            return self;
        },
        
        /**
         * 渲染城市
         * @param response
         * @param options
         * @private
         */
         _render_city : function(response,xhr)
        {
            var self = this;
        },

        _render_after :function()
        {
            var self = this ;
            self.collection.get_list();
        },


        _setup_number_btn : function()
        {
            var self = this;

            self['member'] = new number_btn_view
            ({
                templateModel :
                {
                    type : 'tel'
                },
                min_value : 0,
                step : 50,
                parentNode: self.$number_menber,
                value : 1
            }).render();

        },

        /**
         * 视图初始化入口
         */
        setup : function()
        {

            var self = this;

            // 渲染队列
            self._render_queue = [];

            // 配置交互对象
            self.$container = self.$('[data-role=container]'); // 滚动容器

            self.$btn_sms_code = self.$('[data-role=btn-sms-code]'); // 验证码
            self.$btn_alipay = self.$('[data-role=btn-alipay]'); // 支付宝账号
            self.$number_menber = self.$('[data-role=btn_view]'); // 金额模块


            // 安装事件
            self._setup_events();

            self._setup_number_btn();

        },
        render : function()
        {
            var self = this;

            // 调用渲染函数
            View.prototype.render.apply(self);

            self.trigger('render');

            return self;
        }

    });

    module.exports = withdrawal_view;
});
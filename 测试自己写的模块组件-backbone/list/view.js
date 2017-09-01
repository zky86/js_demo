/**
 * Created by nolest on 2014/8/30.
 * 活动列表
 */

define(function(require, exports, module)
{
    var $ = require('$');
    var page_control = require('../../frame/page_control');
    var View = require('../../common/view');
    var tpl = require('./tpl/main.handlebars');
    var utility = require('../../common/utility');
    var Scroll = require('../../common/scroll');
    var select_drop = require('../../ui/select_drop/view');
    var footer = require('../../widget/footer/index');
    var act_list_view = require('../../widget/act_list/view');
    var pull_down = require('../../widget/pull_down/view');
    var m_alert = require('../../ui/m_alert/view');

    var test = require('../../widget/test/view');


    var model_card_view = View.extend
    ({

        attrs:
        {
            template: tpl
        },
        events :
        {
            'swiperight' : function (){
                page_control.back();
            },
            'tap [data-tap]' : function (ev)
            {
                var self = this;

                var type = $(ev.currentTarget).find('[data-role]').attr('data-role');

                self.current_type = type;

                self.$('[data-role="arrow"]').removeClass("icon-act-list-arrow-red").addClass("icon-act-list-arrow");

                $(ev.currentTarget).find('[data-role="arrow"]').addClass("icon-act-list-arrow-red");

                self.$('[data-text]').removeClass("cur");

                $(ev.currentTarget).find('[data-role]').addClass("cur");

                self._show_condition_con();

                self.$('[data-role="'+ type+'-con"]').removeClass("fn-hide");

            },
            'tap [data-role="fade"]' : function()
            {
                var self = this;

                self.$('[data-tap]').removeClass("cur");

                self._hide_condition_con();

            },
            'tap [data-carry]' : function(ev)
            {
                var self = this;

                var $btn = $(ev.currentTarget);

                $btn.addClass("cur").siblings().removeClass("cur");

                var query = $btn.attr('data-carry');

                var query_html = $btn.text();

                switch (self.current_type)
                {
                    case 'time' :
                        self.mix_options =
                        {
                            page : 1,
                            time_querys : query
                            //price_querys : "",
                            //start_querys : ""
                        };
                        if(query == '')
                        {
                            query_html = '时间'
                        }
                        self.$('[data-role="time"]').html(query_html);
                        break;
                    case 'price' :
                        self.mix_options =
                        {
                            page : 1,
                            //time_querys : "",
                            price_querys : query
                            //start_querys : ""
                        };
                        if(query == '')
                        {
                            query_html = '价格'
                        }
                        self.$('[data-role="price"]').html(query_html);
                        break;
                    case 'start' :
                        self.mix_options =
                        {
                            page : 1,
                            //time_querys : "",
                            //price_querys : "",
                            start_querys : query
                        };
                        if(query == '')
                        {
                            query_html = '发起者'
                        }
                        self.$('[data-role="start"]').html(query_html);
                        break;
                }

                self.$('[data-role="arrow"]').removeClass("icon-act-list-arrow-red").addClass("icon-act-list-arrow");

                self.clearContainer = true;

                self.select_options = $.extend(true,{},self.select_options,self.mix_options);

                self.collection.set_select_options(self.select_options);

                self._hide_condition_con();

                self.collection.get_list();

            },
            'tap [data-role="select-more"]' : function()
            {
                var self = this;
                if(!utility.auth.is_login())
                {
                    page_control.navigate_to_page('account/login');

                    return
                }

                page_control.navigate_to_page("act/pub_info",utility.user);

                return;

                if(self.select_drop_obj.is_drop())
                {
                    self.select_drop_obj.pull_up();
                }
                else
                {
                    self.select_drop_obj.drop_down();
                }
            },
            'tap [data-role="event-item"]' : function(ev)
            {
                var $cur_btn = $(ev.currentTarget);

                if(!utility.auth.is_login())
                {
                    page_control.navigate_to_page('account/login');

                    return
                }

                var event_id = utility.int($cur_btn.attr('data-event-id'));

                page_control.navigate_to_page('act/detail/'+event_id);
            },
            'touch [data-role="content-body"]' : function()
            {
                var self = this;

                if(!self.select_drop_obj.is_drop())
                {
                    return;
                }

                self.select_drop_obj.pull_up();
            }
        },
        _show_condition_con : function()
        {
            var self = this;

            self.$condition.removeClass("fn-hide");

            self.$('[data-con]').addClass("fn-hide");

        },
        _hide_condition_con : function()
        {
            var self = this;

            self.$condition.addClass("fn-hide");

            self.$('[data-con]').addClass("fn-hide");

        },
        _setup_pull_down : function()
        {
            var self = this;

            self.pull_down_obj = new pull_down
            ({
                // 元素插入位置
                parentNode: self.$pull_down_container
            }).render();
        },
        _setup_select_drop : function()
        {
            var self = this;

            self.select_drop_obj = new select_drop
            ({
                parentNode: self.$el

            }).render();

        },
        _setup_events : function()
        {
            var self = this;

            self.collection
                .on('reset',self._reset,self)
                .on('add', self._add_one, self)
                .on('before:fetch',function(xhr)
                {
                    if(xhr.reset)
                    {
                        m_alert.show('加载中...','loading');
                    }
                })
                .on('success:fetch',function(response,xhr)
                {
                    m_alert.hide();

                    self._render_act_list(response,xhr)
                }).on('complete:fetch',function(xhr,status)
                {
                    self.fetching = false;
                });

            self.on('update_list',function(response,xhr)
            {
                if(!self.view_scroll_obj)
                {
                    self._setup_scroll();

                    return;
                }

                if(xhr.reset)
                {
                    self.view_scroll_obj.scrollTo(0,0);

                    self.view_scroll_obj.resetLazyLoad();
                }

                self.view_scroll_obj.refresh();

            });

        },
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
        _render_act_list: function(response,xhr)
        {
            var self = this;

            var render_queue = self._render_queue;

            var document_frag = document.createDocumentFragment();

            $.each(render_queue,function(i,obj)
            {
                var pre_view = new act_list_view
                ({
                    model : obj,
                    templateModel : obj
                }).render();

                document_frag.appendChild(pre_view.list()[0]);

            });

            // 判断调用重新加载还是插入方法
            var method = xhr.reset ? 'html' : 'append';

            self.$list_container[method](document_frag);

            self.trigger('update_list',response,xhr);

            // 清空队列
            self._render_queue = [];

        },
        _setup_scroll : function()
        {
            var self = this;

            self._top_offset = 90;

            var view_scroll_obj = Scroll(self.$container,
                {
                    topOffset : self._top_offset,
                    lazyLoad : true
                });

            // 下拉刷新标记
            self.pull_refresh = false;

            view_scroll_obj.on('refresh',function()
            {
                console.log("scrollrefresh")
                // 区分当前对象，_self为滚动条对象
                var _self = this;

                if(self.pull_refresh)
                {
                    self.pull_refresh = false;

                    console.log("下拉刷新");

                    self.pull_down_obj.set_pull_down_style('loaded');

                }

            });


            view_scroll_obj.on('scrollMoveAfter',function()
            {
                var _self = this;

                var scroll_y = _self.y;

                if(_self.maxScrollY - _self.y > 160 && self.collection.has_next_page && !self.fetching)
                {

                    self.clearContainer = false;

                    self.fetching = true; //防止反复提交请求

                    self.collection.set_select_options
                    ({
                        page : ++self.collection.get_select_options().page
                    });

                    self.collection.get_list();
                }

                if(scroll_y > 0 && !self.pull_refresh)
                {
                    _self.minScrollY = -45;

                    self.pull_refresh = true;

                    self.pull_down_obj.set_pull_down_style('release');
                }
            });

            view_scroll_obj.on('scrollEndAfter',function()
            {
                var _self = this;

                var scroll_y = _self.y;

                if(self.pull_refresh)
                {
                    self.pull_down_obj.set_pull_down_style('loading');

                    self.collection.get_list();
                }


            });


            self.view_scroll_obj = view_scroll_obj;
        },
        _setup_footer : function()
        {
            var self = this;

            var footer_obj = new footer
            ({
                // 元素插入位置
                parentNode: self.$el,
                // 模板参数对象
                templateModel :
                {
                    // 高亮设置参数
                    is_out_pai : true
                }
            }).render();
        },
        reset_viewport_height : function()
        {
            return utility.get_view_port_height('nav');
        },
        setup : function()
        {
            var self = this;

            


            self.$test = self.$('[data-role="test"]'); // 滚动容器

            // 配置交互对象
            self.$container = self.$('[data-role="action-list-content"]'); // 滚动容器

            self.$list_container = self.$('[data-role="action-child-con"]'); //列表容器

            self.$condition = self.$('[data-role="condition-con"]');//选项层

            self.$pull_down_container = self.$('[data-role=pull_down_container]');

            var style_list = 
            [
                {text:'￥ 100',params:'100'},
                {text:'￥ 300',params:'300'},
                {text:'￥ 500',params:'500'}
            ];

            self.test = new test({
                affff :
                {                    
                   type22 : style_list

                },
                parentNode: self.$test,
                name : 123,
                op : 32 
                
            }).render();

            self.test.show();

            // 安装事件
            self._setup_events();

            self._setup_select_drop();

            self._setup_footer();

            self._setup_pull_down();

            self.fetching = false;

            self.clearContainer = false;

            self.select_options =
            {
                page : 1,
                time_querys : "",
                price_querys : "",
                start_querys : ""
            };

            self._render_queue = [];

            self.collection.get_list();

        },
        render : function()
        {
            var self = this;

            var view_port_height = self.reset_viewport_height()-6;

            self.$container.height(view_port_height);

            View.prototype.render.apply(self);

            self.trigger('render');

            return self;
        }

    });

    module.exports = model_card_view;
});
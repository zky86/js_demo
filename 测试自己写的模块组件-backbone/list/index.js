/**
 * Created by nolest on 2014/8/30.
 */
/**
 * 首页 - 活动列表
 */
define(function(require, exports, module)
{
    var $ = require('$');
    var page_control = require('../../frame/page_control');
    var this_view = require('./view');
    var this_model = require('../model');
    var this_collection = require('../collection');

    page_control.add_page([function()
    {
        return{
            title : '活动列表',
            route :
            {
                'act/list' : 'act/list'
            },
            transition_type : 'none',
            initialize : function()
            {
                var self = this;

                //默认选项
                self.default_options =
                {
                    page : 1,
                    time_querys : "",
                    price_querys : "",
                    start_querys : ""
                };

                var model = new this_model
                ({

                });

                var collection = new this_collection
                ({
                    model : model,
                    default_options : self.default_options
                });


                self.view = new this_view
                ({
                    collection : collection,
                    parentNode : self.$el

                }).render();

            },
            page_init : function(page_view,route_params_arr,route_params_obj)
            {
                console.log(route_params_arr)
            },
            page_before_show : function()
            {

            },
            page_show : function()
            {

            },
            page_before_hide : function()
            {

            },
            page_hide : function()
            {
                var self = this;
                //换页前清理下拉菜单
                self.view.select_drop_obj.stay();
            }
        }
    }]);

})


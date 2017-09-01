var Util = require.syncLoad(__moduleId('/modules/global/util/index'));
exports.init = function(options)
{
    options = options || {};
    if (!options.template)
    {
        console.error('缺少 options.template');
        return;
    }
    if (!options.data || typeof options.data != 'function')
    {
        console.error('缺少 options.data 或 类型不为function');
        return;
    }


    var parent_tpl =
    [
        '<div class="moji-list-wrapper">',
                options.template,
        '        ',
        '</div>'
    ].join("");


    var list_options = {
        template: parent_tpl,
        data()
        {
            var obj = options.data();
            // console.log(options.template);
            // console.log(obj);
            return obj;
        },
        methods:
        {
            action()
                {
                    var self = this;
                    // console.log('触发');
                },
                father_test()
                {
                    this.$data.ajax_params.page = 11;
                }
        },
        events:
        {
            /**
             * 子组件的刷新事件
             * @param  {[type]} params [description]
             * @return {[type]}        [description]
             */
        },
        mounted()
        {
            var self = this;
            self.action();
            // 回调
            self.$emit('success', 1);
        }
    };

    // console.log('拷贝方法1');
    console.log(list_options.methods);
    // 拷贝方法
    list_options.methods = Util.extend(list_options.methods, options.methods);
    // console.log('拷贝方法2');
    console.log(options.methods);
    // console.log('拷贝方法3');
    console.log(list_options.methods);


    var list_vue = Vue.extend(list_options);
    return list_vue;
}
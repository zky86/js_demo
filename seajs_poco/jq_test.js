/**
 * @authors 汤圆
 * @date    2015-01-26 11:47:38
 * @version $Id$
 */

 define(function(require, exports, module) 
 {

     var $ = require('jquery');  //引入config配置的框架

     var  require_test = require('./require_test'); //引入本地相对路径的框架


     // 初始化
     exports.init = function(options) 
     {
         var b = 556 ;
         $('body').click(function() {
                 console.log(1);
         });
     };

     exports.num = 778 ;
     
     // var init = {
     //    name : 'zky'
     // }

     // module.exports = init;
     
 });
 
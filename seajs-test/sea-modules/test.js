// 所有模块都通过 define 来定义
define(function(require, exports, module) {

  // 通过 require 引入依赖
  var $ = require('jquery');
  
  var abc = function(){
    this.name = 'kugou';
    var k = 5;
    alert(k);
  }

  // function(){
  //   this.name = 'zky';
  //   var k = 5;
  //   alert(k)
  // }
  module.exports = abc;

});
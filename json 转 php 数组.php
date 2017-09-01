<?php
/**
 * json 转 php 数组
 * 注意
 * json里面统一双引号
 * key 键值 必须加双引号如 "page"，
 * 如果里面又有双引号的， 要加斜杠例如 \"
*/
function ob2ar($obj) {
  if (is_object ( $obj )) {
    $obj = ( array ) $obj;
    $obj = ob2ar ( $obj );
  } elseif (is_array ( $obj )) {
    foreach ( $obj as $key => $value ) {
      $obj [$key] = ob2ar ( $value );
    }
  }
  return $obj;
}

// 例子1
$str = '{
           "page" : 1,
           "next" : 2,
           "title" : "你预想的拍摄时间？",
           "content" : 
           {
               "type" : "time",
               "data" : 
               [
                   {"text": "选择一个时间"}
                  
               ]
           },
           "btn" : "下一步"
        }';
// $str = '{
//             "page" : 8,
//             "next" : -1,
//             "title" : "<div><i class=\"icon icon-success-max\"></i></div><p class=\"p1\">发布成功</p><p class=\"p2\">稍后我们会通过消息给你推送模特，<br>请你留意系统消息。</p>",
//             "content" : 
//             {
//                 "type" : false,
//                 "data" : 
//                 [
                    
//                 ]
//             },
//             "jump_page" : true,
//             "jump_info" :
//             {
//                 "url" : "",
//                 "type" : ""
//             },
//             "btn" : "确定"
//         }';
var_export ( ob2ar ( json_decode ( $str ) ) );

?>

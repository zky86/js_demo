<?php
/**
 * json ת php ����
 * ע��
 * json����ͳһ˫����
 * key ��ֵ �����˫������ "page"��
 * �����������˫���ŵģ� Ҫ��б������ \"
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

// ����1
$str = '{
           "page" : 1,
           "next" : 2,
           "title" : "��Ԥ�������ʱ�䣿",
           "content" : 
           {
               "type" : "time",
               "data" : 
               [
                   {"text": "ѡ��һ��ʱ��"}
                  
               ]
           },
           "btn" : "��һ��"
        }';
// $str = '{
//             "page" : 8,
//             "next" : -1,
//             "title" : "<div><i class=\"icon icon-success-max\"></i></div><p class=\"p1\">�����ɹ�</p><p class=\"p2\">�Ժ����ǻ�ͨ����Ϣ��������ģ�أ�<br>��������ϵͳ��Ϣ��</p>",
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
//             "btn" : "ȷ��"
//         }';
var_export ( ob2ar ( json_decode ( $str ) ) );

?>

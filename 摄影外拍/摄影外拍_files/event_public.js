//ͨ�������ύ������ɸѡ������
function search_fun(id,value)
{
	document.getElementById(id).value = value; 
	document.getElementById('form1').submit();
	return false;
}
//ȡ�༭������
function get_editor_content(id)
{
	var editor_frame = document.getElementById(id).contentWindow;
	return editor_frame.EDiaryEditor.get_content_html();
}

//���ز�
function hide_share_div(obj)
{
	document.getElementById(obj).style.display="none";
}
//չʾ��
function show_share_div(obj)
{
	document.getElementById(obj).style.display="";
	document.getElementById(obj).focus(); 
} 

//����������ʾ
function alert_error(id,msg)
{
	$(id+'_error').innerHTML=msg;
	if(msg!=''){
		$(id+'_error').className="alert_error2";
		if(id=="upload_cover_image")
		{
			var have_flash_hidden = $('have_flash_hidden').value;
			if(have_flash_hidden=="1")
			{
				mypoco_scroll_move('upload_cover_image',80);
				$('upload_cover_image').focus();
			}else{
				mypoco_scroll_move('cover_image_img',80);
				$('cover_image_img').focus();
			}
			
		}else if(id=="event_review" || id=="content_editor"){
			mypoco_scroll_move(id+"_menu",80);
		}else if(id=="join_level")
		{
			mypoco_scroll_move(id+"_error",80);
		}
		else{
			mypoco_scroll_move(id,80);
			$(id).focus();
		}
	}else{
		$(id+'_error').className="alert_error";
	}
		
}

function check_login()
{
	var login_id = readCookie('member_id');
    if(login_id>0)
    {
    	return true;
    }else{
		loginApp.set({
			b_reload:true
		});
		loginApp.loginBox();
		return false;
    }
	
}

//�������
function clear_text(id,text)
{
	if($(id).value==text)
	{
		$(id).value='';
	}
}


//ȡ���༭
function cancel_edit(obj){

	if(confirm('�Ƿ�����༭���ݣ�')){
		if(obj.href=="javascript:void(0)"){
			var event_id = $('event_id').value;
			if(event_id!="")
			{
				obj.href = "event_detail.php?event_id="+event_id;
			}else{
				var category = $('category').value;
				obj.href = "event_list.php?category="+category;
			}
			
		}
		return true;
	}
	else{
		
		return false;		
	}
}
//����ͼƬ��Ⱥ͸߶�
function debug_img(img,size)
{

	if(img.width>=size) 
	{ 
		img.width=size;
	}else{
		if(img.height>=size) 
		img.height=size;
	} 

}

//�ر���ĩ��ʾ��
function close_weekend_tips()
{
	$('weekend_tips').style.display='none';
	var pars = "type=" +"event_close_weekend_tips"+"&timestamp=" + new Date().getTime();
	new Request(
	{
	'url':'module/set_tip_cookie.php',
	'data':	pars,
	'method' : 'get',
	'onComplete' : function(res) {
		
	}

	}).send();
	
}

//�رջع���ʾ��
function close_review_tips()
{
	$('review_tips').style.display='none';
}

//���ض�������
function top_scroll(o)
{
 	var space=$(o).offsetTop;
 	$(o).style.top=space+'px';
 	void function(){
 		var goTo = 0;
 		var roll=setInterval(function(){
 			var height =document.documentElement.scrollTop+document.body.scrollTop+space;
 			var top = parseInt($(o).style.top);
 			if(height!= top){
 				goTo = height-parseInt((height - top)*0.6);
 				$(o).style.top=goTo+'px';
 			}
 			var st = document.getScroll().y
	 		if(st>500){
	 			$(o).style.display="";
	 		}else{
	 			$(o).style.display="none";
	 		}
 		},50);
 		
 	}()
}

function backToTop()
{
	var scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
	if(scrollTop){

		var display = 'block';
		if(Sys.ie6)$("backTop").style.top = (scrollTop + document.documentElement.clientHeight - 250) + "px";

	}
	else{

		var display= 'none';

	}
	$("backTop").style.display = display;
}


//-----------------------�������֯�����ݲ� ��ʼ--------------------------------------//
function alert_event_level(user_id,container_id)
{
	$(container_id).innerHTML='<p align="center"><img src="./images/loading.gif" width="60"/></p>';
	$(container_id).style.display="";
	var pars = "user_id=" +user_id+"&container_id=" +container_id+"&timestamp=" + new Date().getTime();
	new Request(
	{
	'url':' ./module/get_event_user_data.js.php',
	'data' : pars,
	'method' : 'get',
	'onComplete' : function(res) {
		if(res=="N")
		{
			msg = "����ʧ��";
			$(container_id).innerHTML = '<p class="famyh f18 mb15" align="center">'+msg+'</p>';
		}else{
			
			$(container_id).innerHTML = res;
			
		}
	}
	}).send();
	
}
function close_alert_event_level_div(container_id)
{
	$(container_id).style.display="none";
}
//-----------------------�������֯�����ݲ� ����--------------------------------------//

//-----------------------�л�����-------------------------------//
function change_city()
{
	var div='<div style="text-align:center;"><a href="javascript:void(0);" title="�ر�" class="fr alert_msg_box_close" onclick="close_msg_box();return false;">�ر�</a><div id="enroll_msg_box">';      	
		div+='<div class="sf_title f14 mb15 fb"><span class="fl">���ų��У�</span><ul class="fl"><li id="101029001_li"><a href="index.php?location_id=101029001" onclick="return clickon_city(\'101029001\')">����</a></li><li id="101001001_li"><a href="index.php?location_id=101001001" onclick="return clickon_city(\'101001001\')">����</a></li><li id="101003001_li"><a href="index.php?location_id=101003001" onclick="return clickon_city(\'101003001\')">�Ϻ�</a></li><li id="101022001_li"><a href="index.php?location_id=101022001" onclick="return clickon_city(\'101022001\')">�ɶ�</a></li></ul></div>';  	
		div+='<table width="259" style="color:#555;"><tbody><tr><td colspan="3" class="f14" align="left">��ʡ�ݳ��У�</td><tr>';
		div+='<td width="93"><select name="location_id1" id="location_id1" usedata="locate_dataSrc" subclass="1" size="1" class="form_select"></select></td>';
		div+='<td width="100"><select name="location_id2" id="location_id2" usedata="locate_dataSrc" subclass="2" size="1" class="form_select"></select>';
		div+='<select name="location_id3" id="location_id3" usedata="locate_dataSrc" subclass="3" size="1" class="form_select" style="display:none;"></select></td>';
		div+='<td><input type="button" class="sf_btn" value="ȷ��" onclick="change_city_submit();"></td></tr><tr><td></td><td colspan="2" class="f14" align="left"><span id="location_id1_error" class="alert_error"></span></td></tr></tbody></table>';
		div+='<p style="text-align:left; padding-top:10px;"><a href="index.php?location_id=999" onclick="return clickon_city(\'999\')">�鿴ȫ�����л</a></p>';
		div+='</div></div>';
		show_msg_box({
			width		:		300, 
			b_title		:		false,	
			button		:		false,		
			b_close_bnt	:		false,							
			content		:		div
		});
	show_locate_select_v2([0,0,0], 'locate_dataSrc', MenuInfoArr);
}

function clickon_city(location_id)
{
	/*
	$("101029001_li").className="";
	$("101001001_li").className="";
	$("101003001_li").className="";
	$("101022001_li").className="";
	$(location_id+"_li").className="clickon";
	$("location_id1").value=location_id;
	show_locate_select_v2([location_id,0,0], 'locate_dataSrc', MenuInfoArr);
	*/
	//���ͬ�ǳ���cookie
	writeCookie("poco_event_location_id", location_id,100);
	return true;
}

function change_city_submit()
{
	var location_id1 = $("location_id1").value;
	var location_id2 = $("location_id2").value;

	if(location_id1 =="" && location_id2=="")
	{
		var msg = "��ѡ������";
		alert_error('location_id1',msg);
		return false;
	}
	if(location_id1 !="" && location_id2=="")
	{
		alert_error('location_id1','');
		var t = location_id1;
	}
	if(location_id1 !="" && location_id2!="")
	{
		alert_error('location_id1','');
		var t = location_id2;
	}
	//���ͬ�ǳ���cookie
	writeCookie("poco_event_location_id", t,100);
	window.location="index.php?location_id="+t;
}
//-----------------------�л�����-------------------------------//

//�л����Ա�ǩ�뻨����ǩ
function change_cmt_js(type,url)
{
	if(cmt_client_in_progress == true)
	{
		alert("ͼƬ�����ϴ��У��ݲ����л����Եȡ�");
	}else{
		if($('cmt_tab')){
			$('cmt_tab').className = '';
		}
		if($('feature_tab')){
			$('feature_tab').className = '';
		}
		$(type+'_tab').className = 'currenNow';
	
		var e;   
		if(e=document.getElementById("cmt_js"))
		{   
			e.parentNode.removeChild(e);
		}
	
	    var script = document.createElement("SCRIPT");
	    script.defer = true;
	    script.type= "text/javascript";
	    script.src=url;   
	    script.id= "cmt_js";
	
	    document.getElementsByTagName("HEAD")[0].appendChild(script);
	}

}

//��������ת��Ӧ�����
var lastTarget = null;
var target = null;
var timer = 0;
function show_select_category(id, obj)
{
	clearTimeout(timer);
	if (lastTarget) lastTarget.style.display = "none";
	target = document.getElementById(id);
	lastTarget = target;
	target.style.display = "inline";
	//��������
	target.onmouseover = function(){
		clearTimeout(timer);	
	}
	//�Ƴ�
	target.onmouseout = obj.onmouseout = function(){
		timer = setTimeout(function(){
			target.style.display = "none";
		}, 300);	
	};
}

//---------------------------------------------�л���ǩ���첽ȡ�---------------------------------------------//
function callBackQuery(callBack){
	
	if(callBack){
									
		callBack();
									
	}
}

function setElementDisplay(elem,displayVal){
	
	elem.style['display'] = displayVal;
		
}

function setElementRight(elem,rightVal){
	
	elem.style['right'] = rightVal;
		
}

function setElementLeft(elem,leftVal){
	
	elem.style['left'] = leftVal;
		
}
function setElementBottom(elem,bottomVal){
	
	elem.style['bottom'] = bottomVal;
		
}

function setBigImageSize(elem,boxWidth,boxHeight){
	
	var imgobject = new Image();
	imgobject.src = elem.src;
	targetWidth   = imgobject.width;
	targetHeight  = imgobject.height;

	if(Sys.ie){fixIeBug=true;}else{fixIeBug=false;}
	if( (targetWidth==0 || targetHeight ==0) && fixIeBug ) {
		var timer = setInterval(function(){

			setBigImageSize(elem,boxWidth,boxHeight);
			clearInterval(timer);

		}, 1000);	
		return;
	}

	if(elem){

		elem_x = targetWidth;
		elem_y = targetHeight;
		x_rate = (elem_x/boxWidth);
		y_rate = (elem_y/boxHeight);

		if( x_rate > y_rate ){
			//�̱�Ϊ��
			if( y_rate >= 1 ){

				elem.height = boxHeight;//�̶���
				elemWidth   = (elem_x/y_rate); //���߱�������ѹ��
				elem.width  = elemWidth;

			}
			else{
			
				elemWidth = elem.width;
			
			}

			if( x_rate >= 1 ){
								
				rightVal    = ((elemWidth-boxWidth)/2)+"px";
				bottomVal   = 0;
				setElementRight(elem.parentNode,rightVal);
				setElementBottom(elem.parentNode,bottomVal);
			
			}		
		}
		else{
			//�̱�Ϊ��
			if( x_rate >= 1 ){

				elem.width  = boxWidth;
				elemHeight  = (elem_y/x_rate);
				elem.height = elemHeight;
			
			}
			else{
			
				elemHeight = elem.height;

			}

			if( y_rate >= 1 ){

				bottomVal   = ((elemHeight-boxHeight)/2)+"px";
				rightVal    = 0;
				setElementBottom(elem.parentNode,bottomVal);
				setElementRight(elem.parentNode,rightVal);
			
			}
		}
	}
	setElementDisplay(elem,"");
}


function act_resize_img(imgObject, rectWidth, rectHeight, fixIeBug)
{
	var imgObj = new Image();
	imgObj.src = imgObject.src;
	try
	{	
		
		if(!fixIeBug) fixIeBug = true;
		//������IE�����µ�����
		if( (imgObj.width==0 || imgObj.height==0) && fixIeBug ) {
			var timer = setInterval(function(){

				act_resize_img(imgObject, rectWidth, rectHeight, false);
				clearInterval(timer);

			}, 1000);	
			return;
		}
		var x = imgObj.width>rectWidth ? rectWidth : imgObj.width;
		var y = imgObj.height>rectHeight ? rectHeight : imgObj.height;
		var scale	= imgObj.width/imgObj.height;
	
		if( x>y*scale ) {

			imgObj.width	= Math.floor(y*scale);
			imgObj.height	= y;

		}else {

			imgObj.width	= x;
			imgObj.height	= Math.floor(x/scale);
		
		}

		imgObject.style.display   = "";
		imgObject.style.width     = imgObj.width+"px";
		imgObject.style.height    = imgObj.height+"px";
		 
		if ( typeof(imgObject.onload)!='undefined')
		{
			imgObject.onload=null;
		}
	}
	catch(err)
	{
	
	}
}


//---------------------------------------------�л���ǩ���첽ȡ�---------------------------------------------//
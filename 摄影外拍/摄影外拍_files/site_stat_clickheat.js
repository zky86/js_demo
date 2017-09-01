/**
* 热点统计JS
* @author 肥华
**/

/**
*	页面元素绑定
*
*	example-1:
*		HTML:	<a href="xxx" id="link_1">link_1</a> <a href="yyy" id="link_2">link_2</a>
*		JS:		var _site_stat_bind_click_id = "link_1,link_2";

*	example-2:
*		HTML:	<a href="xxx" name="n_link_1">link_1</a> <a href="yyy" name="n_link_1">link_2</a>
*				<a href="xxx" name="n_link_2">link_3</a> <a href="yyy" name="n_link_2">link_4</a>
* 		JS:		var _site_stat_bind_click_name = "n_link_1,n_link_2";

*	example-3:
*		HTML:	<div name="div_name"><a href="xxx" id="id_link" name="name_link_1">link_1</a></div>
* 		JS:		var _site_stat_bind_click_name = "div_name,name_link_1";
*				var _site_stat_bind_click_id = "id_link";
*/

loadClickheat:
{
	if(typeof(isLoadClickheat) != 'undefined' && isLoadClickheat)
	{
		break loadClickheat;
	}
	var isLoadClickheat = true;
	
	var __is_trigger = typeof(__ver) == 'undefined' ? true : false;

	//var debug_mode = 1;
	var __poco_site_stat_clickheat_obj = {};
	var __clickhead = 1
	var _tmp_img = new Image(), __packer_send = new Image(), _test_packer_send = new Image();
	var __body_height = document.body.offsetHeight;
	var __browse_type = false;
	var __ver = '30';
	var __top_pop = false;
	var __tj_server = 'http://tjcss.poco.cn/click_hot.css';
	var __args_tj = '';
	var __screen_w = screen.width, __screen_h = screen.height;
	var __referer = escape(document.referrer);
	var __packer_control = new Date().getTime();
	var _site_stat_bind_click_id_arr = _site_stat_bind_click_class_arr = _site_stat_bind_click_name_arr = [];
	var _site_stat_cookie_name = '__ssbch', _is_click_loop = false, __write_control = false;
	var _tj_host = typeof(tj_host) == 'string' ? tj_host : "";
	var _tj_path = typeof(tj_path) == 'string' ? tj_path : "";
	var _tj_file = typeof(tj_file) == 'string' ? tj_file : "";
	var _tj_query = typeof(tj_query) == 'string' ? encodeURIComponent(tj_query) : "";
	
	__poco_site_stat_clickheat_obj.clickhead = function(event)
	{
		event = event || window.event;

		var x =-1, y = -1, b_w=document.documentElement.clientWidth, b_h=document.documentElement.clientHeight, __button = event.button;
		if(__browse_type == 'Chrome')
		{
			x = document.body.scrollLeft+event.clientX;
			y = document.body.scrollTop+event.clientY;
		}
		else
		{
			x = document.documentElement.scrollLeft+event.clientX;
			y = document.documentElement.scrollTop+event.clientY;
		}

		//去除点滚动条也抛包
		if(x > document.body.scrollWidth)
		{
			return 1;
		}
		
		if(__browse_type == 'IE')
		{
			if(__button==1) __button=0; else if(__button==4) __button=1;
		}

		if(__top_pop && __top_pop.style.display == 'none')
		{
			y > 119 ? (y += 83) : '';
		}

		var tj_server_param = __tj_server+'?x='+x+'&y='+y+'&w='+b_w+'&h='+b_h+'&body_h='+__body_height+'&btn_type='+__button+'&referer='+__referer+'&ver='+__ver+'&screen_w='+__screen_w+'&screen_h='+__screen_h+__args_tj+'&b='+navigator.appName+"&tj_host="+_tj_host+"&tj_path="+_tj_path+"&tj_file="+_tj_file+"&tj_query="+_tj_query;
		
		_tmp_img.src = tj_server_param;
	}

	// in_array
	function in_array(value, array)
	{
		if(typeof(array)!='object') return false;
		for(var i = 0; i < array.length; i ++)
		{
			if (array[i] == value) return true;
		}
		return false;
	}
	//绑定触发函数
	var bind_click_func = function(event)
	{
		var t = new Date().getTime();
		if(t - __packer_control < 100)
		{
			return 1;
		}
		__packer_control = t;

		if(__write_control == true)
		{
			return 1;
		}
		__write_control = true;
		event = event || window.event;
		var src_element = event.target || event.srcElement, __name = false;
		var content = "";
		while(src_element.tagName!="BODY")
		{
			if(src_element.id!='' && in_array(src_element.id, _site_stat_bind_click_id_arr))
			{
				content += 'i'+src_element.id+',';
			}
			__name = src_element.getAttribute("name");
			if(__name!='' && in_array(__name, _site_stat_bind_click_name_arr))
			{
				content += 'n'+__name+',';
			}
			if(src_element.className!='')
			{
				var class_name_arr = src_element.className.replace(/\s{2,}/g, ' ').split(' ');
				for(var i=0; i<class_name_arr.length; i++)
				{
					if(class_name_arr[i].length>0 && in_array(class_name_arr[i],  _site_stat_bind_click_class_arr))
					{
						content += 'c'+class_name_arr[i]+',';
					}
				}
			}
			src_element = src_element.parentNode;
		}
		content = content.charAt(content.length-1)==',' ? content.substring(0, content.length-1) : content;
		__packer_send.src=__tj_server+'?x=-1&y=-1&w=-1&h=-1&body_h=-1'+'&bind_hash_arr='+content+'&referer='+__referer+'&ver='+__ver+'&screen_w='+__screen_w+'&screen_h='+__screen_h+'&b='+navigator.appName+"&tj_host="+_tj_host+"&tj_path="+_tj_path+"&tj_file="+_tj_file+"&tj_query="+_tj_query;
		setTimeout(function(){ __write_control = false; }, 50);
	}

	//点击实时测试
	function check_tags()
	{
		if(document.location.search.indexOf('___tags=') > -1)
		{
			var s = document.location.search.indexOf('___tags=') + 8;
			var e = document.location.search.indexOf('&', s) > -1 ? document.location.search.indexOf('&', s) : 50000;
			var tags = document.location.search.substring(s, e);
			if(tags=='') return false;
			__tj_server = 'http://www1.poco.cn/poco_log_analyser/relatime_click_hot.php';
			__args_tj += '&cur_page='+escape(document.location.href)+'&tags='+tags;
		}
	}


	var load_site_stat = function()
	{
		__body_height = document.body.offsetHeight;
		if(typeof(__clickhead)!='undefined')
		{
			__top_pop = document.getElementById("top_pop");
			document.onmousedown = __poco_site_stat_clickheat_obj.clickhead;
		}
	}

	//
	if(__is_trigger)
	{
		__browse_type = navigator.userAgent.indexOf('Chrome') > 0 ? 'Chrome' : false;
		__browse_type = __browse_type === false ? (navigator.userAgent.indexOf('IE') > 0 ? 'IE' : false) : __browse_type;
		
		var bind_obj=name_obj_arr={};
		//绑定ID检测
		if(typeof(_site_stat_bind_click_id) == "string" && _site_stat_bind_click_id.length > 0)
		{
			_site_stat_bind_click_id_arr = _site_stat_bind_click_id.split(",");
			for(var i = 0; i < _site_stat_bind_click_id_arr.length; i ++)
			{
				bind_obj = document.getElementById(_site_stat_bind_click_id_arr[i]);
				if(!bind_obj) continue;
				_is_click_loop = true;
				__browse_type == 'IE' ? bind_obj.attachEvent("onmousedown", bind_click_func) : bind_obj.addEventListener("mousedown", bind_click_func, false) ;
			}
		}
		//绑定NAME检测
		if(typeof(_site_stat_bind_click_name) == "string" && _site_stat_bind_click_name.length > 0)
		{
			_site_stat_bind_click_name_arr = _site_stat_bind_click_name.split(",");
			for(var i = 0; i < _site_stat_bind_click_name_arr.length; i ++)
			{
				name_obj_arr = document.getElementsByName(_site_stat_bind_click_name_arr[i]);
				for(var j = 0; j < name_obj_arr.length; j ++)
				{
					bind_obj = name_obj_arr[j];
					if(!bind_obj) continue;
					_is_click_loop = true;
					__browse_type == 'IE' ? bind_obj.attachEvent("onmousedown", bind_click_func) : bind_obj.addEventListener("mousedown", bind_click_func, false) ;
				}
			}
		}
		//绑定CLASS检测
		if(typeof(_site_stat_bind_click_class) == "string" && _site_stat_bind_click_class.length > 0)
		{
			_site_stat_bind_click_class_arr = _site_stat_bind_click_class.split(",");
			var __class_obj = document.getElementsByTagName("*");
			for(var i=0; i<__class_obj.length; i++)
			{
				var class_name_arr = __class_obj[i].className.replace(/\s{2,}/g, ' ').split(" ");
				for(var j=0; j<class_name_arr.length; j++)
				{
					if(class_name_arr[j].length>0 && in_array(class_name_arr[j], _site_stat_bind_click_class_arr))
					{
						if(!__class_obj[i]) continue;
						_is_click_loop = true;
					__browse_type == 'IE' ? __class_obj[i].attachEvent("onmousedown", bind_click_func) : __class_obj[i].addEventListener("mousedown", bind_click_func, false) ;
					}
				}
			}
		}
		
		__browse_type == 'IE' ? window.attachEvent("onload", load_site_stat) : window.addEventListener("load", load_site_stat, false);
		
		/*
		window.onload=function()
		{
			load_site_stat();
		}
		*/
		check_tags();
	}
}
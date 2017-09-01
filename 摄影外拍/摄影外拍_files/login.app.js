 /**
 * ��¼App
 * ����MYPOCO_COMMON
 * @author: kidney
 */
var loginAppClass = new Class({
	initialize: function(initOptions){
		this.options = this.G_last_target = '';
		this.G_timer = 0;

		this.set(initOptions);
		try{
			monitorApp.createMonitor('login');//����������
		}catch(e){}
    },

	set: function(init){
		this.options = {
			reg_back_link		:	'',
			verifycode			:	false,	//�Ƿ�ʹ����֤��
			b_reload			:	false,	//�ɹ����Ƿ�ˢ��ҳ��(Ĭ�ϲ�ˢ��)
			b_succ_box			:	false,	//�ɹ����Ƿ���ʾ�ɹ���Ϣҳ��(Ĭ�ϲ���ʾ)
			submit_target		:	'',		//�ύ��ʽ(AJAX����iframe�ύ)
			CustomApi			:	function(){},
			onShow				:	function(){},
			onCountDownComplete	:	function(){}
		};
		Extend(this.options, init || {});
	},

	//�ֱ����Ի�ȡ
	getHandleAttr: function(handleObj){
		if ( handleObj.getAttribute('reg_back_link')!=null ) this.set({ reg_back_link:handleObj.getAttribute('reg_back_link') });//ע����תҳ
		if ( handleObj.getAttribute('verifycode')=='true' ) this.set({ verifycode:true });//�Ƿ�ʹ����֤��
		if ( handleObj.getAttribute('submit_target')!=null ) this.set({ submit_target:handleObj.getAttribute('submit_target') });//�ύ��ʽ
		if ( handleObj.getAttribute('b_succ_box')=='true' ) this.set({ b_succ_box:true });//�ɹ����Ƿ���ʾ�û���Ϣ��
		if ( handleObj.getAttribute('b_reload')=='true' ) this.set({ b_reload:true });//�ɹ����Ƿ�����ˢ��
	},

	//��ʼ��¼
	loginBox: function(handleObj){
		var thisClass = this;
		var data_arr = new Array();
		var page_url = 'http://' + document.domain + '/module_common/login/login_form.js.php';

		if ( typeof(handleObj)!='undefined' )
		{
			this.getHandleAttr(handleObj);
		}
		if ( this.options.reg_back_link!='' ) data_arr.push('reg_back_link=' + this.options.reg_back_link);
		if ( this.options.verifycode==true ) data_arr.push('verifycode=1');
		if ( this.options.submit_target!='' ) data_arr.push('submit_target=' + this.options.submit_target);
		if ( this.options.b_succ_box==true ) data_arr.push('b_succ_box=1');

		var data_pars = data_arr.join('&');
		if ( this.options.submit_target=='' )//ajax��ʽ
		{
			try{
				show_msg_box({
					title		:	'��¼POCO',
					content		:	'<p align="center">������...</p>',
					width		:	528,
					button		:	false,
					b_ajax		:	true,
					ajax_url	:	page_url,
					ajax_pars	:	data_pars,
					evalScripts	:	true,
					onGetDataComplete: function(){
						try{
							thisClass.options.onShow();
						}catch(e){}
						$('J_poco_global_login_username').focus();
					}
				});
			}catch(e){
				alert('��������ʧ�ܣ�');
				return false;
			}
		}
		else
		{
			try{
				$(this.options.submit_target).src = page_url + '?' + data_pars;
			}catch(e){
				alert('���ø�������ʧ�ܣ�');
				return false;
			}
		}
	},

	//�ύ(request_formʹ��MYPOCO_COMMON)
	loginSubmit: function(form_obj){
		var thisClass = this;
		if (thisClass.loginSubmitCheck()==false || $('J_login_submit_btn').getAttribute('locked')==1) return false;

		try{
			thisClass.lockSubmitBtn();//lock button
			if ( thisClass.options.submit_target=='' )//AJAX��ʽ�ύ
			{
				request_form({
					formid:form_obj.getAttribute('id'),
					data_type:'json',
					onRequestComplete:function(data){
						thisClass.unlockSubmitBtn();//lock

						if (data.state>0)
						{
							login_id = data.login_id;
							login_nickname = data.login_nickname;
							try{
								monitorApp.retrieve('login');// ˢ�¼����
							}catch(e){}

							if( thisClass.options.b_reload )//reload page
							{
								window.top.location.href = get_browser_url();
							}
							else if( thisClass.options.b_succ_box )//succ info page
							{
								if (data.succ_box)
								{
									$('J_poco_global_login').innerHTML = data.succ_box;
	
									thisClass.G_timer = 3;
									thisClass.countDown();
								}
								thisClass.options.CustomApi(data);
							}
							else
							{
								close_msg_box();
								thisClass.options.CustomApi(data);
							}
						}
						else
						{
							alert(data.msg);
						}
					}
				});
			}
			else//��ͨ��ʽ�ύ
			{
				form_obj.submit();
			}
		}catch(e){
			alert('��¼�ύ�쳣��');
			return false;
		}
	},

	//�ύǰ�ļ��
	loginSubmitCheck: function(){
		if ($('J_poco_global_login_username').value=='' || in_array($('J_poco_global_login_username').value, ['�û���', 'POCO����', 'QQ����', 'Email']))
		{
			alert('��¼�ʺŲ���Ϊ�գ�');
			$('J_poco_global_login_username').focus();
			return false;
		}
		else if ($('J_poco_global_login_password').value=='')
		{
			alert('���벻��Ϊ�գ�');
			$('J_poco_global_login_password').focus();
			return false;
		}
		else
		{
			return true;
		}
	},

	showTypeMenu: function(handleObj){
		var thisClass = this;
		var target = $('J_poco_global_login_type_div');

		clearTimeout(thisClass.G_timer);
		if (thisClass.G_last_target) thisClass.G_last_target.style.visibility = 'hidden';

		thisClass.G_last_target = target;
		target.style.visibility = 'visible';
		target.onmouseover = function(){//��������
			clearTimeout(thisClass.G_timer);
		};
		target.onmouseout = handleObj.onmouseout = function(){//�Ƴ�
			thisClass.G_timer = setTimeout(function(){
				target.style.visibility = 'hidden';
			}, 300);
		};
	},

	loginTypeSelector: function(typeId, typeTitle){
		$('J_poco_global_login_type').value = typeId;
		$('J_poco_global_login_username').value = typeTitle;
		$('J_poco_global_login_type_div').style.visibility = 'hidden';
		$('J_poco_global_login_username').focus();
	},

	lockSubmitBtn: function(){
		var btn_obj = $('J_login_submit_btn');
		btn_obj.setAttribute('locked', '1');
		btn_obj.className = 'login_submit_btn_locked';
		btn_obj.innerHTML = '<em>��¼��..</em>';
	},

	unlockSubmitBtn: function(){
		var btn_obj = $('J_login_submit_btn');
		btn_obj.setAttribute('locked', '');
		btn_obj.className = 'login_submit_btn';
		btn_obj.innerHTML = '<em>��¼</em>';
	},

	//�����ر�
	countDown: function(){
		try{
			if (this.G_timer<0)
			{
				close_msg_box();
				this.G_timer = 0;
				this.options.onCountDownComplete();
				return false;
			}
			$('J_login_close_sec').innerHTML = this.G_timer;
			this.G_timer--;
			setTimeout('loginApp.countDown();', 1000);
		}catch(e){
			this.G_timer = 0;
			return false;
		}
	},
	
	//����
	sinaOauthLogin:function (){
		var sina_open_window_width = 600,
		sina_open_window_height = 430,
		sina_open_window_left = (window.screen.width-sina_open_window_width)/2,
		sina_open_window_top = (window.screen.height-sina_open_window_height)/2;
		
		
		sina_oauth_login_window = window.open('http://'+document.domain+'/module_common/partner_login/sina/create_oauth_token.php?t='+timestamp(),null,"height="+sina_open_window_height+",width="+sina_open_window_width+",status=yes,toolbar=no,menubar=no,location=no,top="+sina_open_window_top+",left="+sina_open_window_left);
		sina_oauth_login_window.focus();
	},
	
	//QQ
	qqOauthLogin:function(){
		var qq_open_window_width = 520,
		qq_open_window_height = 400,
		qq_open_window_left = (window.screen.width-qq_open_window_width)/2,
		qq_open_window_top = (window.screen.height-qq_open_window_height)/2;
	
		qq_oauth_login_window = window.open('http://'+document.domain+'/module_common/partner_login/qzone/create_oauth_token.php?domain='+document.domain+'&t='+timestamp(),null,"height="+qq_open_window_height+",width="+qq_open_window_width+",status=yes,toolbar=no,menubar=no,location=no,top="+qq_open_window_top+",left="+qq_open_window_left);
		qq_oauth_login_window.focus();		
	},

	//163
	wangyiOauthLogin:function(){
		var wangyi_open_window_width = 845;
		var wangyi_open_window_height = 640;
		var wangyi_open_window_left = (window.screen.width - wangyi_open_window_width)/2;
		var wangyi_open_window_top = (window.screen.height - wangyi_open_window_height)/2;
		
		
		wangyi_oauth_login_window = window.open('http://'+document.domain+'/module_common/partner_login/163/create_oauth_token.php?domain='+document.domain+'&t='+timestamp(),null,"height="+wangyi_open_window_height+",width="+wangyi_open_window_width+",status=yes,toolbar=no,menubar=no,location=no,top="+wangyi_open_window_top+",left="+wangyi_open_window_left);
		wangyi_oauth_login_window.focus();

	},
	
	createSuccBox:function(userId, userName, userIcon){
		var thisClass = this, htmlStr = [];
		htmlStr.push('<div id="J_poco_global_login">');
		htmlStr.push('<div class="left_box pb10 pt10">');
		htmlStr.push('<div class="user_info">');
		htmlStr.push('<a href="http://my.poco.cn/id-' + userId + '.shtml" target="_blank"><img alt="' + userName + '" src="' + userIcon + '" /></a>');
		htmlStr.push('<a href="http://my.poco.cn/id-' + userId + '.shtml" class="user_name color1" target="_blank">' + userName + '</a>');
		htmlStr.push('</div>');
		htmlStr.push('<div class="fl other_info">');
		htmlStr.push('<p class="p2 login_succ">��¼�ɹ�����</p>');
		htmlStr.push('<p class="p1 color3 text_right">...<span id="J_login_close_sec">3</span>����Զ�����</p>');
		htmlStr.push('</div>');
		htmlStr.push('</div>');
		htmlStr.push('<div class="right_box text_center">');
		htmlStr.push('<p class="pt10"></p>');
		htmlStr.push('<p class="p2 pb15"><img src="http://my.poco.cn/module_common/login/images/pocoicon.png" /></p>');
		htmlStr.push('<p class="p1 color1 pb15">���̿�ʼ�� POCO ����ʱ������</p>');
		htmlStr.push('<p class="p3 text_right pb10"><img src="http://my.poco.cn/module_common/login/images/logof.jpg" /></p>');
		htmlStr.push('</div>');
		htmlStr.push('</div>');
		
		htmlStr = htmlStr.join('');
		
		show_msg_box({
			width:528,
			content:htmlStr,
			b_blank_div:true
		});

		thisClass.G_timer = 3;
		thisClass.countDown();
	}
});
var loginApp = new loginAppClass();
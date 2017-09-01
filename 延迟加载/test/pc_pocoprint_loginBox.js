$(document).ready(function(){
	
	//class属性中包含isLogin的标签点击时弹出登陆层,在需要登陆的地方只需要在标签中的class属性加上isLogin
	//如果标签上还有其他click事件函数代码执行，执行顺序和代码先后位置有关，return false不会中止后续代码执行
	$(".isLogin").click("click",function(e){
		var member_id = $.fn.cookie("member_id");
		if(member_id * 1 <= 0){
			$("#loginBox").show();
			return false;
		}
	});
	
	$("#closeLoginBox").on("click", function(){
		$("#loginBox").hide();
	});
	
	$("#loginBox_UserName").on({
	   "focus":function(){
		 if($(this).val()=="用户名/Email/POCO号码"){
		   $(this).val("");
		 } 
	   },
	   "blur":function(){
		  if($(this).val()==""){
		   $(this).val("用户名/Email/POCO号码");
		 } 
	   }

	});
	$("#loginBox_pw").on({
		"focus":function(){
			if($.trim($(this).val())=="" && $("#password-tips").attr("data-state")=="1"){
				$("#password-tips").hide();
				$("#password-tips").attr("data-state","2");
			}
		},
		"blur":function(){
			if($.trim($(this).val())=="" && $("#password-tips").attr("data-state")=="2"){
				$("#password-tips").show();
				$("#password-tips").attr("data-state","1");
			}
		}
	
	});


	$("#password-tips").click(function(){
		   $("#loginBox_pw").focus();
	   }
	);

	$("#loginBoxPoco").on("click", function(){
		var UserName = $.trim($("#loginBox_UserName").val());
		var PassWord = $.trim($("#loginBox_pw").val());
		
		if(UserName==""){
			commonAlert("请输入账号");
			return false;
		}

		if(PassWord=="" || PassWord=="密码"){
			commonAlert("请输入密码");
			return false;
		}

		$.ajax({
		   type: "GET",
		   url: "mall.php?r=login/Userlogin",
		   data: "UserName="+UserName+"&PassWord="+PassWord,
		   dataType : "text",
		   success: function(loginState){
			   loginState = $.trim(loginState);
				switch(loginState){
					case "-1":
						commonAlert("请检查用户名是否正确！");
						break;
					case "-2":
						commonAlert("请检查密码是否正确！");
						break;
					case "-3":
						commonAlert("登录失败，请检查用户名或密码是否正确！");
						break;
					case "1":
						window.location.reload();
						break;
				}

		   }
		});

	});

	$("#loginBox_regBtn").on("click", function(){
		window.location.href = "http://www1.poco.cn/reg1/reg.php?referer=" + encodeURIComponent(window.location.href);
	});
	

	$("#loginBoxSina").on("click", function(){
		thirdPartyOauthLogin("sina");
	});

	$("#loginBoxQQ").on("click", function(){
		thirdPartyOauthLogin("qq");
	});

	function timestamp(){
		var timestamp_obj = new Date();
		var time_str = timestamp_obj.getTime();
		time_str = time_str.toString();
		time_str = time_str.substr(0,10);
		return time_str;
	} 

	function thirdPartyOauthLogin(loginType){
		if(loginType==""){
			return false;
		}
		
		var newUrl="";
		var callUrl="";
		var locate_url = window.location.href;
		switch(loginType){
			case "sina":
				callUrl = "http://"+document.domain+"/module_common/partner_login/sina/create_oauth_token.php";
				//locate_url = locate_url + "&loginType=sina";
			break;

			case "qq":
				callUrl = "http://"+document.domain+"/module_common/partner_login/qzone/create_oauth_token.php";
				//locate_url = locate_url + "&loginType=qq";
			break;

			case "163":
				callUrl = "http://"+document.domain+"/module_common/partner_login/163/create_oauth_token.php";
				//locate_url = locate_url + "&loginType=163";
			break;
		}
		
		document.getElementById('loginBox').style.display = "none";
		newUrl = callUrl + "?act=mpoco&domain="+document.domain+"&locate="+encodeURIComponent(locate_url)+"&t="+timestamp();
		window.location.href = newUrl;
	}

});





$(document).ready(function(e){
	//�û�ѡ��Ч��ʵ�ּ����ݸ���
	$("#paper a, #tiehe a").click(function(e){
		if($(this).attr('class') != 'cur'){
			$(this).siblings().removeClass('cur');
			$(this).addClass('cur');
			var type = $(this).parent().attr("goods_id");
			var market_price = $(this).attr('data-market_price');
			var price = $(this).attr('data-price');
			if(market_price != ""){
				$("#market_price").text(market_price);
			}
			if(price != ""){
				$("#price").text(price);
			}
			$("input[name=" + type + "]") . val($(this).attr('_value'));
		}
	});
	//�û�ѡ��Ч��ʵ�ּ����ݸ���
	$("#goods_type a").click(function(e){
		if($(this).attr('class') != 'cur'){
			$(this).siblings().removeClass('cur');
			$(this).addClass('cur');
			var market_price = $(this).attr('data-market_price');
			$("#market_price").text(market_price);
			var price = $(this).attr('data-price');
			$("#price").text(price);
			var goods_id = $(this).attr('data-goods_id');
			$("input[name='goods_id']").val(goods_id);
			var make_type = $(this).attr('data-make_type');
			make_type = make_type == "lomo" ? "����ѡͼ����" : "���Ϲ���";
			var type = $("#make_type").text(make_type);
		}
	});
	//ͼƬ�л�Ч��ʵ��
	$("#paper a, #tiehe a, #goods_type a").on("mouseover mouseout", function(e){
		if(e.type == "mouseover"){
			var type = $.trim($($(this).children("em")[0]).text());
			var img = $("#goods_img").attr("data-img");
			var _img = 'images/mall-images/product-size/374x346/';
			var imgArr = {
					"������": 'mengxi-sj-374x346.jpg',
					"�ٷ�����":'shiguangyin-yin-374x346.jpg',
					"�����":'shiguangyin-bai-374x346.jpg',
					"ĥɰ��":'shiguangyin-lan-374x346.jpg'	,
					"���ư�-xc":'xiangce-dz-374x346.jpg',
					"���ư�-xps":'xiangpianshu-dz-374x346.jpg?v201405191007'
			};
			//���ư�����
			if(type == "���ư�"){
				if(img.indexOf('xiangce') != -1){
					type = '���ư�-xc';
				} else if(img.indexOf('xiangpianshu') != -1){
					type = '���ư�-xps';
				}
			}
			if(typeof(imgArr[type]) != "undefined"){
				$("#goods_img").prop("src", _img + imgArr[type]);
			}
		} else if(e.type == "mouseout") {
			var img = $("#goods_img").attr("data-img");
			$("#goods_img").prop("src", img);
		} 	
	});
	//������Ϣ��������
	$(".tips,div[id^='info_']").click(function(e){
		var _class = $(this).prop('class');
		if(_class != "tips"){
			var id = $(this).attr("id");
			var tips = ".tips[data-id='"+ id +"']";
		} else {
			var tips = this;
		}
		var id = $(tips).attr("data-id");
		if($.trim($(tips).text()) == "����鿴��"){
			$(tips).text("������� ��");
			$(tips).prev().show();
			$("#" + id).prop("class", "item item-hover clearfix");
		}else {
			$(tips).text("����鿴��");
			$(tips).prev().hide();
			$("#" + id).prop("class", "item clearfix");
		}
	});
	//�����������Ϣ�л�
	$("#product, #comment_list").click(function(e){
		if($(this).attr("id") == "product"){
			$("#comment_list").parent("li").prop("class", "");
			$("#product").parent("li").prop("class", "cur");
			$(".product-detail").show();
			$("#comment").hide();
		}else {
			$("#product").parent("li").prop("class", "");
			$("#comment_list").parent("li").prop("class", "cur");
			$("#comment").show();
			$(".product-detail").hide();
		}

	});
	
	//loading�㵥����ʧЧ��
	$("#fade, #loading").click(function(e){
		$("#loadingBox").hide();
	});
	
	//ҳ���ύ
	$("#submit,#submit_2").click(function(e){
		var goodsInfoIdStr = '';
		$.each($(".userSubmit"), function(i,v){
			$.each($(v).val().split("|"), function(_i, _v){
				if(_v != ""){
					goodsInfoIdStr = goodsInfoIdStr + _v + "-";
				}
			});
		});
		goodsInfoIdStr = goodsInfoIdStr.substr(0, goodsInfoIdStr.length-1);
		var goods_id = $("input[name='goods_id']").val();
		var sub_btn_text = $.trim($("#submit em").text());
		var isUpload = sub_btn_text == "���Ϲ���" ? 0 : 1;
		var params = "goods_id:"+goods_id;
		params = goodsInfoIdStr == "" ? params : params + "|id_str:" + goodsInfoIdStr;
		
		submitActFunc(params, isUpload);
	});
	
	//ҳ���ύ����func
	function submitActFunc(params, isUpload){
		var member_id = $.fn.cookie("member_id");
		if(member_id * 1 > 0){
			jumpToOrder(params, isUpload);	
		}
	}
	
	//��½����ת
	function jumpToOrder(flashpars, isUpload){
		 $("#loadingBox").show();
		var order_no = "";
		$.ajax({
		   type: "GET",
		   url: "index.php?r=api/pc_mall_serial_num",
		   dataType : "json",
		   success: function(JsonData){
			   $("#loadingBox").hide();

			   if(typeof(JsonData.status)=="undefined"){
				    commonAlert("���緱æ�������ԣ�");
					return false;
			   }

			   var status = JsonData.status;
			   if(status=="1"){
				   if(typeof(JsonData.serial_num)=="undefined"){
						commonAlert("���緱æ�������ԣ�");
						return false;
				   }
				   order_no = JsonData.serial_num;	
			   }else if(status=="-9"){
					$("#loginBox").show();
					return false;
			   }else{
					commonAlert("���緱æ�������ԣ�");
					return false;
			   }

			   if(order_no==""){
				   commonAlert("���緱æ�������ԣ�");
			   }else{
				   if(isUpload=="1"){
						openUploadFlash(order_no,flashpars)
				   }else{
						window.location.href = "mall.php?r=pay/order&order_no="+order_no+"&flashpars="+flashpars;
				   }
			   } 
		   }
		});
	}


	//��ͼƬ�ϴ���flash
	function openUploadFlash(order_no,flashpars){
		var play_flash_js = '<script language="javascript">AC_FL_RunContent(["codebase","http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0","width","960","height","584","id","sx","align","middle","src","inf","quality","high","name","inf","allowscriptaccess","sameDomain","allowfullscreen","false","pluginspage","http://www.macromedia.com/go/getflashplayer","movie","flash/pc_print_upload0612","wmode","transparent","FlashVars","order_no='+order_no+'&flashpars='+flashpars+'"], "pc_print_flash_upload_box")<\/script>';
		$("#pc_print_flash_upload_box").html(play_flash_js);
		$("#uploadFlashBox").show();
	}
	
	//�ر�ͼƬ�ϴ���flash
	function closeUploadFlash(){		
		$("#uploadFlashBox").hide();
		$("#pc_print_flash_upload_box").html("");
	}

	window.close_flash = closeUploadFlash;
});



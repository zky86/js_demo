define(function(require, exports, module) {
var $ = require('jquery'),JSON = require('utility/json/1.0.3/json');
var Cookie = require('matcha/cookie/1.0.0/cookie');
var SWFUpload = require('yue_utility/swfupload/2.2.0/swfupload-debug');

    exports.upload_icon = function(_swfPlaceholderId,options)
    {
        return getSwfupload(_swfPlaceholderId,options);
    };

    exports.upload_pics = function(_swfPlaceholderId,options)
    {
        return getSwfupload(_swfPlaceholderId,options);
    };	
    
    
    
    function getSwfupload(_swfPlaceholderId,options) {
        options = options || {};
		
		console.log(options)

        var postParams = {
        member_id: Cookie.get('yue_member_id'),
        g_session_id: Cookie.get('g_session_id'),
        pass_hash: Cookie.get('yue_pass_hash')
        };
        var _swfupload = new SWFUpload({
            upload_url: 'http://imgup-yue.yueus.com/ultra_upload_service/yueyue_upload_act.php',
            flash_url: 'http://yp.yueus.com/mobile/js/libs/utility/swfupload/2.2.0/swfupload.swf',
                file_post_name: 'opus',
                post_params: postParams,
				poco_id : Cookie.get('yue_member_id'),
                file_types: '*.jpg;*.png;*.jpeg;*.JPG;*.PNG;*.JPEG;*.Jpg;*.Png;*.Jpeg;',
                file_types_description: 'Images',
                //file_size_limit: '2MB',
                //file_upload_limit: 0,
                //file_queue_limit: 5,//最大队列数
                file_size_limit: options.file_size_limit || '4MB',
                file_upload_limit: options.file_upload_limit || '0',
                file_queue_limit: options.file_queue_limit || '9',//最大队列数
                prevent_swf_caching: options.prevent_swf_caching || true,
                debug: (window.location.href.indexOf('swfupload-debug') > -1 ? true : false),
                button_action: SWFUpload.BUTTON_ACTION.SELECT_FILES,
                button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                button_cursor: SWFUpload.CURSOR.HAND,
                button_placeholder_id:_swfPlaceholderId,
                button_image_url:options.button_image_url,
                button_width: options.buttonWidth,
                button_height: options.buttonHeight,
                swfupload_loaded_handler:function () {
                },
                //对弹框出现
                file_dialog_start_handler:function () {
                },
                //对话框小消失，每个成功入队的触发一次
                file_queued_handler: function (file) {
                    options.file_queued && options.file_queued(file);
                    console.log(file);
                    //alert("成功入队一个");
                },
                //选图后，对话框消失触发
                file_dialog_complete_handler: function (numFilesSelected, numFilesQueued) {
                    options.file_dialog_complete && options.file_dialog_complete(numFilesSelected, numFilesQueued);
                    console.log(numFilesSelected, numFilesQueued);
                    //alert("此时队列个数为"+numFilesSelected);
                   if (numFilesSelected == 0) 
                   {
                        return false;
                   }
                   else if(numFilesQueued>0)
                   {
                        try 
                        {
                            this.startUpload();
                                //this.startUpload();
                        } catch (ex)  {
                            this.debug(ex);
                        }
                    }
                },
                upload_start_handler: function (file) {
                    options.upload_start && options.upload_start(file);
                },
                upload_progress_handler: function (file, bytesComplete, bytesTotal) {
                    options.upload_progress && options.upload_progress(file, bytesComplete,bytesTotal);
                },
                upload_success_handler: function (file, serverData, responseReceived) {
                    console.log(file, serverData, responseReceived);
                    console.log(_swfupload);
                    options.upload_success && options.upload_success(file, serverData, responseReceived);
                },
                //当文件上传的处理已经完成
                upload_error_handler: function (file, errorCode, message) {
                    options.upload_error && options.upload_error(file, errorCode, message);
                    /* if(this.getStats().files_queued>0)
                    {
                        
                        this.startUpload();
                    } */
                },
                upload_complete_handler: function (file) {
                    options.upload_complete && options.upload_complete(file);
                    if(parseInt(this.getStats().files_queued)>0)
                    {

                        this.startUpload();
                    }
                },
                //队列错误
                file_queue_error_handler : function(file, errorCode, message){
                    try 
                    {
                        if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) 
                        {
                            alert("您正在上传的文件队列过多.\n" + (message === 0 ? "您已达到上传限制" : "您最多能选择 " + (message > 1 ? "上传 " + message + " 文件." : "一个文件.")));
                            return false;
                        }
                        switch (errorCode) {
                            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                                //文件尺寸过大
                                alert('文件大小不可以超过'+options.file_size_limit);
                                //
                                break;
                            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                                //无法上传零字节文件
                                alert('上传文件为零字节');
                                //
                                break;
                            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                                //不支持的文件类型
                                alert('所选内容有上传格式错误，请重新选择');
                                //
                                break;
                            default:
                            break;
                        }
                    } 
                    catch (ex)
                    {
                        this.debug(ex);
                    }
                }
            });

			console.log(_swfupload)

            return _swfupload;
    }
    
    
    
    
   

});
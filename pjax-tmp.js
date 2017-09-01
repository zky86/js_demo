/**
 * Created by Bosco on 2015/3/13.
 */
//define(function (require, exports) {
var C = require("common");
var Zepto = require("$");
var config = require("baseconfig");

var pjaxlock = false;


window.historys = [];
window.nowurls = "";//保存每次PJAX跳转以后的页面URL
var cachelimit = 10;//htmlcache 最大保存条数
var baseobj = null;//PJAX要替换元素所在的BOX
var targetobj = null;//PJAX要替换的元素
var ids = "curpage";//PJAX显示的当前元素
var defaultopt = {
    baseobj: ".base_body",
    targetobj: ".base_page"
};
var is_first_page = true;//是首次打开
var opt = {}//每次PJAX的配置
var timeout = 8000;//JS和CSS的超时时间

var loadjs_lock = false;
var loadjs_waiting = [];

var loadcss_lock = false;
var loadcss_waiting = [];


window.pjaxjs = [];//加载的JS路径
window.pjaxcss = [];//加载的CSS路径
window.htmlcache = {};//获取AJAX以后的HTML缓存
window.pagename = [];//页面ID缓存
//window.nowst=0;
//pjax的触发函数[目前相对于ID]
/*example:
 <div id='a'></div>请求回来以后，获取ID，然后触发pjaxevent.on("a",A)中绑定的A事件
 */
exports.pjaxevent = {
    on: function () {
    },
    off: function () {
    },
    ready: function () {
    },
    onload: []
};//加载有ID的DIV的时候触发的事件[]


//定义add事件
exports.pjaxevent.on = function (ele, fn) {
    if (!ele || ele == "on" || ele == "off" || ele == "ready" || ele == "onload") {
        console.log("pjax on事件标签不能为某些值");
        return false;
    }
    if (!C.isFunction(fn)) {
        console.log("pjax on的第二个参数要是函数")
        console.log(fn);
        return false;
    }
    exports.pjaxevent[ele] = fn;
    if (is_first_page)fn();
}

exports.pjaxevent.off = function (ele) {
    if (!ele || ele == "on" || ele == "off" || ele == "ready") {
        console.log("pjax on事件标签不能为某些值");
        return false;
    }
    exports.pjaxevent[ele] = function () {
    }
}
exports.pjaxevent.ready = function (fn) {
    if (C.isFunction(fn)) {
        exports.pjaxevent.onload.push(fn);
    }
    else if (typeof fn === "undefined") {
        if (exports.pjaxevent.onload.length > 0) {
            Zepto.each(exports.pjaxevent.onload, function (i, item) {
                C.isFunction(item) && item();
            });
        }
    }
}


/**
 * 检测是否支持pushstatus
 * @returns {History|Function|boolean}
 */
var support = function () {
    //alert(window.history.pushState);
    //C.Browser().isweixin
    var browser = C.Browser();
    var no_ios5_down = true;
    var no_weixin_android = true;
    var no_natural_android = true;
    //IOS5.1以下不支持
    if (browser.ios && browser.iosversion && parseFloat(browser.iosversion) < 5.1) {
        no_ios5_down = false;
    }

    //微信安卓6.2以下不支持
    if (browser.android && browser.isweixin && parseFloat(browser.weixin_version) < 6.2) {
        no_weixin_android = false;
    }

    //安卓原生4.0以下不支持
    if (browser.android && browser.androidversion && parseFloat(browser.androidversion) < 4 && !browser.qq && !browser.uc && !browser.chrome) {
        no_natural_android = false;

    }

    //ios5以下，微信安卓6.2以下不支持pushstate
    if (window.history && window.history.pushState && window.history.replaceState &&
        (browser.pc || ( no_ios5_down && no_weixin_android && no_natural_android) )) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 透明动画
 * @param o 调动动画的元素
 * @param t 动画时间（毫秒）
 * @param opa 透明度
 * @param callback 返回函数
 * @private
 */
var _fadeIn = function (o, t, opa, callback) {

    t = parseFloat(t);
    t = isNaN(t) ? 0 : t;
    opa = C.isNumber(opa) ? opa : false;

    if (opa !== false) {
        o.css({
            "transition-duration": t + "s",
            "-webkit-transition-duration": t + "s",
            "opacity": opa
        });
    }
    setTimeout(function () {
        if (opa === 0)o.css("display", "none");
        C.isFunction(callback) && callback.call();
    }, t * 1000);
}

/**
 * translate 移位
 * @param o 移位的标签
 * @param t 动画时间（毫秒）
 * @param left 移位距离
 * @param callback 返回函数
 * @private
 */
var _translate = function (o, t, left, top, callback) {
    t = parseFloat(t);
    if (isNaN(t))t = 0;
    var baset = t;
    t = (t / 1000) + "s";

    left = (typeof left == "number" ? left + "px" : left);
    top = top ? top : 0;
    top = (C.isNumber(top) ? top + "px" : top);
    if (left !== false) {
        o.css({
            "transition": "all " + t + " linear",
            "transform": "translate(" + left + "," + top + ")",
            "-webkit-transition": "all " + t + " linear",
            "-webkit-transform": "translate(" + left + "," + top + ")"
        });
        o.data("translate", left)
    }
    else {
        o.css({
            "transition-duration": t,
            "-webkit-transition-duration": t
        });
    }

    setTimeout(function () {
        o.css({
            "transition-duration": 0,
            "-webkit-transition-duration": 0
        });
        C.isFunction(callback) && callback.call();
    }, baset);
}


/****************************************************************************************/
/**
 * 动画系列函数，要收录5个东东，nowele,ele,movetime,readyfn,callback
 * @param nowele 要消失的元素
 * @param ele  要显示的元素
 * @param movetime  动画时间
 * @param readyfn 显示元素在DOM里面，并且从none变成block的时候触发
 * @param callback  显示元素动画结束以后触发的函数
 */
/****************************************************************************************/


/**
 * 动画系列函数_透明渐变
 */
var swf_fadeIn = function (nowele, ele, movetime, readyfn, callback) {
    _fadeIn(nowele, movetime, 0, function () {
        //nowele.removeClass(ids);
        //不用DOM缓存
        if (nowele.attr("id") != opt.pageid)nowele.remove();
        ele.addClass(ids);
        //var newst = ele.data("s_top");
        //newst = newst ? newst : 0;
        ele.css({"opacity": 0, "display": "block"});


        Zepto(window).scrollTop(0);

        _fadeIn(ele, movetime, 1, function () {
            callback();
            readyfn();
            pjaxlock = false;
        })
    });
}

/**
 * 动画系列函数_换场
 */
var swf_translate = function (nowele, ele, movetime, readyfn, callback) {
    movetime = 300;
    var st = Zepto(window).scrollTop();
    var position0 = ele.css("position");
    nowele.css({"position": "fixed", "top": 0 - st, "width": "100%"})
    ele.css({
        "display": "block",
        "position": "fixed",
        "top": 0,
        "width": "100%",
        "opacity": 1
    })
    _translate(ele, 0, "100%", 0);
    setTimeout(function () {
        _translate(nowele, movetime, "-100%", 0, function () {
            setTimeout(function () {
                nowele.remove();
                ele.addClass(ids);
                readyfn();
            }, 10);
        });
        _translate(ele, movetime, 0, 0, function () {
            callback();
            ele.css("position", position0);
            pjaxlock = false;
        })
    }, 10);
}


/**
 * pjax变身
 * @param ele 转换的元素
 * @param url 转换的url
 * @param isback 是否后退
 * @returns {boolean}
 */
var turn = function (ele, url, isback) {

    if (!url || !ele)return false;
    isback = isback || false;
    var W = Zepto(window).width();
    var nowele = baseobj.children("." + ids).eq(0);
    /*
     if (isback) {
     var nowele2 = ele.siblings("." + ids);
     if (nowele2.size() > 0) {
     nowele = nowele2;
     }
     }
     */

    /*15-04-08取消了DOM缓存
     var tmp_t=Zepto(window).scrollTop();
     nowele.data("s_top",tmp_t);
     */

    //$(window).scrollTop(tmp_t);
    var movetime = isback === false ? "0.2s" : "0s";


    //在元素存在DOM结构中，元素不none的时候，要触发
    var readyfn = function () {
        //标签加载的时候触发
        var id = ele.attr("id");

        var domready = false;

        try {
            exports.pjaxevent["ready"]();
            if (id) {
                domready = exports.pjaxevent["#" + id];
            }
            else if (opt.pageid && opt.pjaxinitpage) {
                domready = exports.pjaxevent["#" + opt.pageid];
            }
            if (domready && C.isFunction(domready)) {
                domready.call();
            }


        } catch (e) {
            console.log(e);
        }
    }
    //callback
    var callbackfn = function () {
        //转换成新的URL

        if (isback) {
            historys.splice();
            /*console.log(nowst)
             setTimeout(function() {
             C.CrazyScroll(nowst)
             },2400);*/
            _gototop = 0;

            //保存历史位置
            if (htmlcache[url]) {
                _gototop = htmlcache[url]["scrolltop"];
                if (!_gototop) {
                    _gototop = 0;
                }
            }
            Zepto(window).scrollTop(_gototop);
        }
        else {
            //url+="#"+hashid;
            historys.push(url);
            //不需要历史保留
            if (opt.pjaxnotrace) {
                history.replaceState(url, "superman turn", url);
            }
            else {
                history.pushState(url, "superman turn", url);
            }
        }
        //readyfn();
        window.nowurls = url;
        if (opt.callback) {
            opt.callback();
        }
    }
    /*
     console.log(window.location.href);
     console.log(nowele);
     */

    /*
     //目前BETA版本先使用强制性的获取base_page
     if(nowele.hasClass(defaultopt.targetobj.replace(".",""))){

     htmlcache[window.location.href]["match_div_id"]=nowele.get(0).outerHTML;
     }
     else{

     var catchele=nowele.parents(".base_page").get(0);
     console.log(window.location.href)
     console.log(catchele)
     if(catchele) {

     htmlcache[window.location.href]["match_div_id"] = catchele.outerHTML;
     }
     else{
     htmlcache[window.location.href]["match_div_id"]=nowele.get(0).outerHTML;
     }
     }
     */

    opt.afterajax && opt.afterajax();
    if (htmlcache[window.nowurls]) {
        // window.nowst=Zepto(window).scrollTop();
        htmlcache[window.nowurls]["scrolltop"] = Zepto(window).scrollTop();
    }

    swf_fadeIn(nowele, ele, movetime, readyfn, callbackfn)
    //swf_translate(nowele,ele,movetime,readyfn,callbackfn)


}

/**
 * 处理后退 前进动作
 * @param url
 */
var todo = function (url) {
    if (url.indexOf("#") > -1) {
        url = url.split("#")[0];
    }
    /*不使用缓存结构，所以抛弃了
     if (baseobj && baseobj.children) {
     var o = baseobj.children("[data-url='" + url + "']");

     //如果有页面
     if (o.size() > 0) {
     console.log("子对象");
     turn(o, url, true);
     return true;
     }
     else if ((o = baseobj.find("[data-url='" + url + "']")).size() > 0) {
     console.log("find对象")
     turn(o, url, true)
     return true;
     }
     }
     */
    //historys[historys.length - 1] != window.location 这个是放置某些手机浏览器 第一次加载自动触发pop事件的BUG
    if (htmlcache[url] && (htmlcache[url].cacheobj || htmlcache[url]["match_div_id"]) && historys[historys.length - 1] != window.location) {
        console.log("缓存");
        opt = {};
        opt = htmlcache[url]["opt"];
        //如果保存路径当时是通过不保留历史记录，并且是更换局部的方法进去，那么就要替换到istarget 和notrace 以及baseobj,
        //换成整页切换[目前后退支持保留痕迹的局部切换]
        if (opt.istarget && opt.pjaxnotrace) {
            opt.istarget = false;
            opt.pjaxnotrace = false;
            opt.baseobj = Zepto(defaultopt.baseobj);
        }
        baseobj = opt.baseobj;

        set_optswf();
        dopjax(url, null, true);
        return true;
    }
    //如果什么都没有，你悲剧了。。。
    else {
        if (historys[historys.length - 1] != url) {
            //console.log(window.pjax_location_href);
            C.GetLoading(null, null, {fix: true});
            //window.location.href = url;
            location.reload();
        }
    }
}

/**
 * 分析URL是否combo
 * @param url
 * @returns {*} 返回一个数组或一个字符串
 */
var combo = function (url) {
    if (!url.indexOf)return false;
    if (url.indexOf("??") > -1) {
        var ret = [];
        var urlsplit = url.split("??");
        var jsstr = urlsplit[1];
        var base = urlsplit[0];
        var jsarr = jsstr.split(",");
        Zepto.each(jsarr, function (i, item) {
            ret.push(base + "??" + item);
        })
        return ret;
    }
    else {
        return url;
    }
}


/**
 * 如果有opt.swf 则按照opt.swf 加载
 * 如果没有，则按照参数加载
 * opt.swf:
 * 1:target:目标元素
 * 2:fix:全屏
 * 3:../ 父元素
 * 4:../*** 父元素的某个选择器
 * 3:某个元素
 * 4:false:不加载
 * @param o
 */
var set_optswf = function (o) {
    if (opt.swf && opt.swf == "target") {
        opt.swf = baseobj;
    }
    else if (opt.swf && opt.swf == "fix") {
        opt.swfisfix = true;//
        opt.swf = Zepto("body");
    }
    else if (opt.swf && opt.swf.indexOf("../") > -1 && o) {
        //父元素
        if (opt.swf == "../") {
            opt.swf = o.parent();
            opt.swf = opt.swf.size() > 0 ? opt.swf.eq(0) : o;
        }
        //祖先元素
        else {
            var selecter = opt.swf.split("../")[1];
            opt.swf = o.parents(selecter);
            opt.swf = opt.swf.size() > 0 ? opt.swf.eq(0) : o;
        }

    }
    else if (opt.swf) {
        var tmpobj = Zepto(opt.swf);
        if (tmpobj.size() > 0) {
            opt.swf = tmpobj;
        }
        else {
            opt.swf = o;
        }
    }
    else if (opt.swf === false) {
        opt.swf = false;
    }
    else if (o) {
        opt.swf = o;
    }
    else {
        opt.swf = null;
    }
}

/**
 * 加载CSS
 * @param urls
 * @param callback
 */
var loadcss = function (urls, callback) {

    if (!C.isFunction(callback))callback = function () {
    }
    if (C.isArray(urls)) {
        if (urls.length < 1) {
            callback();
        }
        else {
            var allcss = 0;
            var hasload = 0;
            loadcss_lock = false;
            loadcss_waiting = [];
            Zepto.each(urls, function (i, item) {
                if (Zepto.inArray(item, pjaxcss) < 0) {
                    allcss++;
                    loadcss_item(item, function () {
                        pjaxcss.push(item);
                        hasload++;
                        if (hasload >= allcss) {
                            callback.call();
                        }
                    })

                }
            })
            if (allcss == 0) {
                callback.call();
            }
        }

    }
    else {
        callback();
    }
}

var loadcss_item = function (url, callback) {
    callback = C.isFunction(callback) ? callback : function () {
    };
    if (loadcss_lock) {
        loadcss_waiting.push({url: url, callback: callback});
        return false;
    }
    var _gowait = function () {
        if (loadcss_waiting.length > 0) {
            var _new = loadcss_waiting.splice(0, 1);
            _new && loadcss_item(_new[0].url, _new[0].callback);
        }
    }
    loadcss_lock = true;
    var _ast = null;

    // console.log("PJAX加载，加载CSS "+item);
    /*
     var tmpcss=Zepto('<link type="text/css" rel="stylesheet" href="'+item+'"/>');
     tmpcss.load=function(){
     console.log(1);
     }
     Zepto("head").append(tmpcss);
     */
    var csstmp = document.createElement('link');
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(csstmp);
    csstmp.setAttribute("href", url);
    csstmp.setAttribute("type", "text/css");
    csstmp.setAttribute("rel", "stylesheet");
    csstmp.onload = function () {
        clearTimeout(_ast);
        loadcss_lock = false;
        _gowait();
        callback();
        //console.log("PJAX加载，成功加载CSS "+item)
    }
    csstmp.onerror = function (e) {
        clearTimeout(_ast);
        console.log("pjax 加载错误,css " + url + " 加载失败");
        console.log(e)
        C.Msg(config.alert.system.speed_low, 3);
        //取消动画
        if (opt.swf) {
            C.CancelLoading(opt.swf);
        }
        pjaxlock = false;
        if (htmlcache[opt.href])htmlcache[opt.href]["status"] = -1;
    }
    _ast = setTimeout(function () {
        csstmp.onerror();
        //csstmp.setAttribute("href", "");
        console.log("请求: " + csstmp.getAttribute("href") + " 超时");
        csstmp.onerror = function () {
        };
        csstmp.onload = function () {
        }
        // head.removeChild(csstmp);
    }, timeout);
    head.appendChild(csstmp);

}

/**
 * 加载JS
 * @param urls
 * @param callback
 */
var loadjss = function (urls, callback) {
    if (C.isArray(urls) && urls.length > 0) {
        var alljs = 0;
        var hasload = 0;
        loadjs_lock = false;
        loadjs_waiting = [];
        Zepto.each(urls, function (i, item) {
            if (Zepto.inArray(item, pjaxjs) > -1) {
                return true;
            }
            alljs++;
            //console.log("PJAX加载，加载JS "+item);
            loadjs(item, function (e, src) {
                hasload++;
                if (hasload >= alljs) {
                    callback.call();
                }
                if (e) {
                    console.log("pjax 加载错误,js " + src + " 加载失败");
                }
                else {
                    //console.log("PJAX加载，成功加载JS "+item);
                }
            });
        })
        if (alljs == 0) {
            callback();
        }
    }
    else {
        callback();
    }
}


var loadjs = function (url, callback) {
    if (loadjs_lock) {
        loadjs_waiting.push({url: url, callback: callback});
        return false;
    }
    var _gowait = function () {
        if (loadjs_waiting.length > 0) {
            var _new = loadjs_waiting.splice(0, 1);
            _new && loadjs(_new[0].url, _new[0].callback);
        }
    }
    loadjs_lock = true;

    var head = document.getElementsByTagName('head')[0],
        js = document.createElement('script'),
        _ast = null;

    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', url);
    js.setAttribute('charset', config.ContentType);

    head.appendChild(js);

    //执行回调
    var callbackFn = function (e, error_url) {
        loadjs_lock = false;
        if (typeof callback === 'function') {
            callback(e, error_url);
            _gowait();
        }
    };

    if (document.all) { //IE
        js.onreadystatechange = function (e) {
            if (js.readyState == 'loaded' || js.readyState == 'complete') {
                clearTimeout(_ast);
                pjaxjs.push(url);
                callbackFn();
            }
            else {
                C.Msg(config.alert.system.speed_low, 3);
                //取消动画
                if (opt.swf) {
                    C.CancelLoading(opt.swf);
                }
                pjaxlock = false;
                if (htmlcache[opt.href])htmlcache[opt.href]["status"] = -1;
                clearTimeout(_ast);
                //callbackFn(e,url);
            }
        }
    } else {
        js.onload = function () {
            clearTimeout(_ast);
            pjaxjs.push(url);

            callbackFn();
        }
        js.onerror = function (e) {
            clearTimeout(_ast);
            C.Msg(config.alert.system.speed_low, 3);
            //取消动画
            if (opt.swf) {
                C.CancelLoading(opt.swf);
            }
            pjaxlock = false;
            if (htmlcache[opt.href])htmlcache[opt.href]["status"] = -1;
            //callbackFn(e,url);
        }
    }

    _ast = setTimeout(function () {
        js.onerror();
        console.log("请求: " + js.getAttribute("src") + " 超时");
        //js.setAttribute('src', "");
        js.onload = function () {
        };
        js.onerror = function () {
        };
        js.onreadystatechange = function () {
        };
        //head.removeChild(js);
    }, timeout);


}

/**
 * pjax成功以后处理函数
 * @param data
 * @param url
 * @param bool
 * @param pname 加载模块的ID，如果不传值，则为不经过AJAX加载
 */
var successfn = function (data, url, bool, pname) {

    console.log("pjax get request url:" + url);

    var content = "";
    var title = "";

    var _doit = function (content, title, cacheobj) {

        //加载HTML
        var newdom = "";
        if (cacheobj && cacheobj.size && cacheobj.size() > 0) {
            newdom = cacheobj;
        }
        else {
            newdom = Zepto(content);
        }

        var requesturl = url;
        title && Zepto("title").html(title);
        //alert(Zepto("title").html())

        //如果有目标，则只替换目标
        if (opt.istarget) {
            var newhtml = newdom.find(opt.targetselector);
            if (newhtml.size() > 0) {
                //newhtml.data("url", requesturl);
                newhtml.css("display", "none");
            }
            else {
                C.Msg(config.alert.pjax.no_target);
                console.log("请求出错，无法在AJAX返回值里面找到目标元素", 1);
                return false;
            }
        }
        //如果没有目标，则按照换页处理
        else {
            var newhtml = newdom;
            //newhtml.data("url", requesturl);
            newhtml.css("display", "none");
            var id = newhtml.attr("id");
            if (id) {
                var obj = Zepto("#" + id);
                if (obj) {
                    obj.remove();
                }
            }
        }

        htmlcache[url]["status"] = 1;

        //取消动画
        if (opt.swf) {
            C.CancelLoading(opt.swf);
        }

        //保存缓存
        if (htmlcache[window.nowurls]) {
            var nowele = baseobj.children("." + ids).eq(0);
            if (nowele.hasClass("base_page")) {
                htmlcache[window.nowurls]["cacheobj"] = nowele.clone();
            }
            else {
                htmlcache[window.nowurls]["cacheobj"] = nowele.parents(".base_page").clone();
            }
        }
        baseobj.append(newhtml);


        turn(newhtml, requesturl, bool);
    }

    //直接远程加载
    if (pname || (htmlcache[url] && htmlcache[url]["status"] == -1)) {
        if (data) {
            if (C.isObject(data)) {
            }
            else {
                try {
                    data = eval("(" + data + ")");
                }
                catch (e) {
                    //取消动画
                    if (opt.swf) {
                        C.CancelLoading(opt.swf);
                    }
                    C.Msg(config.alert.pjax.no_target, 1);
                    pjaxlock = false;
                    console.log("转化数据失败。")
                    console.log(e);
                    return false;
                }
            }
            content = data["match_div_id"];
            title = data["match_title"]
            content = content.replace("<font></font>", "");

            if (!content) {
                //取消动画
                if (opt.swf) {
                    C.CancelLoading(opt.swf);
                }
                C.Msg(config.alert.pjax.no_target, 1);
                console.log("请求失败,没有返回div");
                return false;
            }

            if (Zepto.inArray(pname, pagename) < 0) {
                pagename.push(pname);
            }

            if (C.ObjectLength(htmlcache) > cachelimit) {
                C.Objectshirf(htmlcache)
            }
            if (!htmlcache[url]) {
                htmlcache[url] = {
                    "match_div_id": content,
                    "match_title": title,
                    "match_script": data["match_script"],
                    "match_link": data["match_link"],
                    "opt": opt
                };
            }

            //加载CSS 和JS
            var jss = [];
            var css = [];
            var jsArr = data["match_script"] || [];
            var cssArr = data["match_link"] || [];

            //处理CSS
            if (cssArr.length > 0) {
                Zepto.each(cssArr, function (i, item) {
                    item = Zepto(item).attr("href");
                    if (item) {
                        var ret = combo(item);
                        if (C.isArray(ret)) {
                            css = css.concat(ret);
                        }
                        else if (C.isString(ret)) {
                            css.push(ret);
                        }
                    }
                });
            }
            //处理JS
            if (jsArr.length > 0) {
                Zepto.each(jsArr, function (i, item) {
                    var src = Zepto(item).attr("src");
                    if (src) {
                        var ret = combo(src);
                        if (C.isArray(ret)) {
                            jss = jss.concat(ret);
                        }
                        else if (C.isString(ret)) {
                            jss.push(ret);
                        }
                    }
                });
            }

            //加载完所有JS才显示
            loadcss(css, function () {
                //加载完所有CSS之后才打开页面
                loadjss(jss, function () {

                    _doit(content, title);
                });
            });
        }
    }
    //从缓存获取
    else {
        var cacheobj = false;
        if (data) {
            content = data["match_div_id"];
            title = data["match_title"];
            cacheobj = data["cacheobj"];
        }
        _doit(content, title, cacheobj);
    }

}

/**
 * 处理pjax跳转
 * @params options object
 * 1:pjax[相当于data-pjax]
 * 2:href[相当于href=""]
 * 3:pjaxloading:加载动画放置的元素
 * 4:pjaxtarget[相当于data-pjaxtarget]
 * 5:callback:成功以后返回的函数
 * 6:afterajax:加载完成，但是没有做换页动画之前返回的函数
 * 7:errorback:加载失败的函数
 * 8:pjaxnotrace:不需要历史痕迹(使用replaceState)
 * 9:pjaxinitpage:是否强行执行页面初始化函数
 * 10:pjaxscript:是否加载JS
 * 11:pjaxcss:是否加载CSS
 *
 * html:
 * data-pjax:请求页面的元素
 * data_pjaxloading:加载动画的元素
 * data-pjaxtarget:替换的目标元素
 * data-pjaxnotrace:不需要历史痕迹(使用replaceState)
 * data-pjaxscript:不设定，则根据规则决定是否加载js,设定了，则强制加载JS
 * data-pjaxcss:不设定，则根据规则决定是否加载css,设定了，则强制加载css
 *
 * @returns {boolean}
 */
var pjax = function (options) {
    if (pjaxlock) {
        C.Msg(config.alert.pjax.unique)
        console.log("目前设定同一时间只能打开一个", 3);
        return false;
    }
    pjaxlock = true;
    is_first_page = false;//触发PJAX函数以后，后面的页面就不是第一次打开了
    opt = {};
    var _this = Zepto(this);
    var href = _this.get(0).href || "";
    var what = _this.data("pjax");
    opt.swf = _this.data("pjaxloading");
    var pjaxtarget = opt.pjaxtarget = _this.data("pjaxtarget");
    var pjaxnotrace = _this.data("pjaxnotrace");
    opt.pjaxscript = _this.data("pjaxscript") || null;
    opt.pjaxcss = _this.data("pjaxcss") || null;
    //nowst=0;

    //如果有options，就重新匹配
    if (options && C.isObject(options)) {
        if (options.pjax) {
            what = options.pjax;
        }
        if (options.href) {
            href = options.href;
        }
        if (options.pjaxloading) {
            opt.swf = options.pjaxloading
        }
        if (options.pjaxtarget) {
            pjaxtarget = opt.pjaxtarget = options.pjaxtarget;
        }
        if (options.callback) {
            opt.callback = options.callback;
        }
        if (options.afterajax) {
            opt.afterajax = options.afterajax;
        }
        if (options.errorback) {
            opt.errorback = options.errorback;
        }
        if (options.pjaxnotrace) {
            pjaxnotrace = options.pjaxnotrace;
        }
        if (options.pjaxinitpage) {
            opt.pjaxinitpage = options.pjaxinitpage;
        }
    }

    if (href.indexOf("#") > -1) {
        href = href.split("#")[0];
    }
    opt.href = href;

    if (pjaxnotrace) {
        opt.pjaxnotrace = pjaxnotrace;
    }

    if (!what) {
        pjaxlock = false;
        opt.errorback && opt.errorback();
        return true;
    }

    //保存唯一ID
    opt.pageid = what;

    //如果有目标,就把基础元素和页面元素替换成目标的元素和父元素
    if (pjaxtarget) {
        pjaxtarget = Zepto(pjaxtarget);
        if (pjaxtarget.size() > 1) {
            var ishas = false;//判断是否有合适的target
            pjaxtarget.each(function (i, item) {
                item = Zepto(item);
                if (item.width() > 0) {
                    ishas = true;
                    targetobj = item;
                }
            });
            //如果没有合适的target
            if (ishas === false) {
                targetobj = Zepto(defaultopt.targetobj);
                window.location = href;
            }

        }
        else {
            targetobj = pjaxtarget;
        }
        baseobj = targetobj.parent();
        opt.istarget = true;//如果有传递pjaxtarget
        opt.targetselector = _this.data("pjaxtarget");
    }
    //如果没有目标，则使用默认的元素
    else {
        baseobj = Zepto(defaultopt.baseobj);
        targetobj = Zepto(defaultopt.targetobj);
        if (targetobj.size() > 1) {
            targetobj = Zepto(defaultopt.targetobj + "." + ids)
        }
        if (targetobj.size() < 1) {
            //window.location=href;
            return false;
        }
        opt.istarget = false;//如果有传递pjaxtarget
        opt.targetselector = null;
    }


    opt.baseobj = baseobj;

    if (!targetobj.hasClass(ids)) {
        targetobj.addClass(ids);
        //Zepto("." + ids).data("url", location.href);
    }

    //如果是当前页
    if (window.location.href.indexOf(href) > -1) {
        opt.errorback && opt.errorback();
        pjaxlock = false;
        return false;
    }


    /*定义加载动画的元素*/
    set_optswf(_this);


    //如果已经加载了，就直接显示 [修改成不在DOM缓存]
    if (/*Zepto("[data-url='"+href+"']").size()>0*/false) {
        // turn(Zepto("[data-url='"+href+"']"),href);
        pjaxlock = false;
    }
    else {
        //targetobj.data("url",location.href)
        dopjax(href, _this, false, what);
    }
}

/**
 * 远程获取href 内容，
 * @param href href
 * @param ele 加载图标的基础函数
 * @param bool
 * @returns {boolean}
 */
var dopjax = function (href, ele, bool, what) {
    console.log("pjax start request url:" + href);
    //显示loading
    if (ele) {

        //如果pjaxloading为target的话，那么loading就出现在baseobj
        if (opt.swf) {

            if (opt.swfisfix) {
                C.GetLoading(opt.swf, null, {fix: true});
            }
            else C.GetLoading(opt.swf);
        }
    }


    if (htmlcache[href] && htmlcache[href]["status"] != -1) {
        if (opt.swf) {
            C.CancelLoading(opt.swf);
        }
        successfn(htmlcache[href], href, bool);
        return false;
    }
    else if (htmlcache[href] && htmlcache[href]["status"] == -1) {
        setTimeout(function () {
            successfn(htmlcache[href], href, bool, url);
        }, 10);
        return false;
    }
    var reqdata = {};
    reqdata.is_pjax = true;
    var url = href.split("?");
    if (url)url = url[0];
    if (Zepto.inArray(url, pagename) < 0) {
        reqdata.is_script = true;
        reqdata.is_link = true;
    }

    if (opt.pjaxscript) {
        reqdata.is_script = true;
    }

    if (opt.pjaxcss) {
        reqdata.is_link = true;
    }

    if (!what) {
    }
    reqdata.div_id = what;

    Zepto.ajax({
        url: href,
        type: "GET",
        dataType: "text",
        data: reqdata,
        success: function (data) {
            successfn(data, href, bool, url)
        },
        complete: function () {

            opt.errorback && opt.errorback();
            pjaxlock = false;
        },
        error: function (e) {
            if (opt.swf) {
                C.CancelLoading(opt.swf);
            }
            if (e.status == 404) {
                C.Msg(config.alert.pjax.no_page, 1);
            }
            else {
                C.Msg(config.alert.system.speed_low, 1);
            }
        },
        timeout: 10000
    })
}


Zepto.extend(Zepto.fn, {
    pjax: function (selecter) {
        if (window.pjaxstart)return false;
        if (support()) {
            if (this === document || this === window)return false;
            window.pjaxstart = true;
            historys.push(window.location.href);
            var defaultobj = Zepto(defaultopt.targetobj);


            //获取JS
            Zepto("script").each(function (i, item) {
                item = Zepto(item);
                var src = item.attr("src");
                if (src && src.indexOf && src.indexOf(".js") > -1) {
                    var ret = combo(src);
                    if (C.isArray(ret)) {
                        pjaxjs = pjaxjs.concat(ret);
                    }
                    else if (C.isString(ret)) {
                        pjaxjs.push(ret);
                    }
                }
            });

            //获取CSS
            Zepto("link").each(function (i, item) {
                item = Zepto(item);
                var type = item.attr("type");
                if (type && type.toLowerCase() == "text/css") {
                    var src = item.attr("href");
                    if (src && src.indexOf && src.indexOf(".css") > -1) {
                        var ret = combo(src);
                        if (C.isArray(ret)) {
                            pjaxcss = pjaxcss.concat(ret);
                        }
                        else if (C.isString(ret)) {
                            pjaxcss.push(ret);
                        }
                    }
                }
            });


            Zepto(document).on("click", selecter, function (e) {
                pjax.call(this)
                return false;
            })
            window.onpopstate = function (e) {
                var lasthref = nowurls || "";
                if (lasthref.indexOf("#") > -1) {
                    lasthref = lasthref.split("#")[0];
                }
                var nexthref = location.href;
                if (nexthref.indexOf("#") > -1) {
                    nexthref = nexthref.split("#")[0]
                }
                //如果只是hash的改变，那么不执行todo
                if (lasthref == nexthref) {
                    return false;
                }
                todo(document.location.href);
            };

            //获取第一次缓存
            if (defaultobj.size() > 0 && defaultobj.get(0).outerHTML) {
                nowurls = window.location.href;
                if (nowurls.indexOf("#") > -1) {
                    nowurls = nowurls.split("#")[0];
                }
                window.htmlcache[nowurls] = {
                    "match_div_id": defaultobj.get(0).outerHTML,
                    "match_title": Zepto("title").html(),
                    opt: {
                        pageid: defaultobj.attr("id") || null,
                        baseobj: Zepto(defaultopt.baseobj),
                        pjaxcss: null,
                        pjaxscript: null,
                        swf: "fix",
                        swfisfix: true,
                        istarget: false
                    }
                }

            }
        }
        else {
            console.log("your browser is not support pjax");
        }
    }
})

exports.pjax = (function () {
    if (support()) {
        return pjax;
    }
    else {
        return null;
    }
})()

//});
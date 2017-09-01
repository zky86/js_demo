;(function(window, seajs, undefined) {
    var map = [], debug = 0, cacheTime = /sea-cache=(\d+)/.exec(window.location.href);

    // debug mode
    if (cacheTime && cacheTime[1]) {
        debug = true;
		if (!(/cb.poco.cn/.test(window.location.href))){
			map = [
				[/([^\/]*\.js)$/i, '$1?t=' + cacheTime[1]]
			];
		}
    }

    seajs.config({
        
        paths: {
            utility: 'http://cb.poco.cn/utility',
            poco: 'http://cb.poco.cn/poco',
            wo: 'http://cb.poco.cn/wo',
            woBumbleBee: 'http://cb.poco.cn/wo/BumbleBee/dist',
            matcha: 'http://cb.poco.cn/matcha',
		    yue_utility : 'http://yp.yueus.com/mobile/js/libs/utility',
            yueyue_global : 'http://yp.yueus.com/js/global'      
        },
        alias:{
            handlebars: 'utility/handlebars/1.0.0/handlebars',
            jquery: 'utility/jquery/1.11.0/jquery',
            json:'utility/json/1.0.3/json',
            swfupload: 'yue_utility/swfupload/2.2.0/swfupload',
            $: 'utility/jquery/1.11.0/jquery',
            cookie: 'matcha/cookie/1.0.0/cookie',
            topbar : 'yueyue_global/topbar/topbar'  
        },
        preload: [
            this.JSON ? '' : 'json'
        ],
        charset: 'utf-8',
        debug: debug,
        map: map
    });
})(window, seajs);
define(["controllers/index/CityData", "common/fbaseview", "libs", "FlightModel", "controllers/abstractview/c.ui.datasource", "FlightStore", "cGeoService", "utility/adLoad", "cUIInputClear", "common/utility/utils", "cUtilDate"], function(a, b, c, d, e, f, g, h, i, j, k)
{
    var l = k;
    GeoLocation = g.GeoLocation;
    var m = b.extend(
    {
        pageid: "212007",
        flightStore: f.FlightSearchStore.getInstance(),
        flightSearchSubjoin: f.FlightSearchSubjoinStore.getInstance(),
        lowestPriceSearchStore: f.LowestPriceSearchStore.getInstance(),
        FlightCityListModel: d.FlightCityListModel.getInstance(),
        FlightInterCityListModel: d.FlightInterCityListModel.getInstance(),
        flightCityListStore: f.FlightCityListStore.getInstance(),
        flightInterCityListStore: f.FlightInterCityListStore.getInstance(),
        isInlandLoaded: !1,
        isInterLoaded: !1,
        dateSource: new e,
        selectItem: null,
        cityType: null,
        cityMode: 1,
        baseDataModel: null,
        basedata: null,
        hotcitylist: null,
        inlandcitylist: null,
        intercity: null,
        interhotcitylist: null,
        self: null,
        render: function()
        {
            this.els = {
                elflightcitylisttpl: Lizard.T("flight-citylist-tpl"),
                elflightcitylistboxofinter: this.$el.find("#flightcitylistbox .intercity"),
                elflightcitylistboxofinland: this.$el.find("#flightcitylistbox .inlandcity"),
                elflightcitylistbox: this.$el.find("#flightcitylistbox"),
                elflightcitykeyword: this.$el.find("#flight_city_keyword"),
                elhistory_close: this.$el.find(".history_close"),
                elcitytabli: this.$el.find(".city_tab li"),
                elcitybox: this.$el.find(".citybox"),
                elinlandcity: this.$el.find(".inlandcity"),
                elintercity: this.$el.find(".intercity"),
                elintercitylisttpl: Lizard.T("intercitylisttpl"),
                elassociate: this.$el.find("#associate"),
                eltabbox: this.$el.find(".cont_blue2")
            }, this.cityListTplfun = _.template(this.els.elflightcitylisttpl), this.intercityListTplfun = _.template(this.els.elintercitylisttpl)
        },
        events:
        {
            "click #js_return": "backAction",
            "click .city-group-title": "cityGroupTitleClick",
            "input #flight_city_keyword": "flightCityKeyWordInput",
            "focus #flight_city_keyword": "flightCityKeyWordFocus",
            "click .city-item": "CityItemonClick",
            "click .history_close": "historyCloseonClick",
            "click .city_tab li": "switchCityMode",
            "click .flight-ctsrh-cancel": "flightCityKeyWordFocusout",
            "touchend .flight-ctlts li": "endtouch",
            "touchstart .flight-ctlts li": "moveToCity"
        },
        backAction: function()
        {
            this.back("index.html" + (j.getHeadParam() ? "?" + j.getHeadParam() : ""))
        },
        CityItemonClick: function(a)
        {
            var b = $(a.currentTarget),
                c = b.attr("data-info"),
                d = (b.attr("data-index"), b.attr("data-code")),
                e = parseInt(b.attr("data-id")),
                f = b.attr("data-ename").split("|")[0],
                g = b.attr("data-name"),
                h = b.attr("data-key"),
                i = b.attr("data-mode"),
                k = parseInt(b.attr("data-countryid")),
                m = (parseInt(this.flightStore.getAttr("tabtype")), b.attr("data-aportcode") || "");
            0 === k ? (this.flightStore.setAttr("tofltintl", 1), i = 2) : this.flightStore.setAttr("tofltintl", 0);
            var n = this.flightStore.getAttr("dmode"),
                o = this.flightStore.getAttr("amode"),
                p = parseInt(n) + parseInt(o);
            1 == this.cityType ? n = i : o = i;
            var q = parseInt(n) + parseInt(o),
                r = this.flightStore.getSearchDetails(0, "date") || (new Date).addDay(1);
            switch (2 == p && 3 == q ? (this.flightStore.setSearchDetails(1, "date", new l(new Date(r).addDay(3)).format("Y/m/d")), this.flightStore.setSearchDetailsItem(1, "date", new l(new Date(r).addDay(3)).format("Y/m/d"))) : 3 == p && 2 == q && (this.flightStore.setSearchDetails(1, "date", new l(new Date(r).addDay(2)).format("Y/m/d")), this.flightStore.setSearchDetailsItem(1, "date", new l(new Date(r).addDay(2)).format("Y/m/d"))), this.cityType)
            {
                case 1:
                    this.flightStore.setAttr("dmode", i), this.flightStore.setSearchDetails(0, "dCtyCode", d), this.flightStore.setSearchDetails(0, "dcityName", g), this.flightStore.setSearchDetails(0, "dcityeName", f), this.flightStore.setSearchDetails(0, "dkey", h), this.flightStore.setSearchDetails(0, "dCtyId", e), this.flightStore.setSearchDetails(0, "dDportCode", m), this.flightStore.setSearchDetails(1, "aCtyCode", d), this.flightStore.setSearchDetails(1, "acityName", g), this.flightStore.setSearchDetails(1, "acityeName", f), this.flightStore.setSearchDetails(1, "akey", h), this.flightStore.setSearchDetails(1, "aCtyId", e), this.flightStore.setSearchDetails(1, "aAportCode", m), this.lowestPriceSearchStore.setAttr("dCty", d);
                    var s = this.flightStore.getAttr(1 === k ? "inlanddhistory" : "interdhistory") || [];
                    s = s.filter(function(a, b)
                    {
                        return a && a.code !== d
                    }), s.unshift(JSON.parse(c)), s.length > 6 && s.splice(6, s.length), this.flightStore.setAttr(1 === k ? "inlanddhistory" : "interdhistory", s);
                    break;
                case 2:
                    this.flightStore.setAttr("amode", i), this.flightStore.setSearchDetails(0, "aCtyCode", d), this.flightStore.setSearchDetails(0, "acityName", g), this.flightStore.setSearchDetails(0, "acityeName", f), this.flightStore.setSearchDetails(0, "akey", h), this.flightStore.setSearchDetails(0, "aCtyId", e), this.flightStore.setSearchDetails(0, "aAportCode", m), this.flightStore.setSearchDetails(1, "dCtyCode", e), this.flightStore.setSearchDetails(1, "dcityName", g), this.flightStore.setSearchDetails(1, "dcityeName", f), this.flightStore.setSearchDetails(1, "dkey", h), this.flightStore.setSearchDetails(1, "dCtyId", e), this.flightStore.setSearchDetails(1, "dDportCode", m), this.lowestPriceSearchStore.setAttr("aCty", d);
                    var s = this.flightStore.getAttr(1 === k ? "inlandahistory" : "interahistory") || [];
                    s = s.filter(function(a, b)
                    {
                        return a && a.code !== d
                    }), s.unshift(JSON.parse(c)), s.length > 6 && s.splice(6, s.length), this.flightStore.setAttr(1 === k ? "inlandahistory" : "interahistory", s)
            }
            this.flightCityKeyWordFocusout();
            var t = Fp.getQuery("from");
            t ? this.jump(t) : this.back("index.html" + (j.getHeadParam() ? "?" + j.getHeadParam() : ""))
        },
        switchCityMode: function(a)
        {
            var b = $(a.currentTarget);
            switch (this.els.elcitytabli.removeClass("cityTabCrt"), b.addClass("cityTabCrt"), this.cityMode = parseInt(b.attr("data-mode")), this.flightSearchSubjoin.setAttr("citymode", this.cityMode), this.cityMode)
            {
                case 1:
                    this.els.elcitybox.css(
                    {
                        display: "none"
                    }), this.els.elinlandcity.css(
                    {
                        display: "block"
                    });
                    var c = this.flightStore.getAttr(1 === this.cityType ? "inlanddhistory" : "inlandahistory");
                    c && c.length ? this.$el.find("#historykey").show() : this.$el.find("#historykey").hide();
                    break;
                case 2:
                    this.els.elcitybox.css(
                    {
                        display: "none"
                    }), this.els.elintercity.css(
                    {
                        display: "block"
                    });
                    var c = this.flightStore.getAttr(1 === this.cityType ? "interdhistory" : "interahistory");
                    c && c.length ? this.$el.find("#historykey").show() : this.$el.find("#historykey").hide()
            }
            this.$el.find(".flight-ctlts").children().css("color", "")
        },
        historyCloseonClick: function()
        {
            this.els.elflightcitykeyword.val(""), this.els.elflightcitykeyword.trigger("input")
        },
        cityGroupTitleClick: function(a)
        {
            var b = $(a.currentTarget),
                c = b.next("ul");
            c.toggle()
        },
        flightCityKeyWordInput: function(a)
        {
            var b = $(a.currentTarget),
                c = b.val().replace(/\.|\{|\}|\[|\]|\*|\^/gim, "").toLowerCase();
            setTimeout($.proxy(function()
            {
                if (c)
                {
                    this.els.eltabbox.hide(), this.els.elassociate.hide(), this.els.elassociate.empty(), this.els.elflightcitylistbox.hide();
                    var a = this.els.elinlandcity.find(".nothotcity li[data-filter*='" + c + "']"),
                        b = this.els.elintercity.find(".nothotcity li[data-filter*='" + c + "']");
                    a.sort(function(a, b)
                    {
                        return $(a).attr("data-hotflag") - $(b).attr("data-hotflag")
                    }), b.sort(function(a, b)
                    {
                        return $(a).attr("data-hotflag") - $(b).attr("data-hotflag")
                    });
                    var d = {};
                    _.each(a, $.proxy(function(a)
                    {
                        var b = $(a),
                            e = b.attr("data-filter").split(" ");
                        if (function()
                            {
                                for (var a = 0, b = e.length; b > a; a++)
                                    if (0 === e[a].indexOf(c)) return !0;
                                return !1
                            }())
                        {
                            var f = b.attr("data-id");
                            d[f] && this.els.elassociate.find('[data-id="' + f + '"]').remove(), this.els.elassociate.append(a.cloneNode(!0)), d[f] = !0
                        }
                    }, this)), _.each(b, $.proxy(function(a)
                    {
                        var b = $(a),
                            e = b.attr("data-filter").split(" ");
                        if (function()
                            {
                                for (var a = 0, b = e.length; b > a; a++)
                                    if (0 === e[a].indexOf(c)) return !0;
                                return !1
                            }())
                        {
                            var f = b.attr("data-id");
                            d[f] && this.els.elassociate.find('[data-id="' + f + '"]').remove(), this.els.elassociate.append(a.cloneNode(!0))
                        }
                    }, this)), this.els.elassociate.find("li").length || this.els.elassociate.html('<li class="city-item-empty">没有结果</li>'), this.els.elassociate.show()
                }
            }, this), 0)
        },
        flightCityKeyWordFocus: function(a)
        {
            var b = $(a.currentTarget),
                c = b.val().replace(/\.|\{|\}|\[|\]|\*|\^/gim, "").toLowerCase();
            c || (this.$el.find(".header").hide(), this.$el.find(".flight-ctsfixed-blank").hide(), this.$el.find("#titlediv").removeClass("flight-ctsfixed"), this.els.eltabbox.hide(), this.els.elassociate.hide(), this.els.elassociate.empty(), this.els.elflightcitylistbox.hide(), this.$el.find("#tabtilte").hide(), this.$el.find(".flight-ctsrh-cancel").removeClass("js_hide"), this.$el.find(".search_wrap").addClass("withcancel"), this.$el.find(".flight-ctltsfixed").addClass("js_hide"))
        },
        flightCityKeyWordFocusout: function()
        {
            this.$el.find(".header").show(), this.$el.find("#titlediv").addClass("flight-ctsfixed"), this.$el.find(".flight-ctsfixed-blank").show(), this.els.eltabbox.show(), this.els.elassociate.hide(), this.els.elflightcitylistbox.show(), this.$el.find("#tabtilte").show(), this.$el.find("#flight_city_keyword").val(""), this.$el.find(".flight-ctsrh-cancel").addClass("js_hide"), this.$el.find(".flight-ctltsfixed").removeClass("js_hide"), this.$el.find(".search_wrap").removeClass("withcancel")
        },
        buildEvent: function()
        {
            i(this.els.elflightcitykeyword, null, null,
            {
                top: 10
            })
        },
        updatePage: function(a)
        {
            this.els.elcitytabli.removeClass("cityTabCrt"), this.els.elcitytabli.each($.proxy(function(a, b)
            {
                var c = $(b);
                c.attr("data-mode") == this.cityMode && c.addClass("cityTabCrt")
            }, this)), this.loadInlandCity(function()
            {
                this.loadInterCity(function()
                {
                    switch (this.cityMode)
                    {
                        case 1:
                            this.els.elcitybox.css(
                            {
                                display: "none"
                            }), this.els.elinlandcity.css(
                            {
                                display: "block"
                            });
                            break;
                        case 2:
                            this.els.elcitybox.css(
                            {
                                display: "none"
                            }), this.els.elintercity.css(
                            {
                                display: "block"
                            })
                    }
                    a && a.call(this)
                })
            })
        },
        loadInlandCity: function(b)
        {
            if (!this.isInlandLoaded)
            {
                null == this.flightCityListStore.get() && this.flightCityListStore.set(a.inlandCity);
                var c = this.flightCityListStore.get(),
                    d = 1 == this.cityType ? "departIndex" : "arriveIndex";
                c.cities = c.cities.sort(function(a, b)
                {
                    return b[d] - a[d]
                }), this.dateSource.setData(c.cities);
                var e = {},
                    f = {},
                    g = this.dateSource.groupBy("initial", function(a)
                    {
                        var b = !e[a.id];
                        return e[a.id] = !0, b
                    }),
                    h = this.dateSource.filter(function(a, b)
                    {
                        var c = 16 === (16 & b.flag) && !f[b.id];
                        return c && (f[b.id] = !0), c
                    }, function(a, b)
                    {
                        return a.hotFlag - b.hotFlag
                    }),
                    i = 1 === this.cityType ? this.flightStore.getSearchDetails(0, "dCtyCode") : this.flightStore.getSearchDetails(0, "aCtyCode"),
                    j = this.flightStore.getAttr(1 === this.cityType ? "inlanddhistory" : "inlandahistory"),
                    k = this.cityListTplfun(
                    {
                        keys: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
                        history: j || [],
                        datalist: g,
                        hotcitys: h,
                        cityid: i
                    });
                this.els.elinlandcity.css(
                {
                    display: "none"
                }), this.els.elinlandcity.html(k), this.els.elinlandcity.css(
                {
                    display: "block"
                }), this.els.elflightcitykeyword.val(""), this.selectItem = this.els.elflightcitylistboxofinland.find(".cur-selected"), this.hideLoading(), 1 == this.cityMode && (j && j.length ? this.$el.find("#historykey").show() : this.$el.find("#historykey").hide()), b && b.call(this), this.isInlandLoaded = !0
            }
        },
        loadInterCity: function(b)
        {
            if (!this.isInterLoaded)
            {
                null == this.flightInterCityListStore.get() && this.flightInterCityListStore.set(a.interCity);
                var c = this.flightInterCityListStore.get();
                for (var d in c.cities2) c.cities2[d].sort(1 == this.cityType ? function(a, b)
                {
                    return b.departIndex - a.departIndex
                } : function(a, b)
                {
                    return b.arriveIndex - a.arriveIndex
                });
                var e = 1 === this.cityType ? this.flightStore.getSearchDetails(0, "dCtyCode") : this.flightStore.getSearchDetails(0, "aCtyCode"),
                    f = this.flightStore.getAttr(1 === this.cityType ? "interdhistory" : "interahistory"),
                    g = this.intercityListTplfun(
                    {
                        keys: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
                        history: f || [],
                        data: c,
                        cityid: e
                    });
                this.els.elintercity.css(
                {
                    display: "none"
                }), this.els.elintercity.html(g), this.els.elintercity.css(
                {
                    display: "block"
                }), this.selectItem = this.els.elflightcitylistboxofinter.find(".cur-selected"), this.hideLoading(), b && b.call(this), this.isInterLoaded = !0, 2 == this.cityMode && (f && f.length ? this.$el.find("#historykey").show() : this.$el.find("#historykey").hide())
            }
        },
        ShowAfter: function()
        {
            var a = this.selectItem.parent(),
                b = a.prev(".city-group-title"),
                c = a.parent();
            c.length && (this.selectItem.length > 1 ? window.scrollTo(0, 0) : b.show())
        },
        cLog: function()
        {
            var a = JSON.parse(localStorage.getItem("HEADSTORE")),
                b = "citylist-" + Lizard.P("to"),
                c = {
                    title: "test",
                    msg: "citylist",
                    type: 1,
                    tags: [
                    {
                        name: "page",
                        value: b
                    },
                    {
                        name: "ftype",
                        value: "flight"
                    },
                    {
                        name: "cache",
                        value: 0
                    },
                    {
                        name: "speed",
                        value: "fast"
                    }],
                    head: a ? a.value : ""
                },
                d = new XMLHttpRequest;
            d.onreadystatechange = function()
            {
                4 == this.readyState
            }, d.open("POST", "http://m.ctrip.com/restapi/soa2/10400/Flight/Domestic/Common/ClientLog", !0), d.setRequestHeader("Content-type", "application/json"), d.send(JSON.stringify(c))
        },
        onCreate: function()
        {
            this.render(), this.buildEvent(), this.cLog()
        },
        onLoad: function()
        {
            switch (self = this, j.setCustomHead(this,
            {
                backAction: this.backAction.bind(this),
                callback: function()
                {
                    this.$el.find("#titlediv").css("top", "0")
                }.bind(this),
                title: "选择城市"
            }, !1), this.cityType = {
                depart: 1,
                back: 2
            }[Lizard.P("to")], this.cityMode = 1, this.cityType)
            {
                case 1:
                    this.cityMode = parseInt(this.flightStore.getAttr("dmode")) || 1;
                    break;
                case 2:
                    this.cityMode = parseInt(this.flightStore.getAttr("amode")) || 1
            }
            this.turning(), this.updatePage(function()
            {
                this.hideLoading()
            }), $(".flight-ctltsfixed-pd").height($(window).height() - 132)
        },
        touchstartFunc: function(a)
        {
            a.preventDefault();
            var b = a.touches[0],
                c = Number(b.pageX),
                d = Number(b.pageY);
            if (console.log("X:" + c + ";Y:" + d), $(a.target).is("li"))
            {
                $(a.target).parent().children().css("color", "");
                var e = $(a.target).text(),
                    f = self.$el.find('.nothotcity div[data-key="' + e + '"]');
                if (f.length)
                {
                    var g = f.offset().top;
                    console.log(g), window.scrollTo(0, g - 48)
                }
                $(a.target).css("color", "red")
            }
        },
        touchmoveFunc: function(a)
        {
            a.preventDefault();
            var b = a.touches[0],
                c = Number(b.pageX),
                d = Number(b.pageY);
            if (console.log("moveX:" + c + ";Y:" + d), $(a.target).is("li"))
            {
                $(a.target).parent().children().css("color", "");
                var e = $(a.target).text();
                console.log(e);
                var f = self.$el.find('.nothotcity div[data-key="' + e + '"]');
                if (f.length)
                {
                    var g = f.offset().top;
                    console.log(g), window.scrollTo(0, g - 48)
                }
                $(a.target).css("color", "red")
            }
        },
        moveToCity: function(a)
        {
            var b = this.$el.find(".cityTabCrt").attr("data-mode"),
                c = (1 != b && b ? ".intercity" : ".inlandcity") + " #" + (1 != +b && b ? "inter" : "inland");
            $(a.currentTarget).parent().children().css("color", "");
            var d = $(a.currentTarget).text(),
                e = 0;
            switch (d)
            {
                case "当前":
                    e = this.$el.find(c + "curentcity");
                    break;
                case "历史":
                    e = this.$el.find(c + "historycity");
                    break;
                case "热门":
                    e = this.$el.find(c + "hotcity");
                    break;
                default:
                    e = this.$el.find(c + 'nothotcity div[data-key="' + d + '"]')
            }
            e.length && window.scrollTo(0, $(e).offset().top - 132);
            var f = window.navigator.userAgent;
            f.indexOf("Android") > -1 || f.indexOf("Linux>") > -1 ? ($(a.currentTarget).append('<div class="flight-ctlts-selected-android">' + d + "</div>"), setTimeout(function()
            {
                $(".flight-ctlts-selected-android").remove()
            }, 1e3)) : $(a.currentTarget).append('<div class="flight-ctlts-selected">' + d + "</div>")
        },
        endtouch: function()
        {
            $(".flight-ctlts-selected-android").length > 0 ? $(".flight-ctlts-selected-android").remove() : $(".flight-ctlts-selected").remove()
        },
        onShow: function()
        {
            this.onLoad(), this.setTitle("城市列表")
        },
        onHide: function()
        {
            this.isInterLoaded = !1, this.isInlandLoaded = !1, this.els.eltabbox.show(), this.els.elassociate.hide(), this.els.elflightcitylistbox.show()
        },
        geoCity: function(a)
        {
            $(a.currentTarget).text("正在获取当前城市");
            this.getPosition(!0, null, this.errorgeocity)
        },
        getPosition: function(a, b, c)
        {
            var d = this;
            a = a === !1 ? !1 : !0, GeoLocation.ClearPosition(), GeoLocation.Subscribe("flight/index",
            {
                onStart: function()
                {
                    this.startGeoStatus()
                },
                onComplete: function(a)
                {
                    var b = {},
                        c = a.city.lastIndexOf("市") == a.city.length - 1 ? a.city.substring(0, a.city.length - 1) : a.city,
                        b = this.getCityByName(c);
                    console.log(JSON.stringify(b)), "上海市" == a.city ? (this.$el.find("#inlandcurentcity ul").append("<li class='city-item twoline' data-info='" + JSON.stringify(b) + "' data-countryid='1' data-mode='1' data-key='" + b.key + "' data-code='SHA' data-id='' data-name='上海'>上海</br>所有机场</li>"), this.$el.find("#inlandcurentcity ul").append("<li class='city-item twoline' data-info='" + JSON.stringify(b) + "' data-countryid='1' data-mode='1' data-key='" + b.key + "' data-code='SHA' data-aportcode='SHA' data-id='" + b.id + "' data-name='上海虹桥'>上海</br>虹桥机场</li>"), this.$el.find("#inlandcurentcity ul").append("<li class='city-item twoline' data-info='" + JSON.stringify(b) + "' data-countryid='1' data-mode='1' data-key='" + b.key + "' data-code='SHA' data-aportcode='PVG' data-id='" + b.id + "' data-name='上海浦东'>上海</br>浦东机场</li>")) : "北京市" == a.city ? (this.$el.find("#inlandcurentcity ul").append("<li class='city-item twoline' data-info='" + JSON.stringify(b) + "' data-countryid='1' data-mode='1' data-key='" + b.key + "' data-code='BJS' data-id='" + b.id + "' data-name='北京'>北京</br>所有机场</li>"), this.$el.find("#inlandcurentcity ul").append("<li class='city-item twoline' data-info='" + JSON.stringify(b) + "' data-countryid='1' data-mode='1' data-key='" + b.key + "' data-code='BJS' data-aportcode='PEK' data-id='" + b.id + "' data-name='北京首都'>北京</br>首都机场</li>"), this.$el.find("#inlandcurentcity ul").append("<li class='city-item twoline' data-info='" + JSON.stringify(b) + "' data-countryid='1' data-mode='1' data-key='" + b.key + "' data-code='BJS' data-aportcode='NAY' data-id='" + b.id + "' data-name='北京南苑'>北京</br>南苑机场</li>")) : (alert(a.city + JSON.stringify(b)), this.$el.find("#inlandcurentcity ul").append("<li class='city-item' data-mode='1' data-info='" + JSON.stringify(b) + "' data-countryid='1' data-key='" + b.key + "' data-code='" + b.code + "' data-id='" + b.id + "' data-name='" + b.name + "'>" + b.name + "</li>")), d.$el.find("#geocity").hide()
                },
                onError: "function" == typeof c ? c : this.geoError,
                onPosError: "function" == typeof c ? c : this.geoError
            }, this, a)
        },
        getCityByName: function(a)
        {
            var b = {};
            if (this.dateSource.data && this.dateSource.data.length > 0)
                for (var c = 0; c < this.dateSource.data.length; c++)
                {
                    var d = this.dateSource.data[c];
                    if (d.name == a)
                    {
                        b.name = d.name, b.code = d.code, b.id = d.id, b.key = d.key;
                        break
                    }
                }
            return b
        },
        showGeoCoty: function(a)
        {
            alert("success:" + JSON.stringify(a)), this.$el.find("#geocity").hide(), a.Data && a.Data && a.Data.length && ("SHA" == a.Data[0].Datas[0].Code || "BJS" == a.Data[0].Datas[0].Code ? (this.$el.find("#inlandcurentcity ul").append("<li class='city-item' data-mode='1' data-code='SHA' data-id='' data-name='上海'>上海</br>所有机场</li>"), this.$el.find("#inlandcurentcity ul").append("<li class='city-item' data-mode='1' data-code='" + a.Data[0].Datas[0].Code + "' data-id='' data-name='" + a.Data[0].Datas[0].Name + a.Data[0].Name + "'>" + a.Data[0].Datas[0].Name + "</br>" + a.Data[0].Name + "</li>"), this.$el.find("#inlandcurentcity ul").append("<li class='city-item' data-mode='1' data-code='" + a.Data[1].Datas[0].Code + "' data-id='' data-name='" + a.Data[1].Datas[0].Name + a.Data[1].Name + "'>" + a.Data[1].Datas[0].Name + "</br>" + a.Data[1].Name + "</li>")) : this.$el.find("#inlandcurentcity ul").append("<li class='city-item' data-mode='1' data-code='" + a.Data[0].Datas[0].Code + "' data-id='' data-name='" + a.Data[0].Datas[0].Name + "'>" + a.Data[0].Datas[0].Name + "</li>"))
        },
        geoError: function(a)
        {
            self.$el.find("#geocity").show()
        },
        startGeoStatus: function() {},
        stopGeoStatus: function() {},
        errorgeocity: function(a)
        {
            a.indexOf("拒绝") > 0 ? (self.$el.find("#inlandcurentcity").hide(), self.$el.find("#currentkey").hide()) : self.$el.find("#geocity").text("无法获取当前城市，请重试")
        },
        html5geo: function()
        {
            window.navigator.geolocation ? window.navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError,
            {
                enableHighAcuracy: !0,
                timeout: 5e3,
                maximumAge: 0
            }) : alert("Your browser does not support Geolocation!")
        },
        locationError: function(a)
        {
            alert(JSON.stringify(a))
        },
        locationSuccess: function(a)
        {
            alert(a)
        }
    });
    return m
});
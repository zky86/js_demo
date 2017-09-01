M.define("category", function(a)
{
    var b = function(c)
    {
        this.init(c)
    };
    M.object.merge(b.prototype,
    {
        init: function(j)
        {
            this.searchLand = new(M.exports("searchland").clazz)(
            {
                showFuncObj:
                {
                    source: this,
                    func: function()
                    {
                        var i = this;
                        $("#layout_jdBar").hide();
                        $("#layout_urlblack").hide();
                        $("#layout_clear_keyword").show();
                        $("#layout_search_submit").show()
                    }
                },
                hideFuncObj:
                {
                    source: this,
                    func: function()
                    {
                        var i = this;
                        $("#layout_urlblack").show();
                        $("#layout_clear_keyword").hide();
                        $("#layout_search_submit").hide()
                    }
                },
                claerKeywordBtnId: "layout_clear_keyword",
                keyword: j.searchland.keyword ? j.searchland.keyword : "",
                hotKeyword: j.searchland.hotKeyword ? j.searchland.hotKeyword : null,
                submitId: "layout_search_submit",
                formId: "layout_searchForm",
                catelogyListId: "layout_category",
                keywordId: "layout_newkeyword",
                isHome: false,
                closeSearchLandBtnId: "layout_search_bar_cancel",
                searchPanelId: "layout_search_head"
            });
            this.imgLazyLad = new(M.exports("Imglazyload").clazz)();
            this.baseId = "category";
            this.localStorageKey = "categoryDataKey";
            this.beforeLoadKey = "categoryBeforeLoadKey";
            this.rootListUlId = M.genId(this.baseId);
            this.branchScrollId = "branchScroll";
            this.rootListDivlId = M.genId(this.baseId);
            this.loadErrorMainId = M.genId(this.baseId);
            this.loadErrorId = M.genId(this.baseId);
            this.rootIdList = [];
            this.isload = false;
            this.showcid = null;
            this.scrollRootHeight = 0;
            this.scrollBranchHeight = 0;
            this.scrollOverIndex = 0;
            this.pageHeight = 0;
            this.rootCount = 0;
            this.rootTouchObj = {
                startY: 0,
                scrollY: 0
            };
            this.branchTouchObj = {
                startY: 0,
                scrollY: 0
            };
            this.basebodyH = 0;
            if (j.roorList)
            {
                this.catalogUpdateTime = j.roorList.catalogUpdateTime ? M.date.toDate(j.roorList.catalogUpdateTime).getTime() : null;
                if (j.roorList.catelogyList)
                {
                    var f = $(window).height();
                    this.basebodyH = $("body").height();
                    var l = f - this.basebodyH;
                    this.rootCount = j.roorList.catelogyList.length;
                    var p = 50 * this.rootCount;
                    if (l < p)
                    {
                        this.scrollRootHeight = p - l;
                        this.scrollOverIndex = parseInt(this.scrollRootHeight / 50, 10);
                        if (this.scrollRootHeight % 50 > 0)
                        {
                            this.scrollOverIndex++
                        }
                        this.scrollOverIndex++
                    }
                    this.pageHeight = l;
                    $("#rootList").html(this.rootHtml(j.roorList.catelogyList));
                    $("#" + this.rootListUlId).css(
                    {
                        transform: "translateY(0px)",
                        "-webkit-transform": "translateY(0px)"
                    });
                    $("#" + this.rootListDivlId).css(
                    {
                        height: l
                    });
                    var e = $(window).width();
                    $("#" + this.branchScrollId).css(
                    {
                        height: l,
                        width: e - 90
                    });
                    $("#branchList").css(
                    {
                        transform: "translateY(0px)",
                        "-webkit-transform": "translateY(0px)"
                    });
                    $("#branchList").after(this.loadErrorHtml());
                    var k = M.localstorage.get(this.localStorageKey);
                    if (k)
                    {
                        k = JSON.parse(k);
                        var o = [];
                        M.object.each(k, function(t, s)
                        {
                            var q = false;
                            for (var r = 0; r < j.roorList.catelogyList.length; r++)
                            {
                                if (s == j.roorList.catelogyList[r].cid)
                                {
                                    q = true;
                                    break
                                }
                            }
                            if (!q)
                            {
                                o.push(s)
                            }
                        });
                        if (o.length > 0)
                        {
                            for (var h = 0; h < o.length; h++)
                            {
                                delete k[o[h]]
                            }
                            k = JSON.stringify(k);
                            M.localstorage.set(this.localStorageKey, k)
                        }
                    }
                    if (j.roorList.catelogyList.length > 0)
                    {
                        var g = M.localstorage.get(this.beforeLoadKey);
                        var n = false;
                        var d = 0;
                        var m = j.roorList.catelogyList[0].cid;
                        if (g != null)
                        {
                            for (var h = 0; h < j.roorList.catelogyList.length; h++)
                            {
                                if (g == j.roorList.catelogyList[h].cid)
                                {
                                    n = true;
                                    m = g;
                                    d = h + 1;
                                    break
                                }
                            }
                        }
                        if (n)
                        {
                            this.scrollTo(d);
                            var c = this.rootIdList[d - 1];
                            $("#" + c).parent().find("li").removeClass("cur");
                            $("#" + c).addClass("cur")
                        }
                        this.getBranch(m)
                    }
                }
            }
        },
        rootHtml: function(f)
        {
            var e = this;
            var d = [];
            d.push('<div style="overflow:hidden;" id="' + e.rootListDivlId + '">');
            d.push('<ul style="" id="' + e.rootListUlId + '">');
            for (var c = 0; c < f.length; c++)
            {
                var g = M.genId(this.baseId);
                e.rootIdList.push(g);
                d.push("<li " + (c == 0 ? 'class="cur"' : "") + ' m_index="' + (c + 1) + '" m_cid="' + f[c].cid + '" id="' + g + '"><a href="javascript:void(0);">' + f[c].name + "</a></li>")
            }
            d.push("</ul>");
            d.push("</div>");
            return d.join("")
        },
        branchHtml: function(d, l)
        {
            var k = this;
            var h = [];
            if (l.length > 0)
            {
                for (var g = 0; g < l.length; g++)
                {
                    var f = l[g];
                    if (f && f.catelogyList && f.catelogyList.length > 0 && f.name)
                    {
                        var c = 1;
                        if (f.columNum)
                        {
                            if (f.columNum == 1)
                            {
                                c = 3
                            }
                            else
                            {
                                if (f.columNum == 3)
                                {
                                    c = 1
                                }
                            }
                        }
                        if (c == 1)
                        {
                            for (var e = 0; e < f.catelogyList.length; e++)
                            {
                                if (!f.catelogyList[e].icon || f.catelogyList[e].icon == "")
                                {
                                    c = 2;
                                    break
                                }
                            }
                        }
                        h.push('<div class="jd-category-div cur">');
                        h.push("<h4>" + f.name + "</h4>");
                        h.push('<ul class="jd-category-style-' + c + '">');
                        for (var e = 0; e < f.catelogyList.length; e++)
                        {
                            h.push('<li><a href="/products/' + d + "-" + f.cid + "-" + f.catelogyList[e].cid + '.html">');
                            c == 1 && h.push('<img src="/images/category/categorydef.png" imgsrc="' + f.catelogyList[e].icon + '">');
                            h.push("<span>" + f.catelogyList[e].name + "</span>");
                            h.push("</a></li>")
                        }
                        h.push("</ul>");
                        h.push("</div>")
                    }
                }
            }
            return h.join("")
        },
        loadErrorHtml: function()
        {
            var d = this;
            var c = [];
            c.push('<div id="' + d.loadErrorMainId + '" class="jd-category-loadfail" style="display:none;">');
            c.push('<div class="loadfail-content">');
            c.push('<div class="failing"></div>');
            c.push("<span>加载失败</span>");
            c.push('<a href="javascript:void(0);" id="' + d.loadErrorId + '" class="btn-loadfail"></a>');
            c.push("</div>");
            c.push("</div>");
            return c.join("")
        },
        getBranch: function(g)
        {
            var f = this;
            if (f.showcid != g)
            {
                f.showcid = g;
                M.localstorage.set(f.beforeLoadKey, g);
                var c = true;
                var e = f.getLocalStorageData(g);
                if (e)
                {
                    var d = new Date().getTime() - 86400000 * 3;
                    if (f.catalogUpdateTime)
                    {
                        if (f.catalogUpdateTime > e.updateTime || d > e.updateTime)
                        {
                            c = true
                        }
                        else
                        {
                            c = false
                        }
                    }
                    else
                    {
                        if (d > e.updateTime)
                        {
                            c = true
                        }
                        else
                        {
                            c = false
                        }
                    }
                }
                if (c)
                {
                    f.loadBranch(g)
                }
                else
                {
                    f.isload = true;
                    $("#branchList").fadeToggle(200, function()
                    {
                        $("#branchList").css(
                        {
                            transform: "translateY(0px)",
                            "-webkit-transform": "translateY(0px)"
                        });
                        $("#branchList").html(f.branchHtml(g, e.data));
                        f.branchTouchUnBind();
                        $("#branchList").fadeToggle(200, function()
                        {
                            $("#branchList").css("opacity", null);
                            f.imgLazyLad.lazyLad();
                            f.isload = false;
                            f.scrollBranchHeight = $("#branchList").height() - f.pageHeight;
                            f.branchTouchBind()
                        })
                    })
                }
            }
        },
        loadBranch: function(c)
        {
            var d = this;
            d.isload = true;
            $("#pageLoading").css("display", "block");
            M.http.ajax(
            {
                url: "/category/list.action",
                data: "_format_=json&catelogyId=" + c,
                success: function(e)
                {
                    var f = null;
                    if (e && e.catalogBranch)
                    {
                        f = JSON.parse(e.catalogBranch);
                        if (f.data)
                        {
                            f = f.data;
                            if (f.length > 0)
                            {
                                d.setLocalStorageData(c, f)
                            }
                            $("#" + d.loadErrorMainId).css("display", "none");
                            $("#branchList").css("display", "block");
                            $("#pageLoading").css("display", "none");
                            $("#branchList").fadeToggle(200, function()
                            {
                                $("#branchList").css(
                                {
                                    transform: "translateY(0px)",
                                    "-webkit-transform": "translateY(0px)"
                                });
                                $("#branchList").html(d.branchHtml(c, f));
                                d.branchTouchUnBind();
                                $("#branchList").fadeToggle(200, function()
                                {
                                    $("#branchList").css("opacity", null);
                                    d.imgLazyLad.lazyLad();
                                    d.isload = false;
                                    d.scrollBranchHeight = $("#branchList").height() - d.pageHeight;
                                    d.branchTouchBind()
                                })
                            })
                        }
                        else
                        {
                            d.isload = false;
                            $("#pageLoading").css("display", "none")
                        }
                    }
                },
                error: function()
                {
                    $("#pageLoading").css("display", "none");
                    $("#branchList").css("display", "none");
                    $("#" + d.loadErrorMainId).css("display", "block");
                    d.isload = false;
                    $("#" + d.loadErrorId).attr("m_cid", d.showcid);
                    d.showcid = null
                }
            })
        },
        setLocalStorageData: function(c, g)
        {
            var f = this;
            var e = M.localstorage.get(f.localStorageKey);
            if (!e)
            {
                e = {}
            }
            else
            {
                e = JSON.parse(e)
            }
            var d = {
                data: g,
                updateTime: new Date().getTime()
            };
            e[c] = d;
            e = JSON.stringify(e);
            M.localstorage.set(f.localStorageKey, e)
        },
        getLocalStorageData: function(d)
        {
            var f = this;
            var c = null;
            var e = M.localstorage.get(f.localStorageKey);
            if (e)
            {
                e = JSON.parse(e);
                e[d] && (c = e[d])
            }
            return c
        },
        scrollTo: function(c)
        {
            var f = this;
            var d = 0;
            if (c < f.scrollOverIndex)
            {
                d = (c - 1) * 50 * -1
            }
            else
            {
                d = f.scrollRootHeight * -1
            }
            var e = {
                transform: "translateY(" + d + "px)",
                "-webkit-transform": "translateY(" + d + "px)",
                "-webkit-transition": "0.2s ease 0s",
                transition: "0.2s ease 0s"
            };
            $("#" + f.rootListUlId).css(e);
            setTimeout(function()
            {
                var g = {
                    transform: "translateY(" + d + "px)",
                    "-webkit-transform": "translateY(" + d + "px)",
                    "-webkit-transition": "",
                    transition: ""
                };
                $("#" + f.rootListUlId).css(g)
            }, 200)
        },
        rootTouchBind: function()
        {
            var c = this;
            $("#" + c.rootListUlId).on("touchstart", function(d)
            {
                c.rootTouchObj.startY = d.touches[0].clientY;
                c.rootTouchObj.scrollY = 0
            });
            $("#" + c.rootListUlId).on("touchmove", function(g)
            {
                g.preventDefault();
                var h = g.touches;
                var f = g.touches[0].clientY;
                var i = f - c.rootTouchObj.startY;
                var d = 0;
                var e = c.getY(c.rootListUlId);
                d = e + i;
                if (d > 150)
                {
                    d = 150
                }
                else
                {
                    if (d < (c.scrollRootHeight * -1 - 150))
                    {
                        d = (c.scrollRootHeight * -1 - 150)
                    }
                }
                $("#" + c.rootListUlId).css("transform", "translateY(" + d + "px)");
                $("#" + c.rootListUlId).css("-webkit-transform", "translateY(" + d + "px)");
                c.rootTouchObj.scrollY = f - c.rootTouchObj.startY;
                c.rootTouchObj.startY = f
            });
            $("#" + c.rootListUlId).on("touchend", function(d)
            {
                c.touchScroll(c.rootTouchObj.scrollY, c.rootListUlId, c.scrollRootHeight)
            })
        },
        branchTouchBind: function()
        {
            var c = this;
            $("#branchList").on("touchstart", function(d)
            {
                c.branchTouchObj.startY = d.touches[0].clientY;
                c.branchTouchObj.scrollY = 0
            });
            $("#branchList").on("touchmove", function(g)
            {
                g.preventDefault();
                if (c.scrollBranchHeight > 0)
                {
                    var h = g.touches;
                    var f = g.touches[0].clientY;
                    var i = f - c.branchTouchObj.startY;
                    var d = 0;
                    var e = c.getY("branchList");
                    d = e + i;
                    if (d > 150)
                    {
                        d = 150
                    }
                    else
                    {
                        if (d < (c.scrollBranchHeight * -1 - 150))
                        {
                            d = (c.scrollBranchHeight * -1 - 150)
                        }
                    }
                    $("#branchList").css("transform", "translateY(" + d + "px)");
                    $("#branchList").css("-webkit-transform", "translateY(" + d + "px)");
                    c.imgLazyLad.lazyLad();
                    c.branchTouchObj.scrollY = f - c.branchTouchObj.startY;
                    c.branchTouchObj.startY = f
                }
            });
            $("#branchList").on("touchend", function(d)
            {
                c.touchScroll(c.branchTouchObj.scrollY, "branchList", c.scrollBranchHeight, true)
            })
        },
        branchTouchUnBind: function()
        {
            var c = this;
            $("#branchList").off()
        },
        touchScroll: function(k, d, m, g)
        {
            var c = this;
            var e = Math.abs(k);
            var h = 0;
            var f = 200;
            var l = d;
            var j = 0;
            if (e >= 40)
            {
                h = 15
            }
            else
            {
                if (e < 40 && e >= 25)
                {
                    h = 10
                }
                else
                {
                    if (e < 25 && e >= 10)
                    {
                        h = 5
                    }
                    else
                    {
                        h = 0
                    }
                }
            }
            if (h > 0)
            {
                if (k < 0)
                {
                    h = h * -1
                }
                setTimeout(function()
                {
                    c.touchScrollRun(h, d, 0, m, g)
                }, 2)
            }
            else
            {
                var i = 0;
                i = c.getY(d);
                c.goToEnd(i, d, m)
            }
        },
        touchScrollRun: function(h, k, g, e, f)
        {
            var i = this;
            var j = g + 1;
            if (f)
            {
                i.imgLazyLad.lazyLad()
            }
            if (g < 50)
            {
                var d = 0;
                d = i.getY(k) + h;
                $("#" + k).css("transform", "translateY(" + d + "px)");
                $("#" + k).css("-webkit-transform", "translateY(" + d + "px)");
                if (d <= (e * -1 - 30) || d >= 30)
                {
                    i.goToEnd(d, k, e)
                }
                else
                {
                    setTimeout(function()
                    {
                        i.touchScrollRun(h, k, j, e, f)
                    }, 2)
                }
            }
            else
            {
                i.goToEnd(d, k, e)
            }
        },
        goToEnd: function(c, h, e)
        {
            var g = this;
            var f = null;
            var d = null;
            if (e > 0)
            {
                if (c < (e * -1))
                {
                    f = {
                        transform: "translateY(" + (e * -1) + "px)",
                        "-webkit-transform": "translateY(" + (e * -1) + "px)",
                        "-webkit-transition": "0.2s ease 0s",
                        transition: "0.2s ease 0s"
                    };
                    d = {
                        transform: "translateY(" + (e * -1) + "px)",
                        "-webkit-transform": "translateY(" + (e * -1) + "px)",
                        "-webkit-transition": "",
                        transition: ""
                    }
                }
                else
                {
                    if (c > 0)
                    {
                        f = {
                            transform: "translateY(0px)",
                            "-webkit-transform": "translateY(0px)",
                            "-webkit-transition": "0.2s ease 0s",
                            transition: "0.2s ease 0s"
                        };
                        d = {
                            transform: "translateY(0px)",
                            "-webkit-transform": "translateY(0px)",
                            "-webkit-transition": "",
                            transition: ""
                        }
                    }
                }
            }
            if (c != 0)
            {
                $("#" + h).css(f);
                setTimeout(function()
                {
                    $("#" + h).css(d)
                }, 200);
                return true
            }
            else
            {
                $("#" + h).css(
                {
                    transform: "translateY(0px)"
                });
                $("#" + h).css(
                {
                    "-webkit-transform": "translateY(0px)"
                });
                return false
            }
        },
        getY: function(e)
        {
            var d = this;
            var c = $("#" + e).css("transform");
            if (!c)
            {
                c = $("#" + e).css("-webkit-transform")
            }
            if (c == "none")
            {
                c = 0
            }
            else
            {
                c = c.replace("translateY(", "").replace(")", "");
                c = parseInt(c, 10)
            }
            if (!c)
            {
                c = 0
            }
            return c
        },
        bind: function()
        {
            var f = this;
            for (var e = 0; e < f.rootIdList.length; e++)
            {
                $("#" + f.rootIdList[e]).on("click", function()
                {
                    if (!f.isload)
                    {
                        f.isload = true;
                        var h = $(this).attr("m_cid");
                        var g = $(this).attr("m_index");
                        var g = parseInt(g, 10);
                        f.getBranch(h);
                        f.scrollTo(g);
                        $(this).parent().find("li").removeClass("cur");
                        $(this).addClass("cur")
                    }
                })
            }
            $("#" + f.loadErrorId).on("click", function()
            {
                var g = $(this).attr("m_cid");
                f.getBranch(g)
            });
            f.rootTouchBind();
            var d = "onorientationchange" in window;
            var c = d ? "orientationchange" : "resize";
            $(window).on(c, function()
            {
                var j = $(window).height();
                var i = j - f.basebodyH;
                var h = 50 * f.rootCount;
                if (i < h)
                {
                    f.scrollRootHeight = h - i;
                    f.scrollOverIndex = parseInt(f.scrollRootHeight / 50, 10);
                    if (f.scrollRootHeight % 50 > 0)
                    {
                        f.scrollOverIndex++
                    }
                    f.scrollOverIndex++
                }
                else
                {
                    f.scrollOverIndex = 0
                }
                f.pageHeight = i;
                $("#" + f.rootListDivlId).css(
                {
                    height: i
                });
                var g = $(window).width();
                $("#" + f.branchScrollId).css(
                {
                    height: i,
                    width: g - 90
                })
            });
            $("#branchList").scroll(function()
            {
                f.imgLazyLad.lazyLad()
            })
        },
        render: function()
        {
            var c = this;
            c.searchLand.render();
            c.bind()
        },
        run: function()
        {
            var c = this;
            c.render()
        }
    });
    a.clazz = b
});
M.define("Imglazyload", function(a)
{
    var b = function(c) {};
    M.object.merge(b.prototype,
    {
        lazyLad: function()
        {
            var h = $(window).height();
            var g = $("img[imgsrc]");
            var f = $(window).scrollTop();
            for (var d = 0, c = g.size(); d < c; d++)
            {
                currentObj = $(g[d]);
                var e = currentObj.offset().top - h - 200;
                if (parseInt(f) >= parseInt(e))
                {
                    currentObj.attr("src", currentObj.attr("imgsrc"));
                    currentObj.removeAttr("imgsrc")
                }
            }
        }
    });
    a.clazz = b
});
M.define("searchland", function(a)
{
    var b = function(c)
    {
        this.init(c)
    };
    M.object.merge(b.prototype,
    {
        init: function(d)
        {
            this.searchHistoryLocalStorageName = "searchhistory";
            this.formId = d.formId ? d.formId : "";
            this.submitId = d.submitId ? d.submitId : "";
            this.catelogyListId = d.catelogyListId ? d.catelogyListId : "";
            this.isHome = d.isHome ? d.isHome : false;
            this.closeSearchLandBtnId = d.closeSearchLandBtnId ? d.closeSearchLandBtnId : "";
            this.claerKeywordBtnId = d.claerKeywordBtnId ? d.claerKeywordBtnId : "";
            this.keywordId = d.keywordId ? d.keywordId : "";
            this.searchPanelId = d.searchPanelId ? d.searchPanelId : "";
            this.keyword = d.keyword ? d.keyword : "";
            this.keyword = M.string.decodeHtml(this.keyword);
            this.oldkeyword = null;
            var c = "searchhistory_";
            this.controlId = M.genId(c);
            this.hotKeyWordId = M.genId(c);
            this.changeHotKeyWordId = M.genId(c);
            this.hotKeyWordheadId = M.genId(c);
            this.hotKeyWordBtnIds = [];
            this.clearHistoryId = M.genId(c);
            this.hotKeyword = d.hotKeyword ? d.hotKeyword : null;
            this.landSearchWordHide = d.landSearchWordHide ? true : false;
            this.hotKeywordIndex = 0;
            this.openSearchLoad = false;
            this.searchliIdList = [];
            this.searchLoop = false;
            this.showFuncObj = d.showFuncObj ? d.showFuncObj : null;
            this.hideFuncObj = d.hideFuncObj ? d.hideFuncObj : null;
            if (this.keyword != "")
            {
                $("#" + this.keywordId).val(this.keyword);
                $("#" + this.keywordId).addClass("hilight1")
            }
        },
        searchLoadControl: function()
        {
            var d = this;
            var c = $("#" + d.keywordId).val().trim();
            if (c == "" && d.searchLoop)
            {
                d.searchLoadFromHistory();
                $("#" + d.claerKeywordBtnId).css(
                {
                    display: "none"
                })
            }
            else
            {
                if (c != "" && d.oldkeyword != c && d.searchLoop)
                {
                    d.searchLoadFromKeyword(c);
                    $("#" + d.claerKeywordBtnId).css(
                    {
                        display: "block"
                    })
                }
            }
            setTimeout(function()
            {
                d.searchLoadControl()
            }, 500)
        },
        searchLoadFromHistory: function()
        {
            var e = this;
            e.searchLoop = false;
            if (!e.searchLocalStorage)
            {
                var c = M.localstorage.get(e.searchHistoryLocalStorageName);
                if (c && c.length > 0 && e.openSearchLoad)
                {
                    c = decodeURIComponent(c);
                    var d = c.split("|");
                    e.searchLandUnbind();
                    $("#" + e.controlId).html(e.searchLandLiHtml(d));
                    $("#" + e.clearHistoryId).parent().css(
                    {
                        display: "block;"
                    });
                    e.searchLandBind(true);
                    e.tipArray = d;
                    $("#" + e.controlId).removeClass("jd-auto-complete");
                    $("#" + e.controlId).children("li").css(
                    {
                        display: "block"
                    });
                    e.searchLoop = true
                }
                else
                {
                    $("#" + e.controlId).html("");
                    e.searchLoop = true
                }
                $("#" + e.hotKeyWordId).show();
                $("#" + e.hotKeyWordheadId).show()
            }
            else
            {
                if (e.openSearchLoad)
                {
                    e.searchLoop = true
                }
            }
            e.searchLocalStorage = true
        },
        searchLoadFromKeyword: function(c)
        {
            var d = this;
            d.searchLoop = false;
            d.oldkeyword = c;
            d.searchLocalStorage = false;
            M.http.ajax(
            {
                url: "/ware/searchSuggestion.action",
                data:
                {
                    keyword: c,
                    _format_: "json"
                },
                success: function(f)
                {
                    if (f && f.searchTipList && d.openSearchLoad)
                    {
                        var e = $.parseJSON(f.searchTipList);
                        if (e.length > 0)
                        {
                            d.searchLandUnbind();
                            $("#" + d.hotKeyWordId).hide();
                            $("#" + d.hotKeyWordheadId).hide();
                            $("#" + d.controlId).html(d.searchLandLiHtml(e));
                            $("#" + d.controlId).addClass("jd-auto-complete");
                            d.searchLandBind(false);
                            d.tipArray = e;
                            $("#" + d.clearHistoryId).parent().css(
                            {
                                display: "none;"
                            });
                            $("#" + d.controlId).children("li").css(
                            {
                                display: "block"
                            })
                        }
                        d.searchLoop = true
                    }
                    else
                    {
                        if (d.openSearchLoad)
                        {
                            d.searchLoop = true
                        }
                    }
                },
                error: function(e)
                {
                    if (d.openSearchLoad)
                    {
                        d.searchLoop = true
                    }
                }
            })
        },
        searchLandLiHtml: function(e)
        {
            var f = this;
            f.searchliIdList = [];
            var h = [];
            for (var d = 0; d < e.length; d++)
            {
                var j = "searchland_li_" + d;
                f.searchliIdList.push(j);
                var g = "";
                var c = "&nbsp;";
                if (M.object.isObject(e[d]))
                {
                    g = e[d].text;
                    if (e[d].otherAttr.tipNumber)
                    {
                        c = e[d].otherAttr.tipNumber
                    }
                }
                else
                {
                    g = e[d]
                }
                h.push('<li style="display:none;" id="' + j + '" searchland_index="' + d + '"><a href="javascript:void(0);"><span>' + g + "</span></a></li>")
            }
            return h.join("")
        },
        searchLandLiFade: function()
        {
            var d = this;
            var c = 0;
            d.searchLandLiRecursiveFade(c, d.searchliIdList.length)
        },
        searchLandLiRecursiveFade: function(c, d)
        {
            var e = this;
            if (c < d)
            {
                $("#" + e.searchliIdList[c]).fadeIn(10, function()
                {
                    var f = c + 1;
                    e.searchLandLiRecursiveFade(f, d)
                })
            }
            else
            {
                e.searchLoop = true
            }
        },
        searchLandUnbind: function()
        {
            var e = this;
            if (e.searchliIdList && e.searchliIdList.length > 0)
            {
                for (var d = 0, c = e.searchliIdList.length; d < c; d++)
                {
                    $("#" + e.searchliIdList[d]).off("click")
                }
            }
        },
        searchLandBind: function(c)
        {
            var f = this;
            if (f.searchliIdList.length > 0)
            {
                var e = c;
                for (var d = 0; d < f.searchliIdList.length; d++)
                {
                    $("#" + f.searchliIdList[d]).on("click", function()
                    {
                        var g = $(this).attr("searchland_index");
                        var h = f.tipArray[g];
                        f.sendMping((e ? "MSearch_HistoryRecords" : "MSearch_SearchDropDownAssociationalWords"));
                        f.searchLandSubmit(h)
                    })
                }
            }
        },
        searchLandSubmit: function(e)
        {
            var d = this;
            var c = null;
            if (M.object.isObject(e))
            {
                c = $.parseJSON(e.value)
            }
            else
            {
                c = {};
                c.keyword = e
            }
            $("#" + d.keywordId).val(c.keyword);
            c.catelogyList && $("#" + d.catelogyListId).val(JSON.stringify(c.catelogyList));
            d.searchLandAddHistory(c.keyword);
            $("#" + d.formId).submit();
            d.searchLoop = false
        },
        searchLandAddHistory: function(l)
        {
            var k = this;
            if ($.trim(l).length > 0 && $.trim(l) != "")
            {
                l = $.trim(l);
                var j = "";
                var f = M.localstorage.get(k.searchHistoryLocalStorageName);
                var e = 0;
                if (f != null)
                {
                    l = k.makeSearchName(l);
                    var c = [l];
                    f = decodeURIComponent(f);
                    var h = f.split("|");
                    for (var d = 0; d < h.length; d++)
                    {
                        if (e == 14)
                        {
                            break
                        }
                        if (h[d] != l)
                        {
                            c.push(h[d])
                        }
                        e++
                    }
                    j = c.join("|")
                }
                else
                {
                    var c = l;
                    j = c
                }
                M.localstorage.set(k.searchHistoryLocalStorageName, encodeURIComponent(j))
            }
        },
        makeSearchName: function(c)
        {
            if (c.length >= 30)
            {
                c = c.substring(0, 30)
            }
            return c
        },
        clearHistory: function()
        {
            var c = this;
            M.localstorage.remove(c.searchHistoryLocalStorageName)
        },
        searchTransformation: function()
        {
            var f = this;
            if (!f.openSearchLoad)
            {
                $("body").removeClass("hide-landing");
                $("body").addClass("show-landing");
                $("body").addClass("history-color");
                var c = $("body").children("div");
                for (var d = 0; d < c.length; d++)
                {
                    if ($(c[d]).attr("id") != "search_land_searchland" && !$(c[d]).attr("search_land_searchTransformation_show"))
                    {
                        $(c[d]).css("display", "none")
                    }
                }
                $("body").children("footer").css("display", "none");
                if (f.showFuncObj && f.showFuncObj.func)
                {
                    var e = f.showFuncObj.source ? f.showFuncObj.source : null;
                    f.showFuncObj.func.call(e)
                }
                $("#" + f.searchPanelId).removeClass("on-blur");
                $("#" + f.searchPanelId).addClass("on-focus");
                window.scrollTo(0, 1);
                f.openSearchLoad = true;
                f.searchLoop = true
            }
            else
            {
                $("body").removeClass("show-landing");
                $("body").removeClass("history-color");
                $("body").addClass("hide-landing");
                var c = $("body").children("div");
                for (var d = 0; d < c.length; d++)
                {
                    if ($(c[d]).attr("id") != "search_land_searchland" && !$(c[d]).attr("search_land_searchTransformation_show"))
                    {
                        $(c[d]).css("display", "block")
                    }
                }
                $("body").children("footer").css("display", "block");
                if (f.hideFuncObj && f.hideFuncObj.func)
                {
                    var e = f.hideFuncObj.source ? f.hideFuncObj.source : null;
                    f.hideFuncObj.func.call(e)
                }
                f.openSearchLoad = false;
                f.searchLoop = false;
                f.searchLocalStorage = false;
                f.oldkeyword = "";
                $("#" + f.controlId).html("");
                $("#" + f.searchPanelId).removeClass("on-focus");
                $("#" + f.searchPanelId).addClass("on-blur");
                $("#" + f.hotKeyWordId).show();
                $("#" + f.hotKeyWordheadId).show()
            }
        },
        searchLandHotKeywordRecursiveFade: function(c, g, d, f)
        {
            var h = this;
            if (d < f)
            {
                for (var e = d; e < f; e++)
                {
                    if (e <= 2)
                    {
                        $(c[e]).parent().addClass("tab-item-1")
                    }
                    else
                    {
                        $(c[e]).parent().addClass("tab-item-2")
                    }
                }
                setTimeout(function()
                {
                    for (var j = d; j < f; j++)
                    {
                        if (j <= 2)
                        {
                            $(c[j]).text(g[j])
                        }
                    }
                }, 310);
                setTimeout(function()
                {
                    for (var j = d; j < f; j++)
                    {
                        if (j <= 2)
                        {
                            $(c[j]).parent().removeClass("tab-item-1")
                        }
                    }
                }, 500);
                setTimeout(function()
                {
                    for (var j = d; j < f; j++)
                    {
                        if (j > 2)
                        {
                            $(c[j]).text(g[j])
                        }
                    }
                }, 410);
                setTimeout(function()
                {
                    for (var j = d; j < f; j++)
                    {
                        if (j > 2)
                        {
                            $(c[j]).text(g[j]);
                            $(c[j]).parent().removeClass("tab-item-2")
                        }
                    }
                }, 750)
            }
        },
        mainHtml: function()
        {
            var e = this;
            var d = [];
            d.push('<div id="search_land_searchland" class="search-lading-area">');
            if (e.hotKeyword && e.hotKeyword.length > 0)
            {
                d.push('<div id="' + e.hotKeyWordheadId + '" class="hot-search-bar"><strong>热搜</strong><span id="' + e.changeHotKeyWordId + '"><i></i>换一批</span></div>');
                d.push('<div id="' + e.hotKeyWordId + '" class="landing-tags">');
                for (var c = 0; c < 6 && c < e.hotKeyword.length; c++)
                {
                    e.hotKeywordIndex = c;
                    var f = "hotKeyWordBtn_" + c;
                    e.hotKeyWordBtnIds.push(f);
                    d.push('<a id="' + f + '" href="javascript:void(0);"><span>' + e.hotKeyword[c] + "</span></a>")
                }
            }
            d.push("</div>");
            d.push('<ul id="' + e.controlId + '" class="landing-keywords">');
            d.push("</ul>");
            d.push('<div class="landing-clear" style="display:none;"><span id="' + e.clearHistoryId + '">清空历史搜索</span></div>');
            d.push("</div>");
            return d.join("")
        },
        sendMping: function(d)
        {
            try
            {
                var f = new MPing.inputs.Click(d);
                f.event_param = "";
                var c = new MPing();
                c.send(f)
            }
            catch (g)
            {}
        },
        render: function()
        {
            var d = this;
            var e = $("#footer").length > 0 ? $("#footer") : $("footer");
            $(e).before(d.mainHtml());
            $("body").addClass((d.isHome ? "mhome" : "mlist"));
            $("body").addClass("hide-landing");
            $("#" + d.keywordId).on("click", function(g)
            {
                var f = null;
                if (d.isHome)
                {
                    if (d.openSearchLoad)
                    {
                        f = "MSearch_Search"
                    }
                    else
                    {
                        f = "MHome_Search"
                    }
                }
                else
                {
                    f = "MProductList_Search"
                }
                d.sendMping(f);
                if (!d.openSearchLoad)
                {
                    if (d.landSearchWordHide)
                    {
                        $("#" + d.keywordId).val("")
                    }
                    else
                    {
                        $("#" + d.keywordId).val(d.keyword)
                    }
                    d.searchTransformation()
                }
            });
            $("#" + d.keywordId).on("keydown", function(g)
            {
                if (g.keyCode == "13")
                {
                    var f = $.trim($("#" + d.keywordId).val());
                    if (f != "")
                    {
                        d.sendMping("MSearch_Searchthi");
                        d.searchLandSubmit(f)
                    }
                }
                return
            });
            $("#" + d.closeSearchLandBtnId).on("click", function()
            {
                if (d.openSearchLoad)
                {
                    d.searchTransformation();
                    $("#" + d.keywordId).val(d.keyword);
                    $("#" + this.keywordId).addClass("hilight1")
                }
            });
            $("#" + d.clearHistoryId).on("click", function()
            {
                d.sendMping("MSearch_ClearHistory");
                d.clearHistory();
                $("#" + d.controlId).html("");
                $("#" + d.clearHistoryId).parent().css(
                {
                    display: "none;"
                })
            });
            $("#" + d.submitId).on("click", function()
            {
                var g = $.trim($("#" + d.keywordId).val());
                if (g != "")
                {
                    var f = null;
                    if (d.isHome)
                    {
                        if (d.openSearchLoad)
                        {
                            f = "MSearch_SearchButton"
                        }
                        else
                        {
                            f = "MHome_SearchButton"
                        }
                    }
                    else
                    {
                        f = "MSearch_SearchButton"
                    }
                    d.sendMping(f);
                    d.searchLandSubmit(g)
                }
            });
            $("#" + d.claerKeywordBtnId).on("click", function()
            {
                $("#" + d.keywordId).val("");
                $(this).css(
                {
                    display: "none;"
                })
            });
            $("#" + d.keywordId).on("keyup", function()
            {
                if ($(this).val() != d.keyword)
                {
                    $(this).removeClass("hilight1");
                    $(this).addClass("hilight2")
                }
                else
                {
                    $(this).removeClass("hilight2");
                    $(this).addClass("hilight1")
                }
            });
            if (d.hotKeyWordBtnIds.length > 0)
            {
                for (var c = 0; c < d.hotKeyWordBtnIds.length; c++)
                {
                    $("#" + d.hotKeyWordBtnIds[c]).on("click", function()
                    {
                        var f = $.trim($(this).find("span").text());
                        if (f != "")
                        {
                            d.sendMping("MSearch_HotWords");
                            d.searchLandSubmit(f)
                        }
                    })
                }
            }
            if (d.hotKeyword && d.hotKeyword.length > 0)
            {
                $("#" + d.changeHotKeyWordId).on("click", function()
                {
                    var g = 0;
                    var k = [];
                    for (var h = d.hotKeywordIndex + 1, f = h + 6; h < f && h < d.hotKeyword.length; h++)
                    {
                        g++;
                        d.hotKeywordIndex = h;
                        k.push(d.hotKeyword[h])
                    }
                    if (g < 6)
                    {
                        for (var h = 0, f = 6 - g; h < f && h < d.hotKeyword.length; h++)
                        {
                            g++;
                            d.hotKeywordIndex = h;
                            k.push(d.hotKeyword[h])
                        }
                    }
                    var l = $("#" + d.hotKeyWordId).children().find("span");
                    $("#" + d.hotKeyWordheadId).addClass("rotate");
                    setTimeout(function()
                    {
                        $("#" + d.hotKeyWordheadId).removeClass("rotate")
                    }, 500);
                    d.sendMping("MSearch_ChangeKeyWords");
                    d.searchLandHotKeywordRecursiveFade(l, k, 0, g)
                })
            }
            d.searchLoadControl()
        }
    });
    a.clazz = b
});
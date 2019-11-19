//主界面操作
(function ($) {
    $.project = (function () {
        return {
            //添加我的桌面选项卡
            addDesktopTab: function () {
               parent.$.project.addToMainTabs("", "/Desktop/Index", "", false);
            },
            //单击左侧菜单树
            clickMainMenuNode: function (node) {
                console.info(node.attributes.url);
                if (!node.attributes)
                    return;
                if (!node.attributes.url)
                    return;
                //如果菜单tab已存在，则不添加tab，并选中
                if ($('#divMainTabs').tabs("exists", node.text)) {
                    $('#divMainTabs').tabs("select", node.text);
                } else {
                    $.project.addToMainTabs(node.text, node.attributes.url, node.iconCls, true);
                }
            },
            //添加主界面选项卡
            addToMainTabs: function (txt, url, icon, closable) {
                $.easyui.addIframeToTabs("divMainTabs", txt, url, icon, closable);
                var tabs = $('#divMainTabs');
                bindTabsMenu();
                bindTabsDbClick();

                //绑定选项卡右键菜单
                function bindTabsMenu() {
                    tabs.tabs({
                        onContextMenu: function (e, title, index) {
                            $.easyui.showMenu(getMenuId(), e);
                            tabs.tabs('select', index);

                            //获取选项卡菜单Id
                            function getMenuId() {
                                return index === 0 ? "divDesktopTabsMenu" : "divTabsMenu";
                            }
                        }
                    });
                }

                //绑定选项卡双击事件
                function bindTabsDbClick() {
                    $(".tabs-inner").unbind("dblclick");
                    $(".tabs-inner").dblclick(function () {
                        var selectedTab = tabs.tabs('getSelected');
                        var selectedIndex = tabs.tabs('getTabIndex', selectedTab);
                        if (selectedIndex === 0)
                            return;
                        tabs.tabs('close', selectedIndex);
                    });
                }
            },
            //绑定选项卡按钮工具事件
            bindTabClick: function () {
                var tabs = $('#divMainTabs');
                $('#btnReload').bind('click', function () {
                    reloadCurrent();
                });
                $('#btnCloseCurrent').bind('click', function () {
                    CloseCurrent();
                });
                var reloadCurrent = function () {
                    var selectTitle = tabs.tabs('getSelected').panel('options').title;
                    if (selectTitle == "我的桌面")
                        return;
                    var divIframe = tabs.tabs('getSelected').find("iframe");
                    divIframe.get(0).contentWindow.$("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(divIframe.get(0).contentWindow).height() }).appendTo("body");
                    divIframe.get(0).contentWindow.$("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候...").appendTo("body").css({ display: "block", left: (divIframe.get(0).contentWindow.document.documentElement.clientWidth - 190) / 2, top: (divIframe.get(0).contentWindow.document.documentElement.clientHeight - 45) / 2 });
                    divIframe.get(0).src = divIframe.get(0).src;
                };
                var CloseCurrent = function () {
                    var selectTitle = tabs.tabs('getSelected').panel('options').title;
                    if (selectTitle == "") {
                        return;
                    }
                    else if (selectTitle == "我的桌面"){
                        return;
                    }
                    tabs.tabs("close", selectTitle);
                    if (window.CollectGarbage) CollectGarbage();
                }
            },
            //绑定选项卡菜单单击事件
            bindTabsMenuClick: function () {
                var tabs = $('#divMainTabs');
                bindMenuClick('divTabsMenu');
                bindMenuClick('divDesktopTabsMenu');

                function bindMenuClick(contextMenuId) {
                    $('#' + contextMenuId).menu({
                        onClick: function (item) {
                            var allTabs = tabs.tabs('tabs');
                            var selectedTab = tabs.tabs('getSelected');
                            var selectedIndex = tabs.tabs('getTabIndex', selectedTab);
                            command(item.id);

                            //执行命令
                            function command(id) {
                                switch (id) {
                                    case "menuItem_Refresh":
                                        return refresh();
                                    case "menuItem_CloseCurrent":
                                        return closeCurrent();
                                    case "menuItem_CloseOther":
                                        return closeOther();
                                    case "menuItem_CloseAll":
                                        return closeAll();
                                }
                                return true;
                            }

                            //刷新选项卡
                            function refresh() {
                                $.easyui.refreshTabs("divMainTabs");
                            }

                            //关闭当前
                            function closeCurrent() {
                                tabs.tabs('close', selectedIndex);
                                if (window.CollectGarbage) CollectGarbage();
                                
                            }

                            //关闭其它
                            function closeOther() {
                                close(function (i) {
                                    return i === 0 || i === selectedIndex;
                                });
                                tabs.tabs('select', 1);
                            }

                            //关闭窗口
                            function close(ignore) {
                                $(allTabs).each(function (i, tab) {
                                    if (!ignore(i)) {
                                        var index = tabs.tabs('getTabIndex', tab);
                                        tabs.tabs('close', index);
                                        if (window.CollectGarbage) CollectGarbage();
                                    }
                                });
                            }

                            //关闭全部
                            function closeAll() {
                                close(function (i) {
                                    return i === 0;
                                });
                            }
                        }
                    });
                }
            }
        };
    })();
})(jQuery);

$(function () {
    //主界面初始化操作
    $.project.addDesktopTab();
    $.project.bindTabsMenuClick();
    $.project.bindTabClick();
    $("#mm").find("div").each(function () {
        $(this).bind("click", function () {
            var skinText = $.trim($(this).text());
            document.getElementById("skin").href = "/Scripts/EasyUi/themes/" + skinText + "/easyui.css";
            setTimeout(function () {
                $("#top").css("background-color", $(".panel-body").eq(6).css("background-color"));
            }, 200);
            var divIframe = $("iframe");
            if (divIframe.length == 0)
                return;
            $.each(divIframe, function () {
                divIframe.get(0).contentWindow.document.getElementById("skin").href = "/Scripts/EasyUi/themes/" + skinText + "/easyui.css";
            });
        });
    });

});

//折叠
var Fold = function () {
    $("#divMain").layout('collapse', 'north');
};
//全屏
//var isOpen = false;
//var FullScreen = function () {
//    if (isOpen) {
//        $("#divMain").layout('expand', 'north').layout('expand', 'west');
//        isOpen = false;
//    }
//    else {
//        $("#divMain").layout('collapse', 'north').layout('collapse', 'west');
//        isOpen = true;
//    }
//};
//浏览器全屏
var 

F11FullScreen = function () {
    if ($.util.supportsFullScreen) {
        if ($.util.isFullScreen()) {
            $.util.cancelFullScreen();
        } else {
            $.util.requestFullScreen();
        }
    } else {
        $.messager.alert("提示","当前浏览器不支持全屏 API，请更换至最新的 Chrome/Firefox/Safari 浏览器或通过 F11 快捷键进行操作。","error");
       
    }
}




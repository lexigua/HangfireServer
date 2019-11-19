var EMS = {
    CreateNameSpace: function () {
        var nameSpaceObjec = arguments[0].split('.');
        var currentNameSpaceName = "";
        $.each(nameSpaceObjec, function (index, item) {
            if (index == 0) {
                currentNameSpaceName = item;
            } else {
                currentNameSpaceName += '.' + item;
            }
            var evalStr = "if(typeof " + currentNameSpaceName + "=='undefined'){" + currentNameSpaceName + "={}; }";
            eval(evalStr);
        });
    }
};
EMS.CreateNameSpace("EMS.DataFormCommonMethods");
EMS.CreateNameSpace("EMS.UserLoginInfo");
EMS.UserLoginInfo.RoleID = '';
(function (f) {
    //删除datagrid元素
    f.DeleteGridItem = function (gridId, deleteurl) {
        var selectedItem = $("#" + gridId).datagrid("getSelected");
        if (selectedItem != null) {
            var sampleNumber = selectedItem["SampleNumber"];
            if (sampleNumber == "空白" || sampleNumber == "空白'") {
                $.messager.alert("提示", "不能删除空白样！", "error");
                return false;
            }
            if (sampleNumber.indexOf("'") <= 0) {
                $.messager.alert("提示", "不能删除原始数据！", "error");
                return false;
            }
            $.messager.confirm("确认", "确定要删除该条记录？", function (confirm) {
                if (confirm) {
                    if (selectedItem["Id"] == null) {
                        var index = $("#" + gridId).datagrid("getRowIndex", selectedItem);
                        $("#" + gridId).datagrid("deleteRow", index);
                        $.messager.alert("提示", "删除成功！");
                    }
                    else {
                        $.ajax({
                            url: deleteurl,
                            data: { id: selectedItem["Id"] },
                            type: "POST",
                            success: function (result) {
                                $.messager.alert("提示", "删除成功！");
                                $("#" + gridId).datagrid("reload");
                            }
                        });
                    }
                }
            });
        }
        else {
            $.messager.alert("提示", "请选择要删除的行！", "error");
        }
    }

    //加载等待遮罩 text-提示信息
    f.ShowLoadingMaskLayer = function (text) {
        var htmlContent = '<div id=\"masklayer\">' +
            '<div id=\"covered\" style=\"position:fixed;_position:absolute;z-index:8888;top:0px; left:0px;width:100%;height:100%;background-color:#696969;opacity:0.3;\">' +
            '</div>' +
            '<div id=\"poplayer\" style=\" position:absolute;top:46%;left:46%;width:130px; height:42px;z-index:9999; background-color:#ffffff;border:3px solid #95B8E7;\">' +
            '<img src=\"/Scripts/Projects/icons/ico_loading2.gif\" style="position:absolute;top:10px;left:10px;width:22px;height:22px;\"/>' +
            '<span style=\"position:absolute;top:15px;left:52px;\" id=\"masklayertext\">' + text + '...</span>' +
            '</div>' +
            '</div>';
        $("#masklayerDiv").html(htmlContent);
    }

    //关闭加载等待遮罩
    f.CloseLoadingMaskLayer = function () {
        $("#masklayerDiv").html("");
    }

    //提交成功处理
    f.AnalysissubmitSuccess = function () {
        f.CloseLoadingMaskLayer();
        var tabs = parent.$('#divMainTabs');
        var selectedTab = tabs.tabs('getSelected');
        var selectedIndex = tabs.tabs('getTabIndex', selectedTab);
        var tab = tabs.tabs('getTab', "实验室分析");
        tab.find("iframe").get(0).contentWindow.gridRefresh();
        tabs.tabs('close', selectedIndex);
        tabs.tabs('select', '实验室分析');
        $.easyui.removeLoading();
    }

    //序列化form数据
    f.GetFormData = function (formId, dataFailed, jsonData) {
        var array = $("#" + formId).serializeArray();
        $(array).each(function (i, o) {
            var n = o.name, v = o.value;
            jsonData[dataFailed + "." + n] = v;
        });
        return jsonData;
    }

    //序列化grid数据
    f.GetGridData = function (gridname, datafailed, jsondata) {

        var grid = $("#" + gridname);
        var addList = grid.datagrid("getChanges");
        $.each(addList, function (i, o) {
            o.InfoGroupName = gridname;
            for (var p in o) {
                jsondata[datafailed + "[" + i + "]." + p] = addList[i][p];
            }
        });
        return jsondata;
    }

    //添加token
    f.AddAntiForgeryToken = function (data) {
        data.__RequestVerificationToken = $('#form input[name=__RequestVerificationToken]').val();
        return data;
    };


    //格式化数字例如：1->1.0
    f.formatNumber1 = function (value, row, index) {
        if (value != null && value != "") {
            return f.KeepASmallDigita(value, 1);
        } else if (value === 0 || value === "0") {
            return "0.0";
        }
    }
    //格式化数字例如：1->1.00
    f.formatNumber2 = function (value, row, index) {
        if (value != null && value != "") {
            return f.KeepASmallDigita(value, 2);
        } else if (value === 0 || value === "0") {
            return "0.00";
        }
    }
    //格式化数字例如：1->1.000
    f.formatNumber3 = function (value, row, index) {
        if (value != null && value != "") {
            return f.KeepASmallDigita(value, 3);
        } else if (value === 0 || value === "0") {
            return "0.000";
        }
    }
    //格式化数字例如：1->1.0000
    f.formatNumber4 = function (value, row, index) {
        if (value != null && value != "") {
            return f.KeepASmallDigita(value, 4);
        } else if (value === 0 || value === "0") {
            return "0.0000";
        }
    }
    //禁用form表单中所有的input[文本框、复选框、单选框],select[下拉选],多行文本框[textarea]

    f.disableForm = function (formId, isDisabled) {
        //console.info(formId)
        var attr = "disable";
        if (!isDisabled) {
            attr = "enable";
        }
        $("form[id='" + formId + "'] :text").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] textarea").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] select").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] :radio").attr("disabled", isDisabled);
        $("form[id='" + formId + "'] :checkbox").attr("disabled", isDisabled);
        if (isDisabled) {
            //禁用formId中的下拉按钮
            $("#" + formId + " a[class=\"textbox-icon combo-arrow\"]").addClass("textbox-icon-disabled");
            //禁用formId中的搜索按钮
            $("#" + formId + " a[class=\"textbox-icon icon-search\"]").addClass("textbox-icon-disabled");
        }
    }

    f.AddWaitCheckStyle = function (colIndex) {
        var gridtr = $(".datagrid-view2>.datagrid-body>.datagrid-btable").find("tr");
        $.each(gridtr, function (index, item) {
            var tds = $(item.innerHTML);
            if (tds.length > 0) {
                var isPass = tds[colIndex].innerText;
                if (isPass == "审核") {
                    $(this).css("background-color", "#4190ec").css("color", "yellow");
                }
            }
        });
    }

    f.PointFloat = function (src, pos) {
        return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    }

    //提交高压项目数据
    f.SumbmitHvFormData = function (subform, controller, propertyDtoName) {
        if (!$("#" + subform).form("validate") || !$("#PropertyForm").form("validate") || !$("#AppendixForm").form("validate")) {
            return false;
        }
        $.easyui.showLoadingByStr("保存中...");
        var jsonData = $("#" + subform).serializeJson();
        jsonData = EMS.DataFormCommonMethods.GetFormData("PropertyForm", propertyDtoName, jsonData);
        jsonData = EMS.DataFormCommonMethods.GetFormData("AppendixForm", "CommonReportProjectAppendix", jsonData);
        $.post("/ProjectLib/" + controller + "/save", EMS.DataFormCommonMethods.AddAntiForgeryToken(jsonData), function (result) {
            $.easyui.showFormMessage(result);
            if (result.Code === $.easyui.state.ok) {
                $.easyui.getById("grid").datagrid("reload");
                $.easyui.closeDialog();
            }
            $.easyui.removeLoading();
        }, "json");
    }


}(EMS.DataFormCommonMethods));

function DataSend(isSend, controller, taskID, sampleCodeStr) {

    var isCreate = taskID != "" && taskID != null;
    if (!$("#form").form("validate")) {
        $.easyui.topShow("请填写必要项信息", "提示");
        return;
    }
    $.easyui.showLoadingByStr("采样单保存中，请稍等……");
    var jsondata = $("#form").serializeJson();
    //var dataform = new FormData($("#form")[0]);
    jsondata["IsSend"] = isSend;
    jsondata["SampleCodeStr"] = sampleCodeStr;
    //dataform.append("IsSend", isSend);
    var grid = $("#grid");
    if (!isCreate) {
        var addList = grid.datagrid("getRows");
        $.each(addList, function (i, o) {
            for (var p in o) {
                jsondata["AddTableDto[" + i + "]." + p] = addList[i][p] == null ? "" : addList[i][p];
            }
        });
    } else {
        GetSmapeGridData('grid', jsondata);
    }
    //$.ajax({
    //    url: "/DataForm/" + controller + "/save",
    //    type: "POST",
    //    data: jsondata,
    //    cache: false,
    //    processData: false,
    //    contentType: false
    //}).done(function (ret) {
    //    $.easyui.showFormMessage(ret);
    //    $.easyui.removeLoading();
    //    submitSuccess();
    //});
    $.post("/DataForm/" + controller + "/Save", jsondata, function (result) {
        $.easyui.showFormMessage(result);
        $.easyui.removeLoading();
        if (result.Code !== $.easyui.state.ok) {
            return;
        } else {
            submitSuccess();
        }
    }, "json");
}
function GetSmapeGridData(gridname, jsondata) {
    var grid = $("#" + gridname);
    var addList = grid.datagrid("getChanges", "inserted");
    var updateList = grid.datagrid("getChanges", "updated");
    var deleteList = grid.datagrid("getChanges", "deleted");
    $.each(addList, function (i, o) {
        for (var p in o) {
            jsondata["AddTableDto[" + i + "]." + p] = addList[i][p];
        }
    });
    $.each(updateList, function (i, o) {
        for (var p in o) {
            jsondata["UpdateTableDto[" + i + "]." + p] = updateList[i][p];
        }
    });
    $.each(deleteList, function (i, o) {
        for (var p in o) {
            jsondata["DeleteTableDto[" + i + "]." + p] = deleteList[i][p];
        }
    });
    return jsondata;
}

function submitSuccess() {
    var tabs = parent.$('#divMainTabs');
    var selectedTab = tabs.tabs('getSelected');
    var selectedIndex = tabs.tabs('getTabIndex', selectedTab);
    var tab = tabs.tabs('getTab', "数据审核");
    tab.find("iframe").get(0).contentWindow.gridRefresh();
    tabs.tabs('close', selectedIndex);
    tabs.tabs('select', '数据审核');
}

function checkSuccess(result) {
    $.easyui.removeLoading();
    $.easyui.showFormMessage(result);
    var tabs = parent.$('#divMainTabs');
    var selectedTab = tabs.tabs('getSelected');
    var selectedIndex = tabs.tabs('getTabIndex', selectedTab);
    //var tab = tabs.tabs('getTab', selectedIndex - 1);
    tabs.tabs('close', selectedIndex);
    //tabs.tabs('select', selectedIndex - 1);
    //tab.find("iframe").get(0).contentWindow.gridRefresh();
    //刷新
    //gridRefresh(tabs);
    var divIframe = tabs.tabs('getSelected').find("iframe");
    //divIframe.get(0).contentWindow.$("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(divIframe.get(0).contentWindow).height() }).appendTo("body");
    divIframe.get(0).contentWindow.$("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候...").appendTo("body").css({ display: "block", left: (divIframe.get(0).contentWindow.document.documentElement.clientWidth - 190) / 2, top: (divIframe.get(0).contentWindow.document.documentElement.clientHeight - 45) / 2 });
    divIframe.get(0).src = divIframe.get(0).src;
}

//刷新
function gridRefresh(tabs) {
    var divIframe = tabs.tabs('getSelected').find("iframe");
    divIframe.get(0).contentWindow.$("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(divIframe.get(0).contentWindow).height() }).appendTo("body");
    divIframe.get(0).contentWindow.$("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候...").appendTo("body").css({ display: "block", left: (divIframe.get(0).contentWindow.document.documentElement.clientWidth - 190) / 2, top: (divIframe.get(0).contentWindow.document.documentElement.clientHeight - 45) / 2 });
    divIframe.get(0).src = divIframe.get(0).src;
}

function checkSub() {
    $(".datagrid-cell").css({ "white-space": "normal", "height": "auto", "white-space": "nowrap", "width": "100%", "text-overflow": "ellipsis" });
}


function fomatDate(val) {
    if (val !== null) {
        return val.split("T")[0];
    }
    return "";
}
function SearchDataGrid(gridId, formId, url) {
    if (formId == undefined || formId == null || formId == "") formId = "formQuery";
    if (url == undefined || url == null || url == "") url = "";
    if (gridId == undefined || gridId == null || gridId == "") gridId = "grid";
    var array = new Array();
    var searchs = $("#" + formId).find("input[type='hidden'],.textbox-value");
    $.each(searchs, function (index, item) {
        var name = $(item).attr("name");
        var value = $.trim($(item).val());
        if (value.length > 0) {
            var obj = new Object;
            obj.PropertyName = name;
            obj.PropertyValue = value;
            obj.QureyType = $("#" + name).attr("query-type");
            obj.SearchType = $("#" + name).attr("search-type");
            array.push(obj);
            //array.push($(item).attr("id") + "~" + $(item).attr("search-string") + "~" + value + "~" + $(item).attr("search-type"));
        }
    });
    if (url == "") {
        $("#" + gridId).datagrid("load", { filter: JSON.stringify(array) });
    } else {
        $("#" + gridId).datagrid({ url: url, queryParams: { filter: JSON.stringify(array) } });
    }
}
function SearchTreeGrid(gridId, formId, url) {
    if (formId == undefined || formId == null || formId == "") formId = "formQuery";
    if (url == undefined || url == null || url == "") url = "";
    if (gridId == undefined || gridId == null || gridId == "") gridId = "grid";
    var array = new Array();
    var searchs = $("#" + formId).find("input[type=hidden].textbox-value");
    $.each(searchs, function (index, item) {
        var name = $(item).attr("name");
        var value = $.trim($(item).val());
        if (value.length > 0) {
            var obj = new Object;
            obj.PropertyName = name;
            obj.PropertyValue = value;
            obj.QureyType = $("#" + name).attr("query-type");
            obj.SearchType = $("#" + name).attr("search-type");
            array.push(obj);
            //array.push($(item).attr("id") + "~" + $(item).attr("search-string") + "~" + value + "~" + $(item).attr("search-type"));
        }
    });
    if (url == "") {
        $("#" + gridId).treegrid("load", { filter: JSON.stringify(array) });
    } else {
        $("#" + gridId).treegrid({ url: url, queryParams: { filter: JSON.stringify(array) } });
    }
}
Date.prototype.formatDate = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

var getPublicKey = function () {
    var publicKey = "";
    if ($.cookie("publicKey2") == undefined || $.cookie("publicKey2") === "null") {
        var current = new Date().getTime();
        $.ajax({
            url: "/Login/GetRsaPublicKey?id=" + current,
            type: "get",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            async: false,
            data: {},
            dataType: "json",
            success: function (data) {
                if (data.Code == 0) {
                    publicKey = data.RsaPublicKey + "," + data.Key;
                    $.cookie("publicKey2", publicKey);// 此处存储时间应该小于后台缓存时间
                } else {
                    return null;
                }
            }
        });

    } else {
        publicKey= $.cookie("publicKey2");
    }
    return publicKey;
}

var rsaEncrypt = function (pwd1, pwd2, pwd3) {
    $.cookie("publicKey2", null);
    var publicKey = getPublicKey();
    setMaxDigits(129);
    var rsaKey = new RSAKeyPair(publicKey.split(",")[0], "", publicKey.split(",")[1]);
    var pwdRtn1 = encryptedString(rsaKey, pwd1);
    var pwdRtn2 = encryptedString(rsaKey, pwd2);
    var pwdRtn3 = encryptedString(rsaKey, pwd3);
    return pwdRtn1 + "," + pwdRtn2 + "," + pwdRtn3 + "," + publicKey.split(",")[2];
}

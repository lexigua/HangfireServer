//公用变量
//导出文件地址
//var downExportUrl = "http://localhost:9010";
var downExportUrl = window.location.protocol + "//" + window.location.host;

//文件下载
var openUrl = "";

//判断是否包含
String.prototype.contains = function (value) {
    if (!value)
        return false;
    return this.toLowerCase().indexOf(value.toLowerCase()) != -1;
}
//判断起始匹配
String.prototype.startsWith = function (value) {
    if (!value)
        return false;
    return new RegExp("^" + value.toLowerCase()).test(this.toLowerCase());
}
//判断结束匹配
String.prototype.endsWith = function (value) {
    if (!value)
        return false;
    return new RegExp(value.toLowerCase() + "$").test(this.toLowerCase());
}
//从起始位置开始截断
String.prototype.trimStart = function (value) {
    value = ("(" + value + ")");
    return this.replace(new RegExp("^" + value + "*", "g"), "");
};
//格式化日期
Date.prototype.format = function (formatString) {
    ///	<summary>
    ///	格式化日期
    ///	</summary>
    ///	<param name="formatString" type="String">
    ///	格式化字符串，可选值：
    /// (1) y : 年
    /// (2) M : 月
    /// (3) d : 日 
    /// (4) H : 时 
    /// (5) m : 分
    /// (6) s : 秒
    /// (7) S : 毫秒
    ///	</param>
    ///	<returns type="String" />
    var dateobj = this;
    dateobj.setHours(dateobj.getHours() - 8);      //时间矫正
    var options = {
        "M+": dateobj.getMonth() + 1,
        "d+": dateobj.getDate(),
        "H+": dateobj.getHours(),
        "m+": dateobj.getMinutes(),
        "s+": dateobj.getSeconds(),
        "S": dateobj.getMilliseconds()
    };
    if (/(y+)/.test(formatString))
        formatString = formatString.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var option in options) {
        if (new RegExp("(" + option + ")").test(formatString)) {
            var value = options[option];
            formatString = formatString.replace(RegExp.$1, (RegExp.$1.length == 1) ? (value) : (("00" + value).substr(("" + value).length)));
        }
    }
    return formatString;
}
//数组是否包含指定元素
Array.prototype.contains = function (item) {
    return $.inArray(item, this) != -1;
}
//移除数组指定元素
Array.prototype.remove = function (item) {
    var index = $.inArray(item, this);
    if (index == -1)
        return;
    this.splice(index, 1);
}
//去除空格
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

//检查文本框是否为空
function InspectNull(Elem) {
    if ($("#" + Elem).val() == "") {
        return false;
    }
    return true;
}
function InspectNullCombox(Elem) {
    if ($("#" + Elem).combobox("getValue") == "") {
        return false;
    }
    return true;
}
//获取时间
function GetDateNow() {
    var NowDate = new Date();
    return [NowDate.getFullYear(), NowDate.getMonth() + 1, NowDate.getDate(), NowDate.getHours(), NowDate.getMinutes()];
}
//打开其它Tab页面
function GoOtherTabs(TabName, Url, Other, State) {
    //$.project.addToMainTabs("我的消息", "/PersonalBusiness/PersonalMessage/Index", "", true);
    parent.$.project.addToMainTabs(TabName, Url, Other, status);
}


//=======消息
//文件下载
function MessageDownloadFile(value, row, index) {
    if (value != null) {
        return "<a href='/PersonalBusiness/PersonalMessage/DownloadFile/" + row["Id"] + "' class='DownLoadFile'>下载</a>";
    } else {
        return "";

    }
}
//消息查看
function RedirPage(value, row, index) {
    if (value != "" && value != null) {

        return "<a href=\"javascript:void(0)\" onclick=\"GoOtherTabs('" + row.MessageTitle + "','" + value + "','','true')\" class='DownLoadFile'>点击查看</a>";
    }
    else {
        return "";
    }
}
//=======消息

//判断该角色按钮权限
function CheckRolePrivilege(elem) {
    var btnArray = new Array();
    var btnLen = $("#" + elem).find("a").length;
    for (var i = 0; i < btnLen; i++) {
        btnArray[i] = $("#" + elem).find("a").eq(i).attr("id");
    }
    var DomStr = $("#divMainTabs").context.URL;
    var JStr = $("#divMainTabs").context.origin;
    var FLen = JStr.length;
    //菜单url
    var MenuUrl = DomStr.substring(FLen, DomStr.length);
    //返回该角色下各个菜单的所有按钮Id
    $.post("/Systems/SystemPrivilege/GetPrivilegeByUserMenuId/", { menururl: MenuUrl }, function (data) {
        if (data != "T") {
            var dataStr = data;
            for (var j = 0; j < btnArray.length; j++) {
                var IsHaveBtn = dataStr.indexOf(btnArray[j]);
                //判断是否启用该按钮
                if (IsHaveBtn < 0) {
                    $("#" + btnArray[j]).css({ "display": "none" });
                    //移除点击事件
                    $("#" + btnArray[j]).removeAttr("onclick").bind("click", function () {
                        $.messager.alert("系统消息", "无权限!", "error");
                    });
                }
            }
        }
    }, "json");
}


//检查右键菜单权限
//function checkMenuPri(element) {
//    var btnLen = $("#" + element).children("div").length;
//    var btnArray = new Array();
//    for (var i = 1; i < btnLen; i++) {
//        btnArray[i] = $("#" + element).children("div").eq(i).attr("id");
//    }
//    var domStr = $("#divMainTabs").context.URL;
//    var jStr = $("#divMainTabs").context.origin;
//    var fLen = jStr.length;
//    var menuUrl = domStr.substring(fLen, domStr.length);
//    $.ajax({
//        type: "Post",
//        url: "/Systems/SystemPrivilege/GetPrivilegeByUserMenuId/",
//        data: { menururl: menuUrl },
//        datatype: "json",
//        async: false,
//        success: function (result) {
//            if (result != "T") {
//                var dataStr = result;
//                for (var j = 0; j < btnArray.length; j++) {
//                    var isHaveBtn = dataStr.indexOf(btnArray[j]);
//                    if (isHaveBtn < 0) {
//                        //$("#" + btnArray[j]).css({ "display": "none" });
//                        $("#" + btnArray[j]).removeAttr("onclick").bind("click", function () {
//                            $.messager.alert("系统消息", "无权限!", "error");
//                        });
//                    }
//                }
//            }
//        },
//        error: function (ex) {
//            $.messager.alert("提示", "网络错误！", "info");
//        }
//    });
//}

//清空所有表单元素
function ClearQuery(elem, action) {
    if (action == "" || action == null) {
        //清空要提交的所有表单元素
        $("#" + elem).form("clear");

    } else if (action == 1) {
        //清空某个表单元素
        $("#" + elem).textbox("setValue", "");

    } else if (action == 2) {
        //清空表单中所有input标签元素值
        $("#" + elem).find("input").textbox("setValue", "");
    }
}

//star 时间
//检查开始时间不能大于当天
function CheckDateBegin(elem) {
    $('#' + elem).datebox().datebox('calendar').calendar({
        validator: function (date) {
            var now = new Date();
            var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return d1 >= date;
        }
    });
}
//检查结束时间不能小于当天
function CheckDateEnd(elem) {
    $('#' + elem).datebox().datebox('calendar').calendar({
        validator: function (date) {
            var now = new Date();
            var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return d1 <= date;
        }
    });
}

//检查结束时间不能小于开始时间
function CheckEndToStar2(newDate, endE) {
    var newdate = new Date(newDate);
    $('#' + endE).datebox().datebox('calendar').calendar({
        validator: function (date) {
            var d1 = new Date(newdate.getFullYear(), newdate.getMonth(), newdate.getDate());
            return d1 <= date;
        }
    });
}
//检查结束时间不能小于开始时间
function CheckEndToStar(starD, endE) {
    if (parseInt(GetSystemDate()) - DateToStr(resultUDate(starD)) > 0) {
        //用户选择的开始时间小于当前时间
        $('#' + endE).datebox().datebox('calendar').calendar({
            validator: function (date) {
                var now = new Date();
                var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                var d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - starD);
                return d2 <= date && date <= d1;
            }
        });
    } else {
        $('#' + endE).datebox().datebox('calendar').calendar({
            validator: function (date) {
                var now = new Date();
                var d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - starD);
                return d2 <= date;
            }
        });
    }

}
//返回用户选择的时间与系统时间的间隔天数
function GetDateDiff(starE) {
    var startTime = new Date(Date.parse(starE.replace(/-/g, "/"))).getTime();
    var endTime = new Date(Date.parse(GetSystemDate(1))).getTime();
    var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
    return parseInt(dates, 0);
}


//返回用户选择的时间
function resultUDate(starD) {
    var resdate = new Date();
    resdate.setDate(resdate.getDate() - starD);
    var yearstr = resdate.getFullYear();
    var monthstr = (resdate.getMonth() + 1) < 10 ? "0" + (resdate.getMonth() + 1) : (resdate.getMonth() + 1);//获取当前月份的日期，不足10补0
    var datestr = resdate.getDate() < 10 ? "0" + resdate.getDate() : resdate.getDate(); //获取当前几号，不足10补0
    return yearstr + "-" + monthstr + "-" + datestr;
}
//将时间转换为字符串
function DateToStr(dateT) {
    var result = "";
    if (dateT != "" && dateT != null) {
        //未完善
        result = dateT.replace(/-/g, "");
    }
    return result;
}
//获取当前系统时间
function GetSystemDate(parem) {
    var dateStr;
    var sysDate = new Date();
    var smonth = sysDate.getMonth() + 1;
    var sday = sysDate.getDate();
    if (parem == "" || parem == null) {
        //20010101

        dateStr = parseInt(sysDate.getFullYear().toString() + (smonth < 10 ? "0" + smonth.toString() : smonth) + (sday < 10 ? "0" + sday.toString() : sday.toString()));
    }
    else if (parem == 1) {
        //其它请自行添加
        dateStr = sysDate.getFullYear().toString() + "-" + (smonth < 10 ? "0" + smonth.toString() : smonth) + "-" + (sday < 10 ? "0" + sday.toString() : sday.toString());
    }
    return dateStr;
}
//end 时间


//清除最后一个字符
function REndTrim(str) {
    if (str != "") {
        return str.substring(0, str.length - 1);
    }
}

//DataGrid 取消编辑 
function CancelEditor(elemID) {
    if (elemID != null && elemID != "") {
        $('#' + elemID).datagrid('rejectChanges');
    } else {
        $("#grid").datagrid('rejectChanges');
    }
}

//日期
function DateStr(value) {
    //var t = new Date(data);
    return new Date(value).format("yyyy-MM-dd");
}

//判空
function formCheckNull(value) {
    var isNull = checkNull(value);
    if (isNull) {
        $.messager.alert("提示", "该项不能为空！", "info");
        $(this).focus();
    }
}
//检查是否为空格
function checkNull(val) {
    if (val == "")
        return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(val);
}

//检查是否为空
function CheckNull(id) {
    var val = $("#" + id).val();
    if (val == null || val.Trim == "")
        return false;
    else {
        return true;
    }
}
//检查值是否为空
function CheckStringNull(val) {
    if (val == null || val.Trim == "")
        return false;
    else {
        return true;
    }
}

function ShowDateTimes(value) {
    if (value != null && typeof (value) != "undefined") {
        value = value.replace(/T/g, " ");
        return value.substring(0, 19);
    }
}

function ShortDate(value) {
    if (value != null && typeof (value) != "undefined") {
        value = value.replace(/T/g, " ");
        return value.substring(0, 11);
    }
}
function formatnumber(value, num) {
    var a, b, c, i;
    a = value.toString();
    b = a.indexOf(".");
    c = a.length;
    if (num == 0) {
        if (b != -1) {
            a = a.substring(0, b);
        }
    } else {
        if (b == -1) {
            a = a + ".";
            for (i = 1; i <= num; i++) {
                a = a + "0";
            }
        } else {
            a = a.substring(0, b + num + 1);
            for (i = c; i <= b + num; i++) {
                a = a + "0";
            }
        }
    }
    return a;
}
//扩展验证
if ($.fn.validatebox != undefined) {
    $.extend($.fn.validatebox.defaults.rules, {
        isBlank: {
            validator: function (value, param) {
                return value.trim() != "";
            },
            message: "输入内容不能包含空格！"
        },
        length: { // 长度
            validator: function (value, param) {
                var len = $.trim(value).length;
                return len >= param[0] && len <= param[1];
            },
            message: "输入内容长度必须介于{0}和{1}之间！"
        },
        md: {   //验证开始时间小于结束时间 
            validator: function (value, param) {
                var startTime2 = $(param[0]).datetimebox('getValue');
                var d1 = $.fn.datebox.defaults.parser(startTime2);
                var d2 = $.fn.datebox.defaults.parser(value);
                return d2 > d1;
            },
            message: '结束时间要大于开始时间！'
        },
        newMaxLength: {     //扩展最大长度和非空验证
            validator: function (value, param) {
                return !/\s/.test(value) && value.length <= param[0];
            },
            message: '内容不能有空格长度为0-{0}'
        },
        ValidNumber: {  //扩展数字最大最小值
            validator: function (value, param) {
                return (param[0] < value && value < param[1]);
            },
            message: '请输入大于{0}小于{1}的数字'
        },
        ValidTrim: {    //非空验证及长度验证
            validator: function (value, param) {
                return !/\s/.test(value) && value.length >= param[0] && value.length <= param[1];
            },
            message: '内容不能有空格长度为{0}-{1}'
        }
    });
}

///计算字符串长度
function strlen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        }
        else {
            len += 2;
        }
    }
    return len;
}


var editTipIsSave = "您确定要删除选中的记录吗？（删除后请记得保存！）";
var editTipIsNoSave = "您确定要删除选中的记录吗？";


///删除树型菜单提示
function DeletGridOrTreeGrid(gridId) {
    var grid = $("#" + gridId);
    var data = grid.datagrid('getSelected');
    if (data == null) {
        $.messager.alert('提示框', '请选择待删除的记录', 'error');
        return;
    }
    $.messager.confirm('警告', editTipIsSave, function (r) {
        if (r) {
            if (grid.attr("data-options").indexOf("treeField") != -1) {
                $.easyui.treegrid.deleteById(gridId);
            } else {
                $.easyui.grid.deleteById(gridId);
            }
        } else {
        }
    });
}

function dateStr(date, row, index) {
    date = new Date(date);
    var y = date.getFullYear();
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    return y + "-" + (M < 10 ? ("0" + M) : M) + "-" + (d < 10 ? ("0" + d) : d) + " " + (hh < 10 ? ("0" + hh) : hh) + ":" + (mm < 10 ? ("0" + mm) : mm) + ":" + (ss < 10 ? ("0" + ss) : ss);
}

function dateStr2(date) {
    try {
        eval('new ' + date.substr(1, date.length - 2));
        date = eval('new ' + date.substr(1, date.length - 2));
    } catch (e) {
        date = new Date(date);
    }
    var y = date.getFullYear();
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    return y + "-" + (M < 10 ? ("0" + M) : M) + "-" + (d < 10 ? ("0" + d) : d) + " " + (hh < 10 ? ("0" + hh) : hh) + ":" + (mm < 10 ? ("0" + mm) : mm) + ":" + (ss < 10 ? ("0" + ss) : ss);
}
//格式化时间
function DateTimeFormate(value) {
    return new Date(value).format("yyyy-MM-dd HH:mm:ss");
}

//html_encode转码
function html_encode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot\;");
    return s;
}
//html_decode转码
function html_decode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    //console.info(s);
    return s;
}

//返回url 状态
function resultFileUrl(gId, url) {
    $.ajax({
        type: "Post",
        url: url + gId,
        datatype: "json",
        async: false,
        success: function (result) {
            var res = eval("(" + result + ")");
            openUrl = res.Message;
        },
        error: function (ex) {
            $.messager.alert("提示", "网络错误！", "info");
        }
    });
}

//检查结束时间不能小于开始时间
function CheckDateTimeForEnd(starD, endE) {
    var t = ShowDateTimes(resultUDateTime(starD));
    var sysTime = parseInt(GetSystemDate());
    var selTime = resultUDateTime(starD);
    var sectionTime = DateTimeToStr(selTime);
    var difTime = sysTime - sectionTime;
    if (difTime > 0) {
        //用户选择的开始时间小于当前时间
        $('#' + endE).datebox().datebox('calendar').calendar({
            validator: function (date) {
                var now = new Date();
                var maxDate = new Date(now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1)) + "-" + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()) + " " + now.getHours() + ":" + (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()));
                var minDate = new Date(formatDateTime(selTime));
                return minDate <= date && date <= maxDate;
            }
        });
    } else {
        $('#' + endE).datebox().datebox('calendar').calendar({
            validator: function (date) {
                var nowTime = date;
                var now = new Date();
                var d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - starD, now.getHours(), now.getMinutes(), now.getTime());
                return d2 <= date;
            }
        });
    }

}

//初始化结束时间
function CheckEndDate() {
    var selTime = getDiffSys($("#bTime").datebox("getValue"));
    CheckDateTimeForEnd(selTime, "eTime");
}


//返回用户选择的时间 长时间
function resultUDateTime(starD) {
    var resdate = new Date();
    resdate.setDate(resdate.getDate() - starD);
    var yearstr = resdate.getFullYear();
    var monthstr = (resdate.getMonth() + 1) < 10 ? "0" + (resdate.getMonth() + 1) : (resdate.getMonth() + 1);//获取当前月份的日期，不足10补0
    var datestr = resdate.getDate() < 10 ? "0" + resdate.getDate() : resdate.getDate(); //获取当前几号，不足10补0
    var datehour = resdate.getHours();
    var dateminutes = resdate.getMinutes();
    var dateseconds = resdate.getSeconds();
    return yearstr + "-" + monthstr + "-" + datestr + " " + datehour + ":" + dateminutes + ":" + dateseconds;
}

//与当前系统时间差(天数)
function getDiffSys(starE) {
    var startTime = new Date(Date.parse(starE.replace(/-/g, "/"))).getTime();
    var sysTime = GetSystemDate(1);
    var endTime = new Date(Date.parse(sysTime)).getTime();
    var dates = Math.abs((startTime - endTime)) / (24 * 60 * 60 * 1000);
    return parseInt(Math.round(dates, 0));
}

function formatDateTime(date) {
    var nDate = new Date(date);
    var y = nDate.getFullYear();
    var m = nDate.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = nDate.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = nDate.getHours();
    var minute = nDate.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
};


//将时间转换为字符串 长时间
function DateTimeToStr(dateT) {
    var result = "";
    if (dateT != "" && dateT != null) {
        //未完善
        result = dateT.replace(/-/g, "").split(" ")[0];
    }
    return result;
}

function doCellTip(dom) {
    $('#' + dom.id).datagrid('doCellTip');
}
function doTreeCellTip(dom) {
    $('#' + dom.id).treegrid('doCellTip');
}

addTitleByEveryCell = function () {
    //add by zed 2015-10-10 给所有的单元格加个title
    console.log($(".datagrid-view .datagrid-btable .datagrid-cell").size());
    $(".datagrid-view .datagrid-btable .datagrid-cell").each(function (i, o) {
        $(o).prop("title", $(o).text());
    });
}

if ($.fn.treegrid != undefined) {
    $.extend($.fn.treegrid.methods, {
        doCellTip: function (jq) {
            var params = { 'max-width': '100px' };

            function showTip(data, td, e) {
                if ($(td).text() == "")
                    return;
                if ($(td).find('table').length > 0)
                    return;
                $("#celltip").css("display", "none");
                $('div[stip=celltip]').css('display', 'none');
                data.tooltip.text($(td).text()).css({
                    top: (e.pageY + 10) + 'px',
                    left: (e.pageX + 20) + 'px',
                    'z-index': $.fn.window.defaults.zIndex,
                    display: 'block'
                });
            };
            return jq.each(function () {
                var grid =$(jq);
                var options = $(jq).data('datagrid');;
                if (options != undefined) {
                    //&& options.tooltip != undefined
                    //if (!options.tooltip) {
                    var panel = grid.datagrid('getPanel').panel('panel');
                    var defaultCls = {
                        'border': '1px solid #333',
                        'padding': '2px',
                        'color': '#333',
                        'background': '#f7f5d1',
                        'position': 'absolute',
                        'max-width': '200px',
                        'border-radius': '4px',
                        '-moz-border-radius': '4px',
                        '-webkit-border-radius': '4px',
                        'display': 'none',
                        'word-break': 'break-all'
                    }
                    var tooltip = $("<div id='celltip' sTip='celltip'></div>").appendTo('body');
                    tooltip.css($.extend({}, defaultCls, params.cls));
                    options.tooltip = tooltip;
                    panel.find('.datagrid-body,.datagrid-header').each(function() {
                        var delegateEle = $(jq.selector).find('> div.datagrid-body-inner').length ? $(this).find('> div.datagrid-body-inner')[0] : this;
                        $(delegateEle).undelegate('td', 'mouseover').undelegate('td', 'mouseout').undelegate('td', 'mousemove').delegate('td', {
                            'mouseover': function (e) {
                                if (params.delay) {
                                    if (options.tipDelayTime)
                                        clearTimeout(options.tipDelayTime);
                                    var that = this;
                                    options.tipDelayTime = setTimeout(function() {
                                        showTip(options, that, e);
                                    }, params.delay);
                                } else {
                                    showTip(options, this, e);
                                }
                            },
                            'mouseout': function (e) {
                                if (options.tipDelayTime)
                                    clearTimeout(options.tipDelayTime);
                                options.tooltip.css({
                                    'display': 'none'
                                });
                                //$('div[stip=celltip]').css('display', 'none');
                            },
                            'mousemove': function(e) {
                                var that = this;
                                if (options.tipDelayTime)
                                    clearTimeout(options.tipDelayTime);
                                options.tipDelayTime = setTimeout(function() {
                                    showTip(options, that, e);
                                }, params.delay);
                            }
                        });
                    });
                    
                } else {
                    return false;
                }
            });
        }
    });
}

//提示框
if ($.fn.datagrid != undefined ) {
    $.extend($.fn.datagrid.methods, {
        doCellTip: function (jq) {
            var params = { 'max-width': '100px' };

            function showTip(data, td, e) {
                if ($(td).text() == "")
                    return;
                $("#celltip").css("display", "none");
                $('div[stip=celltip]').css('display', 'none');
                data.tooltip.text($(td).text()).css({
                    top: (e.pageY + 10) + 'px',
                    left: (e.pageX + 20) + 'px',
                    'z-index': $.fn.window.defaults.zIndex,
                    display: 'block'
                });
            };

            return jq.each(function () {
                var grid = $(jq.selector);
                var options = $(jq.selector).data('datagrid');
                if (options != undefined) {
                    //&& options.tooltip != undefined
                    //if (!options.tooltip) {
                        var panel = grid.datagrid('getPanel').panel('panel');
                        var defaultCls = {
                            'border': '1px solid #333',
                            'padding': '2px',
                            'color': '#333',
                            'background': '#f7f5d1',
                            'position': 'absolute',
                            'max-width': '200px',
                            'border-radius': '4px',
                            '-moz-border-radius': '4px',
                            '-webkit-border-radius': '4px',
                            'display': 'none',
                            'word-break': 'break-all'
                        }
                        var tooltip = $("<div id='celltip' sTip='celltip'></div>").appendTo('body');
                        tooltip.css($.extend({}, defaultCls, params.cls));
                        options.tooltip = tooltip;
                        panel.find('.datagrid-body,.datagrid-header').each(function () {
                            var delegateEle = $(jq.selector).find('> div.datagrid-body-inner').length ? $(this).find('> div.datagrid-body-inner')[0] : this;
                            $(delegateEle).undelegate('td', 'mouseover').undelegate('td', 'mouseout').undelegate('td', 'mousemove').delegate('td', {
                                'mouseover': function (e) {
                                    if (params.delay) {
                                        if (options.tipDelayTime)
                                            clearTimeout(options.tipDelayTime);
                                        var that = this;
                                        options.tipDelayTime = setTimeout(function () {
                                            showTip(options, that, e);
                                        }, params.delay);
                                    } else {
                                        showTip(options, this, e);
                                    }
                                },
                                'mouseout': function (e) {
                                    if (options.tipDelayTime)
                                        clearTimeout(options.tipDelayTime);
                                    options.tooltip.css({
                                        'display': 'none'
                                    });
                                },
                                'mousemove': function (e) {
                                    var that = this;
                                    if (options.tipDelayTime)
                                        clearTimeout(options.tipDelayTime);
                                    options.tipDelayTime = setTimeout(function () {
                                        showTip(options, that, e);
                                    }, params.delay);
                                }
                            });
                        });
                    //}
                } else {
                    return false;
                }
            });
        }
    });
}

//表单查询按钮快捷键 enter
function KeyDownOpration(element, btnElement) {
    var formID = "#formQuery", btnId = $(formID).children("span").eq(0).find("a");
    if (element != "" && typeof (element) != "undefined") {
        formID = element;
    }
    if (btnElement != "" && typeof (btnElement) != "undefined") {
        btnId = btnElement;
    }
    if (btnId == "" || btnId == null || typeof (btnId) == "undefined") {
        btnId = "btn_query";
    }
    $(formID).on("keydown", function (e) {
        if (e.keyCode == 13) {
            $(btnId).click();
        }
    });
}

($(function () {
    //KeyDownOpration("");
}));


//填报数据  提交/保存
var isProcess = false;

function DataformSubmit(url, fillid, fillstatus, callback) {
    if (!isProcess) {
        isProcess = true;
        var grid = $.easyui.getGrid('grid');
        if (grid.treegrid("validateRow")) {
            var mindMessage = "确认保存吗？";
            if ($("#isimport").val() == "true") {
                mindMessage = "保存以后将不可再导入数据，确认继续吗？";
            } else {
                mindMessage = fillstatus == 1 ? mindMessage : "提交之后将不可修改，确认继续吗？";
            }

            $.easyui.confirm(mindMessage, function () {
                $.easyui.showLoadingByStr("数据处理中，请稍候...");
                if ($("#isimport").val() == "true") {
                    ImportSubmit(grid, url);
                } else {
                    var changes = grid.treegrid("getChanges");
                    //console.info(changes.length)
                    if (changes && changes.length > 0) {
                        $.easyui.treegrid.save(url, callbacknull, '', '');
                    }
                }
                //$.easyui.submit(null, callback, '', '');

                $.post('/Task/TBusiTaskFill/UpdateFillStatus', { fillid: fillid, statusValue: fillstatus }, callback);

            }, "提示");
        }
        isProcess = false;
    } else {
        $.messager.alert("提示", "数据正在处理中,请稍后再试！", "error");
    }
}
//自定义提交保存
function ImportSubmit(grid, url) {
    var jsondata = {};
    var updateList = grid.datagrid("getRows");
    jsondata.addList = $.toJSON([]);
    jsondata.updateList = $.toJSON(updateList);
    jsondata.deleteList = $.toJSON([]);
    jsondata.__RequestVerificationToken = $.getAntiForgeryToken();
    $.post(url, jsondata, callbacknull, "json");
}
//回调
function callbacknull(result) {
    $.easyui.removeLoading();
    return false;
}
//导入测试数据
function testdata(IndicatorCodes) {
    var grid = $("#grid");
    var dataRows = grid.datagrid("getRows");
    for (var i = 0; i < IndicatorCodes.length; i++) {
        $.each(dataRows, function (j, item) {
            if (IndicatorCodes[i] == item.IndicatorCode.trim()) {
                var columns = grid.datagrid("getColumnFields");
                $.each(columns, function (k, item2) {
                    if (item2 != "FillId" && item2 != "IndicatorName" && item2 != "Id" && item2 != "IndicatorInfoID" && item2 != "Version"
                         && item2 != "CreateTime" && item2 != "IndicatorCode" && item2 != "SerialNumber") {
                        item[item2] = getRandom(100000);
                    }
                });
                grid.datagrid("appendRow", item);
            }
        });
    }
}
//生成随机数
function getRandom(n) {
    return Math.floor(Math.random() * n + 1)
}

//decimal 格式化
function filterValue(value) {
    if (value && !isNaN(value)) {
        value = parseFloat(value)
        return value.toFixed(2);
    }
    return value;
}

//数据查询高级查询  任务类别onChange
function CategoryChange(newValue, oldValue) {
    if (oldValue) {
        var src = "/Task/TBusiTaskFill/SeniorSearchData?categoryID=" + newValue;
        var tabs = parent.$('#divMainTabs');
        var divIframe = tabs.tabs('getSelected').find("iframe");
        divIframe.get(0).contentWindow.$("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(divIframe.get(0).contentWindow).height() }).appendTo("body");
        divIframe.get(0).contentWindow.$("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候...").appendTo("body").css({ display: "block", left: (divIframe.get(0).contentWindow.document.documentElement.clientWidth - 190) / 2, top: (divIframe.get(0).contentWindow.document.documentElement.clientHeight - 45) / 2 });
        divIframe.get(0).src = src;
    }
}
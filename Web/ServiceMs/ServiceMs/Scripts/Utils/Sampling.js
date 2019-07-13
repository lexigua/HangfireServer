//初始化加载回车事件
$(function () {
    $("#grid").datagrid({
        onClickCell: bindCell,
        onDbClickCell: bindCell
    });
});

function bindCell(rowIndex, field, value) {
    var currentGrid = $("#grid");
    var rows = currentGrid.datagrid("getRows");
    if (rowIndex > rows.length - 1) {
        addRow();
    }
    currentGrid.edatagrid("editRow", rowIndex);
    currentGrid.datagrid("selectRow", rowIndex);
    var fields = currentGrid.datagrid("getColumnFields");
    $.each(fields, function (i, it) {
        var binditem = currentGrid.datagrid("getEditor", { index: rowIndex, field: it });
        var isExistTextbox = $(binditem.target).next().find(":text").length == 0;
        var targetBox;
        if (isExistTextbox) {
            targetBox = $(binditem.target);
        } else {
            targetBox = $(binditem.target).next().find(":text");
        }
        targetBox.bind("keydown", function (e) {
            if (e.keyCode == 13) {
                if (it == "BeginTestTime") {
                    
                    var tocell = currentGrid.datagrid("getEditor", { index: rowIndex, field: fields[i + 1] });
                    $(tocell.target).textbox("setValue", GetEndTestTime(currentGrid, targetBox,20));
                }
                if (i + 1 == fields.length) {
                    bindCell(rowIndex + 1);
                } else {
                    var tocell = currentGrid.datagrid("getEditor", { index: rowIndex, field: fields[i + 1] });
                    if ($(tocell.target).next().find(":text").length == 0)
                        $(tocell.target).focus();
                    else
                        $(tocell.target).next().find(":text").focus();
                }
            }
        });
    });
}
//环境噪声、道路交通噪声 数据项添加
function addRow() {
    
    var data = $("#grid").datagrid("getRows");
    if (data.length == 0) {
        $.easyui.grid.add({}, '');
    } else {
        var json = { SectionName: data[0].SectionName, TestPosition: data[0].TestPosition };
        TestTimeInit(data, json,1,20);
        $.easyui.grid.add(json, '');
    }

}
//初始化测试开始时间（环境噪声采样单）
function TestTimeInit(data, json,hours,minutes) {
    var index = data.length - 1;
    //初始化开始时间
    var datetime = "2010-08-10 " + data[index].BeginTestTime;
    var time = new Date(datetime.replace("-", "/"));
    var b = hours;
    time.setHours(time.getHours() + b, time.getMinutes(), 0);
    json["BeginTestTime"] = time.getHours() + ":" + time.getMinutes();
    //初始化结束时间
    var f = minutes;
    time.setMinutes(time.getMinutes() + f, time.getSeconds(), 0);
    json["EndTestTime"] = time.getHours() + ":" + time.getMinutes();

}
//获取测试结束时间（环境噪声采样单）
function GetEndTestTime(currentGrid, targetBox, minutes) {
    var datetime = "2010-08-10 " + targetBox.next().val();
    var time = new Date(datetime.replace("-", "/"));
    var b = minutes; //分钟数
    time.setMinutes(time.getMinutes() + b, time.getSeconds(), 0);
    return time.getHours() + ":" + time.getMinutes();
}
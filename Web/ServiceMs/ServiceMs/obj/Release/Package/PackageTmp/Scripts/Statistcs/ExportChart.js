
function DownLoadChart(data,url,name) {
    var json = eval("(" + data + ")");
    if (json.Code === 1) {
        var form = document.forms[0];
        var controlUrl = url + '?path=' + json.Message + '&wordName=' + name;
        form.method = "post";
        form.action = downExportUrl + controlUrl;
        form.submit();
    }
}
function DateAdd(id) {
    var endDate = $("#" + id).val();
    if (endDate !== "") {
        var dateYear = endDate.substr(0, 4);
        var dateMonth = endDate.substr(endDate.indexOf('年') + 1, 2);
        if (dateMonth == "12") {
            endDate = endDate.replace(dateYear, parseFloat(dateYear) + 1);
            endDate = endDate.replace(dateMonth, 1);
        } else {
            endDate = endDate.replace(dateMonth, parseFloat(dateMonth) + 1);
        }
    }
    return endDate;
}

function ExportDataToWorld(gridid, exportheadString, exportString, headTitle, list,headArray,headArray2) {
    var data = $("#" + gridid).datagrid("getData");
    if (data.rows.length <= 0) {
        $.easyui.topShow("无数据！");
        return;
    }
    //list[i]._chartsViews.length != 0
    var imgUrl = "";
    for (var i = 0; i < list.length; i++) {
        if (list[i] != undefined )
            imgUrl += "'" + encodeURI(list[i].getDataURL("png"));
    }
    $.post("/DataForm/DataGasMonthProductConsume/EchartExportInRow",
        {
            dataRow: data.rows,
            count: data.total,
            exportheadString: exportheadString,
            exportString: exportString,
            headTitle: headTitle,
            imgUrl: imgUrl, listDataGridFiledList1: headArray, listDataGridFiledList2: headArray2
        },
        function (e) {
            DownLoadChart(e, "/DataForm/DataSocietyElectricityConsumption/DownEchartWord", headTitle);
            $.easyui.removeLoading();
        });
}
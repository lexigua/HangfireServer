var Export = function (gridId, controlUrl, gSort, gOrder, total, name) {
    var data = $('#' + gridId).datagrid('getData');
    if (parseInt(data.total) == 0) {
        $.messager.alert('提示框', '<br/>没有数据导出！', 'error');
        return;
    }
    var form = document.forms[0];
    //var inputOrder, inputSort, inputTotal;
    /*if ($("#hidOrder").length > 0) {
        inputOrder = $("#hidOrder").get(0);
    }
    else {
        inputOrder = document.createElement("input");
        inputOrder.setAttribute("type", "hidden");
        inputOrder.setAttribute("name", "order");
        inputOrder.setAttribute("id", "order");
        form.appendChild(inputOrder);
    }
    inputOrder.setAttribute("value", "");
    inputOrder.setAttribute("value", gOrder);*/

    //if ($("#hidSort").length > 0) {
    //    inputSort = $("#hidSort").get(0);
    //}
    //else {
    //    inputSort = document.createElement("input");
    //    inputSort.setAttribute("type", "hidden");
    //    inputSort.setAttribute("name", "sort");
    //    inputSort.setAttribute("id", "sort"); 
    //    form.appendChild(inputSort);
    //}
    //inputSort.setAttribute("value", "");
    //inputSort.setAttribute("value", gSort);


    //if ($("#hidTotal").length > 0) {
    //    inputTotal = $("#hidTotal").get(0);
    //}
    //else {
    //    inputTotal = document.createElement("input");
    //    inputTotal.setAttribute("type", "hidden");
    //    inputTotal.setAttribute("name", "PageSize");
    //    inputTotal.setAttribute("id", "PageSize");
    //    form.appendChild(inputTotal);
    //}
    //inputTotal.setAttribute("value", "");
    //inputTotal.setAttribute("value", total);
    form.method = "post";
    //form.=function() {
    //    $.easyui.removeLoading();
    //}
    if (name === null)
        name = "";
    form.target = '_blank';
    form.action = downExportUrl + controlUrl + "?ExcelName=" + encodeURI(name);
    form.submit();
};
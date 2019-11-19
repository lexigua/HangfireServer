$(function () {
    setTimeout(function () {
        
        //获取维度类别组合框
        $("#DimTypeID").combobox({
            url: "/BasicData/BasisDimType/GetDimTypeComboxJson", //获取所有私有域
            valueField: "Value",
            textField: "Text",
            //panelHeight: "auto",
            editable: false, //不允许手动输入
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#DimTypeID').combobox('getData');
                if (data.length > 0) {
                    //$("#DimTypeID").combobox('select', data[0].Value);
                    $("#DimTypeID").combobox('select', $("#hidId1").val());
                }
            },
            onSelect: function (record) {
                $("#hidId3").val(record.Value);
                var url = '/BasicData/BasisDimGroup/GetDimGroupComboxJson?DimTypeID=' + record.Value;
                //
                $("#DimGroupID").combobox('reload', url);
            }
        });

        $("#DimGroupID").combobox({
            valueField: "Value",
            textField: "Text",
            editable: false, //不允许手动输入
            onLoadSuccess: function () {
                var types = $("#DimGroupID").combobox('getData');
                //||$("#hidId3").val().toString()=="")
                if (types.length > 0&& $("#hidId1").val().toString() === $("#hidId3").val())  {
                    $("#DimGroupID").combobox('select', $("#hidId2").val());
                } else {
                    $("#DimGroupID").combobox('select', null);
                }
                //
            },
            onSelect: function (record) {
                //
                if (typeof (record) == "undefined") {
                    $("#itemTree").tree({
                        //data: sourceData,
                        url: "/BasicData/basisdimgroupitem/GetItemData"                      
                    });
                    //
                    $("#targetItemTree").tree({
                        url: "/BasicData/basisdimgroupitem/GetItemDataBaseShow?DimGroupID=fdd" 
                    });
                } else {
                    $("#hidDimGroupID").val(record.Value);
                    $("#itemTree").tree({
                        //data: sourceData,
                        url: "/BasicData/basisdimgroupitem/GetItemData",
                        lines: true,
                        checkbox: true
                    });
                    $("#targetItemTree").tree({
                        //data: sourceData,
                        url: "/BasicData/basisdimgroupitem/GetItemDataBaseShow?DimGroupID=" + record.Value,
                        lines: true
                    });
                }
                
            }
        });

    }, 0);
    
});


var MoveRight = function () {
    var checked = $('#itemTree').tree('getChecked');
    var nodeArray = [];
    if (checked.length > 0) {
        for (var i = 0; i < checked.length; i++) {
            if (checked[i].id != 0) {
                var node = $('#targetItemTree').tree('find', checked[i].id);
                if (node == null)
                    nodeArray.push({ "id": checked[i].id, "text": checked[i].text });
            }
        }
    } else
        alert('请选择节点');
    $('#targetItemTree').tree('append', { data: nodeArray });
};
var MoveRightAll = function () {
    var root = $('#itemTree').tree('find', 0);
    var nodes = $('#itemTree').tree('getChildren', root.target);
    var nodeArray = [];
    if (nodes.length > 0) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id != 0) {
                var node = $('#targetItemTree').tree('find', nodes[i].id);
                if (node == null)
                    nodeArray.push({ "id": nodes[i].id, "text": nodes[i].text });
            }
        }
    } else
        alert('请选择节点');
    $('#targetItemTree').tree('append', { data: nodeArray });
};
var MoveLeftAll = function () {
    $("#targetItemTree").tree({
        //data: []
        url: "/BasicData/basisdimgroupitem/GetItemDataBaseShow?DimGroupID=ff"
    });
};
var MoveLeft = function () {
    var selected = $('#targetItemTree').tree('getSelected');
    if (selected == null)
        alert('请选择要移除的节点');
    $('#targetItemTree').tree('remove', selected.target);
};
var GetId = function () {
    var nodes = $('#targetItemTree').tree('getRoots');
    var id = "";
    for (var i = 0; i < nodes.length; i++)
        id += nodes[i].id + ',';
    $("#hidId").val(id);
};

var GetText = function () {
    var nodes = $('#targetItemTree').tree('getRoots');
    var text = "";
    for (var i = 0; i < nodes.length; i++)
        text += nodes[i].text + ',';
    alert(text);
};
//auto_next模块
!function () {
    var cur_input = null;
    var button = null;
    var last_input = null;
    var is_include = false;//是否有添加按钮
    $(document).ready(function () {
        if ($("input.textbox-text:last").attr("class") == "textbox-text validatebox-text textbox-prompt") {
            last_input = $("input.textbox-text").eq(-2);
        } else {
            last_input = $("input.textbox-text:last");
        }

        $("input[type=text]").each(function () {
            $(this).bind("click", function () {
                cur_input = this;

            })
        })
        $("input[type=text]").each(function () {
            $(this).bind("keydown", function (e) {
                if (e.which == 13) {
                    next_focus(cur_input);
                }
            })
        })
        if ($("#toolbar").length > 0) {
            $("#toolbar").each(function () {
                if ($(this).children("a").eq(0).children("span").children("span").html() == "添加") {
                    is_include == true;
                    $(this).children("a").eq(0).bind("click", function () {
                        button = $(this).children("a").eq(0);
                        bindCell($("#grid").datagrid("getData").rows.length - 1);
                    });
                }
            })
        } else if ($(".toolbar").length > 0) {
            $(".toolbar").each(function () {
                if ($(this).children("a").eq(0).children("span").children("span").html() == "添 加") {
                    is_include == true;
                    $(this).children("a").eq(0).bind("click", function () {
                        button = $(this).children("a").eq(0);
                        bindCell($("#grid").datagrid("getData").rows.length - 1);
                    });
                }
            })
        }


        $("#grid").datagrid({
            onClickCell: bindCell
        })
    })

    //表头
    function next_focus(target) {
        if (target === last_input[0]) {
            return
        }
        while ($(target).next().length == 0 || $(target).attr("type") != $(target).next(target).attr("type")) {
            target = $(target).parent();
        }
        do {
            target = target.next();
        } while (!target.is(":has(input[type=text])"))
        if ($(target).find("input[type=text]").length > 1) {
            $(target).find("input[type=text]").eq(0).click();
        } else {
            $(target).find("input[type=text]").click();
        }
        cur_class = $(target).find("input[type=text]");
    }

    //tbody
    function bindCell(rowIndex, field, value) {
        var dataGrid = $("#grid");
        dataGrid.edatagrid('editRow', rowIndex);
        dataGrid.datagrid('selectRow', rowIndex);
        var editorList = dataGrid.edatagrid('getEditors', rowIndex);
        var editors = [];
        $.each(editorList, function(i,item) {
            if ($(item.target).parents("[field=" + item.field + "]")[0].style.display != "none") {
                editors.push(item);
            }
        });
        var isfirst = $(editors[0].target).next().find(":text").length == 0;
        if (isfirst) {
            $(editors[0].target).focus();
        } else {
            $(editors[0].target).next().find(":text").focus();
        }
        var lengh = editors.length;
        $.each(editors, function (index, binditem) {
            var isExistTextbox = $(binditem.target).next().find(":text").length == 0;
            var targetBox;
            if (isExistTextbox) {
                targetBox = $(binditem.target);
            } else {
                targetBox = $(binditem.target).next().find(":text");
            }
            targetBox.bind("keydown", function(e) {
                if (e.keyCode == 13) {
                    if ((index + 1) == lengh) {
                        //判断为最后一行
                        if ((rowIndex + 1) == dataGrid.datagrid("getData").rows.length) {
                            if (is_include) {//没有添加按钮，禁用add方法
                                if (confirm("继续添加新纪录？")) {
                                    return;
                                } else {
                                    $.easyui.grid.add({}, '');
                                    bindCell(rowIndex + 1);
                                }
                            }

                        } else {
                            bindCell(rowIndex + 1);
                        }
                        return;
                    }
                    var targetBoxNext = editors[index + 1];
                    isExistTextbox = $(targetBoxNext.target).next().find(":text").length == 0;
                    if (isExistTextbox) {
                        $(targetBoxNext.target).focus();
                    } else {
                        $(targetBoxNext.target).next().find(":text").focus();
                    }
                }
            });
        });
    }
}()

; $(function ($) {
    var _num = 0, _d = "", _elb = "", _row = 0, _tbar = "", _el = null;
    $.extend({
        //回车键事件
        _enterE: function (el, callback) {
            _el = el;
            $._Init();
            _d.bind('keydown', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) {
                    $._actionE(callback);
                }
            });
        },
        //点击单元格事件
        _CellE: function (rowIndex, field, value, callback) {
            if (typeof (rowIndex) == "undefined") {
                rowIndex = _row;
            } else {
                _row = rowIndex;
            }
            $._Init();
            _d.bind('keydown', function (e) {
                var code = e.keyCode || e.which;
                if (code == 13) {
                    $._rowIn(callback);
                }
            });
        },
        //初始化变量
        _Init: function () {
            _num = 0;
            _d = $('.datagrid-row-editing').eq(1).find(".datagrid-editable .textbox,.datagrid-editable .datagrid-editable-input,.datagrid-editable .textbox-text");
            _d.eq(_num).focus();
            _tbar = $("#toolbar").find("a");
            $._setCombo();
        },
        //事件操作
        _actionE: function (callback) {
            if (_num == (_d.length - 1)) {
                $._rowSwitch();
            } else {
                ++_num;
                _d.eq(_num).focus();
            }
            if (typeof (callback) == "function") {
                callback();
            }
        },
        //新增行
        _rowSwitch: function () {
            for (var _k = 0; _k < _tbar.length; _k++) {
                var btna = _tbar.eq(_k).attr("id");
                if (_el != null) {
                    _elb = _el.id;
                    if (btna == _elb) {
                        _num = 0;
                        $(_el).click();
                    }
                }
            }
        },
        //新增行
        _rowIn: function (callback) {
            var _rows = $("#grid").datagrid("getRows").length - 1;
            if (_num == (_d.length - 1)) {
                //$("#grid").edatagrid("endEdit", _row);
                if (_row < _rows) {
                    ++_row;
                    $("#grid").edatagrid("editRow", _row);
                    $("#grid").datagrid('selectRow', _row);
                    $._Init();
                    $._CellE(_row);
                } else {
                    $._rowSwitch(_el);
                }
            } else {
                ++_num;
                _d.eq(_num).focus();
            }
            if (typeof (callback) == "function") {
                callback();
            }
        },
        //设置属性
        _setCombo: function () {
            var _dlength = _d.length;
            for (var k = 0; k < _dlength; k++) {
                var _delement = _d.eq(k).is("span");
                var _dclass = _d.eq(k).hasClass("combo");
                if (_delement && _dclass) {
                    _d.eq(k).find("input").eq(0).attr("readonly", "readonly");
                }
            }
        }
    });
});
//(jQuery)
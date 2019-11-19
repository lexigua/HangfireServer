$(function () {
    /*新添加的js*/
    $(".regionImg").click(function () {
        $(".region").toggle(600);
        $(".regionShowImg").css("display", "block");
    });
    $(".regionShowImg").click(function () {
        $(".region").toggle(600);
        $(".regionShowImg").css("display", "none");
    });
    $(".head-pullUp").click(function () {
        //$(".sidebar").toggle(400);
        $(".sidebar").animate({
            right: '-90px'
        }, "600");
        $(".head-pullDown").css('display', 'block');
    });
    $(".head-pullDown").click(function () {
        $(".sidebar").animate({
            right: '0px'
        }, "600");
        //$(".sidebar").toggle(400);
        $(".head-pullDown").css('display', 'none');
    });
    $("#operate4").click(function () {
        $(".biaohuis a").click();
    });
    $(".shilis a").click(function () {
        $("#message").css("display", "block");
        $("#info").css("display", "none");
        $(".biaohuis a").removeClass("backcolor");
        $(".shilis a").addClass("backcolor");
    });
    $(".biaohuis a").click(function () {
        $("#info").css("display", "block");
        $("#message").css("display", "none");
        $(".shilis a").removeClass("backcolor");
        $(".biaohuis a").addClass("backcolor");
    });
    $("#normal li:first").addClass("active");
    $(".dropMap").click(function () {
        $("#normal li").removeClass("active");
        $("#district").addClass("active");
    });
    $("#normal li").click(function() {
        if ($(".navbar-collapse.in").length > 0) {
            $(".navbar-toggle").click();
        }
    });
    $(".dropMap li").click(function () {
        if ($(".navbar-collapse.in").length > 0) {
            $(".navbar-toggle").click();
        }
    });
    var a;
    var zindex = 30;
    $(".operate").click(function () {
        a = $(this).attr("id").replace(/operate/, "");
        $(".operation" + a).toggle(
				function () {
				    $(this).addClass(".edit-change");
				    $(this).css("z-index", zindex++);
				}
			);
        $(".operation" + a).draggable({
            handle: ".modal-header",
            zIndex: zindex++
        });
    });
    $(".operation").click(function () {
        $(".operation").css("z-index", "30");
        $(this).css("z-index", zindex++);
    });

    $(".closes1").click(function () {
        if (confirm("确定关闭窗口？")) {
            
            $(this).parent().parent().css("display", "none");
        }

    });
    $(".closes2").click(function () {
        if (confirm("确定关闭查询窗口？")) {
            $(this).parent().parent().css("display", "none");
            $("#gbox_jqGrid").remove();

            $("#pointQuery").attr("checked", false);
            //清除以前的查询记录
            $("#jqGrid").clearGridData();
            map.infoWindow.hide();
            map.graphics.clear();

        }

        //$("#searchtext").val = "";
        document.getElementById("searchtext").value = "";
        document.getElementById("layername").value = "请选择..";

    });
    $(".closes8").click(function () {
        if (confirm("确定关闭查询窗口？")) {
            $(this).parent().parent().css("display", "none");
        }
        //移除表格
        $("#gbox_aroundGrid").remove();

    });
    $(".closes3").click(function () {
        if (confirm("确定关闭窗口？")) {
            ss("display", "none");
            //$("#normal li").eq(3).removeClass("active");
            //titlebar();
        }
    });
    $(".closes4").click(function () {
        if (confirm("确定关闭窗口？")) {
           
            $(this).parent().parent().css("display", "none");
            //$("#normal li").eq(4).removeClass("active");
            //titlebar();
        }
    });
    $(".closes5").click(function () {
        if (confirm("确定关闭窗口？")) {
            $(this).parent().parent().css("display", "none");
            //$("#normal li").eq(5).removeClass("active");
            //titlebar();
        }
    });
    $(".closes10").click(function () {
        if (confirm("确定关闭窗口？")) {
            $(this).parent().parent().css("display", "none");
            //$("#normal li").eq(5).removeClass("active");
            //titlebar();
        }
    });
    $(".closes6").click(function () {
        if (confirm("确定关闭窗口？")) {
            $(this).parent().parent().css("display", "none");
            
            }

            //sentimenthotGraphicLayer.clear();
        
    });

    $(".pull").click(function () {
        if ($(this).hasClass("pullUP")) {
            $(this).parent().next().toggle(600);
            $(this).css("display", "none");
            $(this).next().css("display", "block");
        } else {
            $(this).parent().next().toggle(600);
            $(this).css("display", "none");
            $(this).prev().css("display", "block");
        };
    });
})
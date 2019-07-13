//防止日历出现滚动条
(function () {
    $(window).click(function () {
        $(".datebox-calendar-inner").parent().css("height", "203px");
    })
}())
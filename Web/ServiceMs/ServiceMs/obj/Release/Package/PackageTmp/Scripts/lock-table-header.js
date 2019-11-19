function lockTableHead(el) {
    var thead = $(el).find("thead")[0].outerHTML;
    console.log(thead);
    $("<table>" + thead + "</table>").insertBefore($(el).find("thead"));
    console.log()
    var el2 = $(el).find("thead")[0];
    var el1 = $(el).find("thead")[1];  
    deep_forEach(el1, el2);
    transLationCell(el2);
    $($(el).find("thead")[0]).css({ "position": "absolute","top":"0","z-index":999 })

    var yearbooktable = document.getElementById("yearbooktable");
    yearbooktable.addEventListener("scroll", function () {
        var scrollTop = this.scrollTop;
        $(el2).css({"top":scrollTop + "px"});
    });
    var timer; 
    window.addEventListener("resize", function () {
        !!timer && clearTimeout(timer);
        timer = setTimeout(function() {
            deep_forEach(el1, el2);
            $("#yearbooktable").height($(document.body).height() - 230);
            console.log($("#yearbooktable .yearBookClass").height());
            console.log(($("#yearBookDataPanel").height()));
        },100)
        
    })
    $("#yearbooktable").height($(document.body).height() - 230);
    deep_forEach(el1, el2);
   
}

function deep_forEach(el1, el2) {
    $(el2).css({ "width": $(el1).width()+1 + "px", "height": $(el1).height()+1 + "px" });
    
    if ($(el1).find("*").length) {
        $(el1).find("*").each(function (index) {          
            $($(el2).find("*")[index]).css({ "width": $(this).width()+1 + "px", "height": $(this).height() + "px" });
        })
    }
}

function transLationCell(el) {
    $(el).children().each(function () {
        $(this).children().each(function () {
            if ($(this).hasClass("hideCell")) {
                var parent = $(this).parent()
                var _this = this;
                $(parent).prev().children().each(function() {
                    if (this.innerText === _this.innerText) {
                        $(this).css({"border-bottom":"none","text-align":"center"})
                    }
                    
                })
                $(_this).css({'border-top':"none","text-align":"left"});
            }
        })
    })
    
}

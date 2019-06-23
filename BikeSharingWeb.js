
$(document).ready(function(){

    //导航栏吸顶
    //获取nav距离顶部的距离
    var navtop = $("nav").offset().top;
    $(document).scroll(function(){
        //获取滚动条滚动的高度
        var scroltop = $(document).scrollTop();
        if (scroltop >= navtop){
            $("nav").css({
                "position":"fixed",
                "top":"0px",
                "box-shadow" : "0 5px 10px"
            });
            $(".wrapper").css({
                "position":"relative",
                "top": $("nav").height() + 20
            });
        }
        else {
            $("nav").css({
                "position":"static"
            });
            $(".wrapper").css({
                "position":"static"
            })
        }
    });
    
    
    //类似在线客服的实现
    $(function(){
        var is_hidden = true;
        $("#click").click(function(){
            if(is_hidden){
                $("#window").animate({right:0},500);
            }else{
                $("#window").animate({right:-200},500);
            }
            is_hidden = !is_hidden;
        })
    })
});

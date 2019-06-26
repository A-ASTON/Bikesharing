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
                "position":"static",
                "box-shadow" : "none"
            });
            $(".wrapper").css({
                "position":"relative",
                "top": 0
            })
        }
    });
    
    
    //类似在线客服的实现(社交媒体整合)
    var is_hidden = true;
    $(".click").click(function(){
        if(is_hidden){
            $(".socialMedia").animate({right:0},500);
            $(".click").html("Social<br>Media<br>>>");
        }else{
            $(".socialMedia").animate({right:-200},500);
            $(".click").html("Social<br>Media<br><<");
        }
        is_hidden = !is_hidden;
    })


    //首页文字特效
    $("#index1_start").click(function(){
        $(this).html('Tell me who you are?').fadeOut(1000);
        $(this).after('<a href="BikeSharingWeb_employer.html" class="continue" id="Boss">I\'m the Boss!</a>');
        $(this).after('<br><br><br><a href="BikeSharingWeb_employee.html" class="continue" id="Employee">I\'m An Employee!</a><br>');  
        return false;
    })


    //初级成本核算器
    $("#calculate").click(function(){
        var km = $("#km").val();
        var L = $("#L").val();
        var times = $("#times").val();
        var hours = $("#hours").val();
        $("#driving_result").val(km*L*0.10);
        $("#busing_result").val(times*2);
        $("#riding_result").val(Math.ceil(hours)*1);
        return false;
    })


    // 以下是调用百度地图API功能

    // 定位
    var map = new BMap.Map("container");//创建地图实例
    var point = new BMap.Point(114.06,22.54);// 创建点坐标
    var geoc = new BMap.Geocoder();//创建地址解析器
    map.centerAndZoom(point,12);
    function myFun(result){
        var cityName = result.name;
        map.setCenter(cityName);
        $("#position").val(cityName);
    }
    var myCity = new BMap.LocalCity();
    myCity.get(myFun);
    
    
    //路线规划的实现
    //骑行线路规划
    var riding = new BMap.RidingRoute(map, { 
        renderOptions: { 
            map: map, 
            autoViewport : true
        }
    });

    //步行线路规划
    var walking = new BMap.WalkingRoute(map, { 
        renderOptions: { 
            map: map, 
            autoViewport: true 
        }
    });

    //公交线路规划
    var transit = new BMap.TransitRoute(map, { 
        renderOptions: { 
            map: map, 
            autoViewport: true
            
        },
        // 配置跨城公交的换成策略为优先出发早
        intercityPolicy: BMAP_INTERCITY_POLICY_EARLY_START,
        // 配置跨城公交的交通方式策略为飞机优先
        transitTypePolicy: BMAP_TRANSIT_TYPE_POLICY_AIRPLANE
    });

    //驾车线路规划
    var driving = new BMap.DrivingRoute(map, { 
        renderOptions: { 
            map: map, 
            autoViewport: true 
        }
    });

    //鼠标
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用


    //输入框提示输入功能
    function G(id) {
        return document.getElementById(id);
    }

    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {"input" : "suggestId"
        ,"location" : map
    });

    ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
    var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }    
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
        
        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }    
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });

    var myValue;
    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
    var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        setPlace();
    });

    function setPlace(){
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
            point = local1.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(point, 18);
            geoc.getLocation(point, function(rs){
                addComp = rs.addressComponents;
            })
            map.addOverlay(new BMap.Marker(point));//添加标注
        }
        var local1 = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
        });
        local1.search(myValue);
    }
    

    //获取鼠标点击的经纬度以及地址解析
    var addComp;//创建地址容器
    map.addEventListener("click",function(e){
        point = e.point;
        map.clearOverlays();    //清除地图上所有覆盖物
        geoc.getLocation(point, function(rs){
            addComp = rs.addressComponents;
        })
        var marker = new BMap.Marker(e.point); //添加标注
        map.addOverlay(marker);
    });
    var start;
    var end;

    $("#search").click(function(){  
        var position0 = $("#searching").val();
        var local = new BMap.LocalSearch(map, {
            renderOptions:{map: map}
        });
        local.search(position0);
    })
    
    
    //自定义部分（点击设置起点和终点并显示位置名称）
    $("#start").click(function(){
        start = new BMap.Point(point.lng, point.lat);
        $("#show_start").val(addComp.city + addComp.district + addComp.street + addComp.streetNumber);
    })
    $("#end").click(function(){
        end = new BMap.Point(point.lng, point.lat);
        $("#show_end").val(addComp.city + addComp.district + addComp.street + addComp.streetNumber);
    })


    //骑车方式
    $("#riding").click(function(){
        map.clearOverlays();    //清除地图上所有覆盖物
        riding.search(start, end);
    })
    //步行方式
    $("#walking").click(function(){
        map.clearOverlays();    //清除地图上所有覆盖物
        walking.search(start, end);
    })
    //驾车方式
    $("#driving").click(function(){
        map.clearOverlays();    //清除地图上所有覆盖物
        driving.search(start, end);
    })
    //公交方式
    $("#transit").click(function(){
        map.clearOverlays();    //清除地图上所有覆盖物
        transit.search(start, end);
    })

});
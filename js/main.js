/**
 * Created by appcan on 2016/9/6.
 */
require.config({
    baseUrl: "js/lib",
    paths: {
        swiper: "swiper-3.3.1.min",
        jquery: "https://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min",
    }
});

require(["swiper"], function () {
    //初始化首页轮播图
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: 2000,
        effect: 'fade',
        autoplayDisableOnInteraction: false,
        autoplayStopOnLast: true,
        direction: 'horizontal',
        // 分页器
        pagination: '.swiper-pagination',
        // 前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        onClick: function (swiper) {
            mySwiper.slideNext();
        }
    })
});

require(["jquery"], function () {
    $("#go").on("click", function () {
        window.location.href = "home.html";
    })
})

require(["method"], function (m) {
    var ev = m.EventUtil;
    //侧边栏运动
    var div1 = document.getElementById("div1");
    ev.addHandler(div1, "mouseover", function () {
        m.startMove(0, 10, div1);
    })
    ev.addHandler(div1, "mouseout", function () {
        m.startMove(-150, -10, div1);
    })

    var request1 = document.getElementById("request1");
    request1.addEventListener("click", function () {
        m.AJAX("https://route.showapi.com/9-2?showapi_appid=5668&showapi_sign=000bca6e40344eafb11c68cf28a8bf43&area=武汉", "get", null);
    }, false);

    var oDiv2 = document.getElementById("div2");
    oDiv2.onmouseover = function () {
        m.startChange(100, 10, oDiv2);
    }
    oDiv2.onmouseout = function () {
        m.startChange(20, -10, oDiv2);
    }
})
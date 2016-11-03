/**
 * Created by appcan on 2016/9/6.
 */
require.config({
    baseUrl: "js/lib",
    paths: {
        swiper: "swiper-3.3.1.min",
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

require(["method"], function (m) {
    var ev = m.EventUtil;
    var go=m.getEl("go");
    if(go){
        ev.addHandler(go, "click", function () {
            window.location.href = "home.html";
        })
    }
})

require(["method"], function (m) {
    var ev = m.EventUtil;
    //侧边栏运动
    var div1 = m.getEl("div1");
    ev.addHandler(div1, "mouseover", function () {
        m.startMove(0, 10, div1);
    })
    ev.addHandler(div1, "mouseout", function () {
        m.startMove(-150, -10, div1);
    })

    var request1 = m.getEl("request1");
    ev.addHandler(request1, "click", function () {
        m.AJAX("https://route.showapi.com/9-2?showapi_appid=5668&showapi_sign=000bca6e40344eafb11c68cf28a8bf43&area=武汉", "get", null);
    }, false);

    var div2 = m.getEl("div2");
    ev.addHandler(div2, "mouseover", function () {
        m.show(1000, div2);
    })
    ev.addHandler(div2, "mouseout", function () {
        m.hide(1000, div2);
    })
    m.openMask(0);
})
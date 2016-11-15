/**
 * Created by appcan on 2016/9/6.
 */
require.config({
    baseUrl: "js/lib",
    paths: {
        swiper: "swiper-3.3.1.min",
        vue:"vue-min",
        jquery:"jquery-3.1.0.min",
        bootstrap:"bootstrap.min"
    }
});

//载入jquery和bootstrap模块
require(["jquery","bootstrap"], function ($,bs) {

});

//require(["method"], function (m) {
//    var ev = m.EventUtil;
//    //侧边栏运动
//    var div1 = m.getEl("div1");
//    ev.addHandler(div1, "mouseover", function () {
//        m.startMove(0, 10, div1);
//    })
//    ev.addHandler(div1, "mouseout", function () {
//        m.startMove(-150, -10, div1);
//    })
//
//    var request1 = m.getEl("request1");
//    ev.addHandler(request1, "click", function () {
//        m.AJAX("https://route.showapi.com/9-2?showapi_appid=5668&showapi_sign=000bca6e40344eafb11c68cf28a8bf43&area=武汉", "get", null);
//    }, false);
//
//    var div2 = m.getEl("div2");
//    ev.addHandler(div2, "mouseover", function () {
//        m.show(1000, div2);
//    })
//    ev.addHandler(div2, "mouseout", function () {
//        m.hide(1000, div2);
//    })
//    //m.openMask(0);
//})
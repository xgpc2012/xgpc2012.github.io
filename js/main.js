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

require(["method"], function (m) {
    var ev = m.EventUtil;
    //侧边栏运动
    var div1 = m.getEl("div1");
    ev.addHandler(div1, "mouseover", function () {
        m.startMove(0, 10, div1);
    })
    ev.addHandler(div1, "mouseout", function () {
        m.startMove(-100, -10, div1);
    })
    var div2 = m.getEl("div2");
    ev.addHandler(div2, "mouseover", function () {
        m.show(1000, div2);
    })
    ev.addHandler(div2, "mouseout", function () {
        m.hide(1000, div2);
    })
    //m.openMask(0);
})
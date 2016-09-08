/**
 * Created by appcan on 2016/9/6.
 */
require.config({
    baseUrl: "js/lib",
    paths: {
        swiper: "swiper-3.3.1.min",
        jquery:"http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min",
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
        window.location.href="home.html";
    })
})

require(["method"], function (m) {
    console.log(m.add(1,3));
})
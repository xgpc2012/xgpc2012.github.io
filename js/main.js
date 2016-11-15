/**
 * Created by appcan on 2016/9/6.
 */
require.config({
    baseUrl: "js/lib",
    paths: {
        swiper: "swiper-3.3.1.min",
        vue: "vue.min",
        jquery: "jquery-3.1.0.min",
        bootstrap: "bootstrap.min"
    }
});

//载入jquery和bootstrap模块
require(["jquery", "bootstrap"], function ($, bs) {
    var $more = $("#more"),
        $hide_friends = $("#hide_friends"),
        $p = $more.find("p"),
        $line1=$("#line1");
    $more.on("click", function () {
        if ($p.text() == "展开更多") {
            $p.text("隐藏更多");
            $hide_friends.slideDown();
            $line1.hide();
        } else {
            $p.text("展开更多");
            $hide_friends.slideUp();
            $line1.show();
        }
    })
});
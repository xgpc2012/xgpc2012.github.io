/**
 * Created by pc on 2017/4/6.
 */
$(".academy-index-tab li").on("click", function () {
    $(".academy-index-tab li").removeClass("active");
    $(this).addClass("active");
    var type = $(this).data("type");
    data.aType = type || "";
    showList(data);
})
$(".header-nav-bar li").hover(function () {
    $(".header-nav-bar a").removeClass("t-6a");
    $(this).find("a").addClass("t-6a");
}, function () {
    $(".header-nav-bar a").removeClass("t-6a");
})
function showList(data) {
    var html = template("article", data);
    $(".academy-index-content").append(html);
}
if($(".swiper-container").length!=0){
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
        pagination: '.pagination',
        paginationClickable: true,
        loop: true
    })
}

function getNews(start,channel) {
    // $.getJSON("http://api.jisuapi.com/news/get?channel=%E8%B4%A2%E7%BB%8F&start=0&num=10&appkey=ff1206dfe586a705",{},function (data) {
    //     console.log(data);
    // })
    $.ajax({
        //你请求的地址
        url: "https://api.jisuapi.com/news/get",
        //你请求的方式
        type: "GET",
        data: {
            //这两个是shopapi网址提供接口必传的参数
            channel: channel,
            appkey: "ff1206dfe586a705",
            num:5,
            start:start
        },
        //返回值类型JSON
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "success_jsonpCallback",
        success: function (data) {
            //data是从服务器端返回来的数据
            var res = data.result;
            var list = res.list;
            for (var i in list) {
                res.list[i].plainText = getSimpleText(res.list[i].content);
            }
            console.log(res);
            showList(res);
        },
        error: function () {
            //如果请求失败
            console.log("请求失败");
        }
    })
}

function getArticleDetail(title){
    $.ajax({
        //你请求的地址
        url: "https://api.jisuapi.com/news/get",
        //你请求的方式
        type: "GET",
        data: {
            //这两个是shopapi网址提供接口必传的参数
            channel: "财经",
            appkey: "ff1206dfe586a705",
            num:"40"
        },
        //返回值类型JSON
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "success_jsonpCallback",
        success: function (data) {
            //data是从服务器端返回来的数据
            var res = data.result;
            var list = res.list;
            for (var i in list) {
                if(list[i].title==title){
                    var li=list[i];
                    $("#adetail").html(li.content);
                    $("#src").text(li.src);
                    $("#time").text(li.time);
                }
            }
            console.log(res);
        },
        error: function () {
            //如果请求失败
            console.log("请求失败");
        }
    })
}

//html剔除富文本标签，留下纯文本
function getSimpleText(html) {
    var re1 = new RegExp("<.+?>", "g");//匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
    var msg = html.replace(re1, '');//执行替换成空字符
    return msg;
}


$(".academy-index-content").on("click",".a-title",function(){
    var title=$(this).text().trim();
    localStorage.setItem("title",title);
    location.href="article_detail.html";
})

$("#more").on("click",function(){
    var len=$(".academy-list").length;
    getNews(len,"财经");
})
/**
 * Created by pc on 2017/4/6.
 */
var apage=1;
$(".academy-index-tab li").on("click", function () {
    $(".academy-index-tab li").removeClass("active");
    $(this).addClass("active");
    var type=$(this).data("type");
    clearList();
    if(type==1){
        getNews(0, "财经");
    }else if(type==2){
        getArticle(1)
    }
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
function showList1(data) {
    console.log(data);
    var html = template("article1", data);
    $(".academy-index-content").append(html);
}
function clearList() {
    $(".academy-index-content").html("");
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
    dialog = new TipBox({
        type: 'load',
        str: "加载中,请稍后",
        setTime: 10000,
        hasMask: true
    });
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
            dialog.close();
        },
        error: function () {
            //如果请求失败
            console.log("请求失败");
            dialog.close();
        }
    })
}

function getNewsDetail(title){
    dialog = new TipBox({
        type: 'load',
        str: "加载中,请稍后",
        setTime: 10000,
        hasMask: true
    });
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
                    console.log(li);
                    dialog.close();
                    return;
                }
            }
        },
        error: function () {
            //如果请求失败
            console.log("请求失败");
            dialog.close();
        }
    })
}

function getArticle(page) {
    dialog = new TipBox({
        type: 'load',
        str: "加载中,请稍后",
        setTime: 10000,
        hasMask: true
    });
    $.ajax({
        //你请求的地址
        url: "http://gank.io/api/search/query/测试/category/all/count/5/page/"+page,
        //你请求的方式
        type: "GET",
        data: {},
        //返回值类型JSON
        dataType: "json",
        success: function (data) {
            //data是从服务器端返回来的数据
            apage++;
            var list = data.results;
            for (var i in list) {
                data.results[i].plainText = getSimpleText(data.results[i].readability);
            }
            showList1(data);
            dialog.close();
        },
        error: function () {
            dialog.close();
            //如果请求失败
            console.log("请求失败");
        }
    })
}

function getAtriclesDetail(gid){
    dialog = new TipBox({
        type: 'load',
        str: "加载中,请稍后",
        setTime: 10000,
        hasMask: true
    });
    $.ajax({
        //你请求的地址
        url: "http://gank.io/api/search/query/测试/category/all/count/20/page/1",
        //你请求的方式
        type: "GET",
        data: {},
        //返回值类型JSON
        dataType: "json",
        success: function (data) {
            //data是从服务器端返回来的数据
            var list = data.results;
            for (var i in list) {
                if(list[i].ganhuo_id==gid){
                    var li=list[i];
                    $("#adetail").html(li.readability);
                    $("#who").text(li.who);
                    $("#time").text(transformTime(li.publishedAt));
                    console.log(li.readability);
                    return;
                }
            }
            dialog.close();
        },
        error: function () {
            //如果请求失败
            console.log("请求失败");
            dialog.close();
        }
    })
}

//html剔除富文本标签，留下纯文本
function getSimpleText(html) {
    var re1 = new RegExp("<.+?>", "g");//匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
    var msg = html.replace(re1, '');//执行替换成空字符
    return msg;
}

function transformTime(time){
    var index1=time.indexOf("T");
    return time.substring(0,index1)+" "+time.substr(index1+1,8);
}


$(".academy-index-content").on("click",".a-title",function(){
    var title=$(this).text().trim();
    localStorage.setItem("title",title);
    location.href="news_detail.html";
})

$(".academy-index-content").on("click",".a-title1",function(){
    var gid=$(this).data("gid");
    console.log(gid);
    localStorage.setItem("gid",gid);
    location.href="article_detail.html";
})

$("#more").on("click",function(){
    var len=$(".news").length;
    if(len){
        getNews(len,"财经");
    }else{
        getArticle(apage);
    }
})

if(template){
    template.helper('getTime', function(time) {
        var index1=time.indexOf("T");
        return time.substring(0,index1)+" "+time.substr(index1+1,8);
        //return time;
    });
}
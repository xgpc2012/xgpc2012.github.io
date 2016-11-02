/**
 * Created by appcan on 2016/9/8.
 */
define(function () {
    var timer = null;
    var alpha = 1;
    //跨浏览器的事件处理程序
    var EventUtil = {
        //添加事件
        addHandler: function (element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },
        getEvent: function (event) {
            return event ? event : window.event;
        },
        getTarget: function (event) {
            return event.target || event.srcElement;
        },
        preventDefault: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        //移除事件
        removeHandler: function (element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        },
        stopPropagation: function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }
    };

    //侧边栏收缩展开
    var startMove = function (iTarget, speed, el) {
        clearInterval(timer);
        timer = setInterval(function () {
            if (el.offsetLeft == iTarget) {
                clearInterval(timer);
            } else {
                el.style.left = el.offsetLeft + speed + "px";
            }
        }, 30)
    };

    //淡入淡出
    var hide = function (speed, el) {
        clearInterval(timer);
        timer = setInterval(function () {
            if (alpha == 1) {
                clearInterval(timer);
            } else {
                alpha -= 10000/speed;
                el.style.filter = "alpha(opacity:" + alpha + ")";
                el.style.opacity = alpha / 100;
            }
        }, 50)
    };

    var show = function (speed, el) {
        clearInterval(timer);
        timer = setInterval(function () {
            if (alpha == 100) {
                clearInterval(timer);
            } else {
                alpha += 10000/speed;
                el.style.filter = "alpha(opacity:" + alpha + ")";
                el.style.opacity = alpha / 100;
            }
        }, 50)
    };

    var AJAX = function (url, type, data) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log(xhr.readyState + " " + new Date());
        }
        xhr.onload = function (event) {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    console.log(xhr.responseText);
                } else {
                    console.log("Request was unsuccessful: " + xhr.status);
                }
            }
        };
        xhr.onprogress = function (event) {
            var divStatus = document.getElementById("status");
            if (event.loaded) {

            }
        };
        xhr.open(type, url, true);
        xhr.send(data);
    };

    var getEl= function (id) {
        return document.getElementById(id);
    }

    return {
        show:show,
        hide:hide,
        startMove: startMove,
        getEl:getEl,
        AJAX:AJAX,
        EventUtil:EventUtil
    }
})
//var apiServer = "http://172.16.2.206:8080";
//var apiServer = "http://localhost:8080";
//var username = null;
//var realname = null;

var fillMainInfo = function(username){
    var fields = ['title', 'location', 'qq', 'email', 'phone', 'mobilePhone'];
    var callback = function(data){
        if(data.success && data.result!=null) {
            var info = data.result;
            for(var i in info){
                if(fields.indexOf(i) < 0) {
                    continue;
                }
                if(info[i] == null) {
                    info[i] = '暂无';
                }
                $('.'+i).text(info[i]);
            }
        }
    };
    $.qa.getPersonalInfo(username, callback);
};

var createHistoryItem = function(item){
    var caption = item.brand+' '+item.phoneVersion;
    var html = '';
    html += '<div class="item">' +
    '<a href=phoneDetails.html?uuid='+item.uuid+ '>' +
    '<img alt="'+caption+'"src="img/iphone.jpg" width="150px" height="150px" style="margin-left: -32px;"/></a>' +
    '<div class="caption" title="'+caption+'"><p>'+caption+'</p></div>' +
    '<div class="historyData" style="margin-left: 100px;margin-top: -130px;width: 338px;">';
    if(item.history!=null) {
        for(var i=0; i<item.history.length; i++) {
            var h = item.history[i];
            var c = '';
            if(h.toTime == null) {
                h.toTime = '现在';
                c = 'historyNow';
            }
            html += '<div class="'+c+'">'+h.fromTime + ' ~ ' + h.toTime+'</div>';
        }
    }
    html += '</div></div>';
    return html;
};

var createHistoryHTML = function(realname){
    var callback = function(data){
        if(data.success && data.result!=null) {
            var items = data.result;
            var html = '';
            for(var i=0; i< items.length; i++){
                html += createHistoryItem(items[i]);
            }
            $('.items').html(html);
            var using = $('.historyNow').length;
            var used = items.length - using;
            $('.phoneHistory .sectionTitle').text('设备 ('+using+'台使用中，'+used+'台使用过)');
        }
    }
    $.qa.getPhoneHistoryByOwner(realname, callback);
};
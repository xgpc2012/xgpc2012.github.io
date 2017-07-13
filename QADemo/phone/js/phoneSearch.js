//var apiServer = 'http://172.16.2.206:8080';
var searchParams = {};
var state = ['', '正常', '遗失', '损坏', '报废', '其他'];
var filters = {
    brand: '品牌',
    chargingPortType: '充电口',
    customizeOSName: '定制系统名',
    customizeOSVersion: '定制系统版本',
    location: '位置',
    osCategory: '系统分类',
    osVersion: '系统版本',
    owner: '所有人',
    phoneVersion: '机型',
    phoneVersionDetails: '机型详细',
    ram: '内存',
    screenInches: '屏幕尺寸',
    screenPpi: '屏幕像素',
    screenResolution: '屏幕分辨率',
    state: '状态',
    timeToMarket: '上市时间'
};

var searchCallback = function (data) {
    var html = '';
    if (data.result != null) {
        $.each(data.result, function (index, item) {
            html += createPhoneItemHtml(item);
        });
    }
    if (html.length == 0) {
        html = '<p style="font-size:3em;color:red;margin: 40px 0px;">该筛选条件下没有搜索结果</p>';
    }
    $('.items').html(html);
};

var showMore = function (target) {
    var osCategory = searchParams.osCategory;
    var $li = $(target).parent();
    $li.hide();
    $li.siblings(".less").show();
    if(!$(target).hasClass('osVersion') || osCategory === undefined) {
        $li.siblings(".filter").show();
    } else if(osCategory == 'Android') {
        $li.siblings('[data-tag="Android"]').show();
    }
    else if(osCategory == 'iOS') {
        $li.siblings('[data-tag="iOS"]').show();
    }

};
var showLess = function (target) {
    var osCategory = searchParams.osCategory;
    var $li = $(target).parent();
    $li.hide();
    $li.siblings(".more").show();
    if(!$(target).hasClass('osVersion') || osCategory === undefined) {
        $li.siblings(".moreItem").hide();
    } else {
        refreshOSVersionFilter(osCategory);
    }
};

var createFilterHtml = function (items, filter) {
    var html = '';
    var amount = {'a': 0, 'i': 0};
    var os = {'a': 'Android', 'i': 'iOS'};
    for (var i = 0; i < items.length; i++) {
        var name = items[i];
        var dataTag = '';
        if (filter == 'osVersion') {
            var tag = items[i].slice(0, 1);
            amount[tag] += 1;
            dataTag = os[tag];
            name = items[i].slice(1);
        } else if (filter == 'state') {
            name = state[items[i]];
        }

        var className = 'filter';
        if (i > 4) {
            className += ' moreItem';
        }
        if (amount.a > 5 || amount.a == 0 || dataTag=='iOS') {
            className += ' Android';
        }
        if (amount.i > 5 || amount.i == 0 || dataTag=='Android') {
            className += ' iOS';
        }

        html += '<li class="' + className + '" data-tag="' + dataTag + '" data-key="' + filter + '" data-value="' + items[i] + '">' + name + '</li>';
    }
    if (items.length > 5) {
        html += '<li class="more"><div class="'+filter+'" onclick="showMore(this);">更多</div></li>';
        html += '<li class="less" style="display:none;"><div onclick="showLess(this);">收起</div></li>';
    }
    return html;
};

var createFilterItemHtml = function (item) {
    var html = '<div  id="' + item.filter + '" class="filterItem">' +
        '<div class="filterText box center">' + filters[item.filter] + '</div>' +
        '<ul>' +
        createFilterHtml(item.filterList, item.filter) +
        '</ul></div>' + '<br>';
    return html;
};

var hideMore = function($moreItem, hideType){
    var $target = $('#osVersion');
    $('.more', $target).hide();
    if ($moreItem.length > 0) {
        $moreItem.hide();
        var $more = $moreItem;
        if(hideType != ''){
            $more = $('#osVersion .'+hideType+'[data-tag="'+hideType+'"]');
        }
        if($more.length > 0) {
            $('.more', $target).show();
        }
    }
};

var refreshOSVersionFilter = function (hideType) {
    var $target = $('#osVersion');
    $('.filter', $target).show();
    $('.less', $target).hide();
    if (hideType == 'moreItem') {
        var $moreItem = $('.moreItem', $target);
        hideMore($moreItem, '');
    } else if (hideType == 'Android') {
        var $moreItem = $('.Android', $target);
        hideMore($moreItem, hideType);
    } else if (hideType == 'iOS') {
        var $moreItem = $('.iOS', $target);
        hideMore($moreItem, hideType);
    }
};

var refreshFilter = function (data) {
    var items = data.result;
    var html = '';
    $.each(items, function (index, item) {
        html += createFilterItemHtml(item);
    });
    html += '<button class="filter-btn btn btn-primary" style="visibility:hidden;">确定筛选</button>';
    html += '<button class="filter-clear btn btn-primary" style="visibility:hidden;">清除筛选</button>';
    $('.filter-list').html(html);

    //绑定监听事件
    $('.filter-btn').on('click', function (e) {
        $.qa.search(searchParams, searchCallback);
    });

    $('.filter-clear').on('click', function () {
        $('.filter').removeClass('active');
        searchParams = {};
        $.qa.search(searchParams, searchCallback);
        $('.filter-btn').css('visibility', 'hidden');
        $('.filter-clear').css('visibility', 'hidden');

        refreshOSVersionFilter('moreItem');
    });

    $('.filter').on('click', function (e) {
        if (JSON.stringify(searchParams) == '{}') {
            $('.filter-btn').css('visibility', 'visible');
            $('.filter-clear').css('visibility', 'visible');
        }
        var $target = $(e.target);
        var key = $target.attr('data-key');
        var value = $target.attr('data-value');
        delete searchParams[key];
        $target.siblings('li').removeClass('active');
        if (!$target.hasClass('active')) {
            $target.addClass('active');
            searchParams[key] = value;
        } else {
            $target.removeClass('active');
        }
        if (JSON.stringify(searchParams) == '{}') {
            $('.filter-btn').css('visibility', 'hidden');
            $('.filter-clear').css('visibility', 'hidden');

            refreshOSVersionFilter('moreItem');
        }

        //选中Android或iOS等系统分类时，系统版本号只显示相关选项
        if (key == 'osCategory') {
            if (searchParams.osCategory == undefined){
                refreshOSVersionFilter('moreItem');
            } else if (searchParams.osCategory == 'Android') {
                refreshOSVersionFilter('Android');
            } else if (searchParams.osCategory == 'iOS') {
                refreshOSVersionFilter('iOS');
            }
        }
    });

};



var createPhoneItemHtml = function (item) {
    if (!item.image || item.iamge == 'null') {
        item.image = 'img/default.png';
    }
    var title = item.brand + ' ' + item.phoneVersion + ' ' + item.phoneVersionDetails;
    var name = item.brand + ' ' + item.phoneVersion;
    var html = '<div class="item" style="float:left">' +
        '<div class="thumbnail">' +
        '<a href="phoneDetails.html?uuid=' + item.uuid + '">' +
        '<img src="' + item.image + '" alt="..." class="img-circle team-img">' +
        '<div class="caption">' +
        '<h3 title="' + title + '">' + name + '</h3>' +
        '<p>' + item.osCategory + ' / ' + (item.osVersion && item.osVersion.slice(1)) + '</p>' +
        '<p>' + item.owner + ' / ' + item.location + ' / ' + state[item.state] + '</p>' +
        '</div>' +
        '</a>' +
        '</div>' +
        '</div>';
    return html;
};

var keywordSearch = function () {
    searchParams["keyword"] = $('.keywordSearch').val();
    $.qa.search(searchParams, searchCallback);
    delete searchParams["keyword"];
};

(function () {


}());


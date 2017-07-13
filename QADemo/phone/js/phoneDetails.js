(function () {
    var url = 'phoneDetails.html?uuid=' + uuid;
    link = 'login.html?source=' + encodeURIComponent(url);
    $('.login > a').attr('href', link);

    var fields = ['brand', 'phoneVersion', 'phoneVersionDetails', 'timeToMarket', 'osCategory', 'osVersion', 'customizeOSVersion', 'customizeOSName', 'screenInches', 'screenResolution', 'screenPpi', 'ram', 'chargingPortType', 'owner', 'location', 'state', 'price', 'buyTime'];
    var state = ['', '正常', '遗失', '损坏', '报废', '其他'];
    var fillPhoneInfo = function (items) {
        if (items && items.length > 0) {
            var item = items[0];

            for (var k in item) {
                if (fields.indexOf(k) < 0) {
                    continue;
                }
                if (item[k] == null) {
                    item[k] = '';
                }
                else if (k == 'state') {
                    item[k] = state[item[k]];
                }
                var name = item[k];
                if (k == 'osVersion') {
                    name = name.slice(1);
                }
                $('.' + k).text(name);
                if (k == 'osCategory' && item[k] == 'Android') {
                    $('.customize').show();
                }
            }
        }
    };

    var fillHistoryInfo = function (items) {
        if (!items || items.length <= 0) {
            return;
        }
        items[0].toTime = "现在";
        var html = '<div class="row"><div class="sectionTitle col-md-12">手机使用历史</div></div>';
        for (var i = 0; i < items.length; i++) {
            html += '<div class="">' +
            '<div class="row">' +
            '<div class="col-md-4 col1">' + items[i].fromTime + '</div>' +
            '<div class="col-md-4 col2">' + items[i].toTime + '</div>' +
            '<div class="col-md-4 col3">' + items[i].owner + '</div>' +
            '</div></div>';
        }
        $('.phoneHistory').html(html);
    };

    $.qa.getPhoneDetails(uuid, fillPhoneInfo);
    $.qa.getPhoneHistory(uuid, fillHistoryInfo);

}());
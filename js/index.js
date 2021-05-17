'use strict';
const Page = {};
const Panel = {};
Panel.regionBar = {};
Page.ajax.sendRequest = function(url, method, data) {
    var d = $.Deferred();
    method = method || "GET";
    $.ajax(url, {
        method: method || "GET",
        data: data,
        cache: false,
        xhrFields: { withCredentials: true }
    }).done(function(result) {
        if (result.status) {
            d.resolve(method === "GET" ? result.data : result);
        } else {
            DevExpress.ui.notify("執行失敗", "error", 3000);
            d.reject(result.message);
        };
    }).fail(function(xhr) {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
        DevExpress.ui.notify("連線失敗", "error", 3000);
    });
    return d.promise();
}
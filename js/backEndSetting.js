$(function () {
    var url = "http://127.0.0.1:8100";
    var Store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (key) {
            return sendRequest(url + "/backEndSetting/getData");
        },
        insert: function(values) {
            return sendRequest(url + "/InsertOrder", "POST", {
                values: JSON.stringify(values)
            });
        },
        update: function(key, values) {
            return sendRequest(url + "/UpdateOrder", "PUT", {
                key: key,
                values: JSON.stringify(values)
            });
        },
        remove: function(key) {
            return sendRequest(url + "/DeleteOrder", "DELETE", {
                key: key
            });
        }
    });
    $("#gridContainer").dxDataGrid({
        dataSource: Store,
        repaintChangesOnly: true,
        showBorders: true,
        paging: {
            enabled: 10
        },
        editing: {
            mode: "row",
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            useIcons: true,
        },
        columns: [
            {
                dataField: "name",
                caption: "模式",
            },
             {
                dataField: "ip",
                // dataType: "number",
                caption: "ip",
            },
            {
                dataField: "port",
                // dataType: "number",
                caption: "port",
            }
        ],
      
    });
    function sendRequest(url, method, data) {
        var d = $.Deferred();
        method = method || "GET";

        $.ajax(url, {
            method: method || "GET",
            data: data,
            cache: false,
            xhrFields: { withCredentials: false }
        }).done(function (result) {
            // console.log(result)
            if (result.status) {
                if (method == "POST") {
                    DevExpress.ui.notify("執行成功", "success", 800);
                } else if (method == "PUT") {
                    DevExpress.ui.notify("已更新", "success", 3000);
                }
            d.resolve(method === "GET" ? result.data : result);
            } else {
                DevExpress.ui.notify("執行失敗", "error", 3000);
                d.reject(result.message);
            }

        }).fail(function (xhr) {
            DevExpress.ui.notify("連線失敗", "error", 3000);
            d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
        });
        return d.promise();
    }
});


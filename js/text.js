$(function () {
    var url = "http://127.0.0.1:8100";
    $.ajax({
        url: url + "/getForm",
        type: 'GET',
        success: function (result) {
            if (result.status) {
                console.log(result,"result")
                $("#form").dxForm({
                    formData: result,
                    items: [{
                        itemType: "group",
                        cssClass: "first-group",
                        colCount: 1,
                        items: [{
                            template: "<div class='form-avatar'></div>"
                        }, {
                            dataField: "projectTitle",
                            label: {
                                text: "專案名稱"
                            }
                        }]
                    }, {
                        itemType: "group",
                        cssClass: "second-group",
                        items: [ {
                            colCount: 3,
                            itemType: "group",
                            caption: "結構名稱",
                            items: [{
                                dataField: "structureTitle.Layer1",
                                label: {
                                    text: "階層1"
                                }
                            }, {
                                dataField: "structureTitle.Layer2",
                                label: {
                                    text: "階層2"
                                }
                            }, {
                                dataField: "structureTitle.Layer3",
                                label: {
                                    text: "階層3"
                                }
                            }]
                        }]
                    }]
                }).dxForm("instance");
            }
        },
        error: function (result) {
            DevExpress.ui.notify("連線錯誤", "error", 3000);
        }
    });
     $.ajax({
            url: url + "/backEndSetting/getData",
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                if (result.status) {
                    console.log(result,"====")
                    $("#server").dxSelectBox({
                        displayExpr: "name",
                        dataSource: result.data,
                        value: result[0],
                        onValueChanged: function(data) {
                           form2.option("formData", data.value);
                        }
                    });
                    var form2 = $("#form2").dxForm({
                        formData:result,
                        readOnly: true,
                        labelLocation: "top",
                        showColonAfterLabel: true,
                        items:[{
                            colCount: 1,
                            itemType: "group",
                            caption: "結構名稱",
                            items: [{
                                dataField: "result.ip",
                                label: {
                                    text: "ip"
                                }
                            }, {
                                dataField: "result.port",
                                label: {
                                    text: "port"
                                }
                            }]
                        }]
                    }).dxForm("instance");
                    DevExpress.ui.notify("獲取成功", "success", 3000);
                } else {
                    DevExpress.ui.notify("獲取失敗", "error", 3000);
                }
            },
            error: function (result) {
                DevExpress.ui.notify("連線錯誤", "error", 3000);
            }
        });
   
    $("#send").dxButton({
        stylingMode: "contained",
        text: "確認",
        type: "success",
        width: 120,
        onClick: function() {
            $('#form').dxForm('instance').validate();
            var data = $('#form').dxForm('instance').option('formData');  
            console.log(data,"data")
            $.ajax({
                url: url + '/putForm',
                type: 'PUT',
                data: JSON.stringify(data),
                success: function (result) {
                    if (result.status) {
                        DevExpress.ui.notify("儲存成功99", "success", 3000);
                    } else {
                        DevExpress.ui.notify("儲存失敗", "error", 3000);
                    }
                },
                error: function (result) {
                    DevExpress.ui.notify("連線失敗", "error", 3000);
                },
            });
        }
    });
    var Store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (key) {
            return sendRequest(url + "/getApi");
        },
        // update: function(key, values) {
        //     DevExpress.ui.notify("已更新", "success", 800);
        //     editRowObj = null;
        //     return sendRequest("update" + "/L1" + "?id=" + key, "PUT", JSON.stringify(values));
        // },
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
            allowUpdating: true,
            useIcons: true,
        },
        columns: [
            {
                dataField: "text",
                caption: "名稱",
                allowEditing: false
            },
            {
                dataField: "modeID",
                caption: "模式",
                lookup: {
                    dataSource: function(options) {
                        return {
                            store: new DevExpress.data.CustomStore({
                                key: "id",
                                loadMode: "raw",
                                load: function () {
                                    return sendRequest(url + "/getMode");
                                }
    
                            }),
                            filter: options.data ? ["nameID", "=", options.data.modeID] : null
                        };
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                }
            },
            {
                dataField: "iconID",
                caption: "圖示",
                lookup: {
                    dataSource: {
                        paginate: true,
                        store: new DevExpress.data.CustomStore({
                            key: "id",
                            loadMode: "raw",
                            load: function () {
                                return sendRequest(url + "/getIcon");
                            }
                        }),
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                }
            }, {
                dataField: "enable",
                dataType: "boolean",
                caption: "是否開啟",
            }
        ],
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                var currentEmployeeData = options.data;
                $("<div>")
                    .dxDataGrid({
                        columnAutoWidth: true,
                        dataSource: new DevExpress.data.DataSource({
                            store: new DevExpress.data.CustomStore({
                                key: "id",
                                load: function () {
                                    return sendRequest(url + "/getSecondApi");
                                },
                                // update: function (key, values) {
                                // },
                            }),
                            filter: ["nameID", "=", options.data.modeID]
                        }),
                        showBorders: true,
                        editing: {
                            mode: "row",
                            allowUpdating: true,
                            useIcons: true,
                        },
                        columns: [{
                            dataField: "text",
                            caption: "名稱",
                            allowEditing: false
                        }, {
                            dataField: "iconID",
                            caption: "圖示",
                            lookup: {
                                dataSource: {
                                    paginate: true,
                                    store: new DevExpress.data.CustomStore({
                                        key: "id",
                                        loadMode: "raw",
                                        load: function () {
                                            return sendRequest(url + "/getIcon");
                                        }
                                    }),
                                },
                                valueExpr: "id",
                                displayExpr: "name"
                            }
                        }, {
                            dataField: "modeID",
                            caption: "模式",
                            lookup: {
                                dataSource: function(options) {
                                    return {
                                        store: new DevExpress.data.CustomStore({
                                            key: "id",
                                            loadMode: "raw",
                                            load: function () {
                                                return sendRequest(url + "/getSecondMode");
                                            }
                
                                        }),
                                        filter: options.data ? ["nameID", "=", options.data.modeID] : null
                                    };
                                },
                                valueExpr: "id",
                                displayExpr: "name"
                            }
                        }, {
                            dataField: "enable",
                            caption: "是否開啟",
                            dataType: "boolean",
                            calculateCellValue: function (rowData) {
                                if (rowData.enable == true) {
                                    return options.data.enable == true;
                                }
                                return options.data.enable == false;
                            }
                        }],
                       
                    }).appendTo(container);
            }
        }
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

var companies = [{
    "ID": 1,
    "Name": "Super Mart of the West",
    "Address": "702 SW 8th Street",
    "City": "Bentonville",
    "State": "Arkansas",
    "ZipCode": 72716,
    "Phone": "(800) 555-2797",
    "Fax": "(800) 555-2171",
    "Website": "http://www.nowebsitesupermart.com"
}, {
    "ID": 2,
    "Name": "Electronics Depot",
    "Address": "2455 Paces Ferry Road NW",
    "City": "Atlanta",
    "State": "Georgia",
    "ZipCode": 30339,
    "Phone": "(800) 595-3232",
    "Fax": "(800) 595-3231",
    "Website": "http://www.nowebsitedepot.com"
}, {
    "ID": 3,
    "Name": "K&S Music",
    "Address": "1000 Nicllet Mall",
    "City": "Minneapolis",
    "State": "Minnesota",
    "ZipCode": 55403,
    "Phone": "(612) 304-6073",
    "Fax": "(612) 304-6074",
    "Website": "http://www.nowebsitemusic.com"
}, {
    "ID": 4,
    "Name": "Tom's Club",
    "Address": "999 Lake Drive",
    "City": "Issaquah",
    "State": "Washington",
    "ZipCode": 98027,
    "Phone": "(800) 955-2292",
    "Fax": "(800) 955-2293",
    "Website": "http://www.nowebsitetomsclub.com"
}];
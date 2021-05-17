$(function () {
    var url = "http://127.0.0.1:8100";
    $.ajax({
        url: url + "/getForm",
        type: 'GET',
        success: function (result) {
            if (result.status) {
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
                        colCount: 2,
                        items: [{
                            itemType: "group",
                            caption: "伺服器",
                            items: [{
                                dataField: "server.mode",
                                editorType: "dxSelectBox",
                                label: {
                                    text: "模式"
                                },
                                editorOptions: {
                                    dataSource: {
                                        paginate: true,
                                        store: new DevExpress.data.CustomStore({
                                            key: "id",
                                            loadMode: "raw",
                                            load: function () {
                                                return sendRequest(url + "/server/getMode");
                                            }
                                        }),
                                    },
                                    onValueChanged: function(data) {
                                        console.log(data,"data")
                                        // ip.option("dataSource", data.value);
                                    },
                                    valueExpr: "id",
                                    displayExpr: "name"
                                },
                            }, {
                                dataField: "server.ip",
                                editorType: "dxSelectBox",
                                label: {
                                    text: "ip"
                                },
                                editorOptions:{
                                    dataSource: function(options){
                                        console.log(options,"options")
                                        return{
                                            store: new DevExpress.data.CustomStore({
                                                key: "id",
                                                // loadMode: "raw",
                                                load: function () {
                                                    return sendRequest(url + "/server/getIp");
                                                }
                                            }),
                                            filter: options.data ? ["severmodeID", "=", options.data.server.mode] : null
                                        }
                                    },

                                //     dataSource: {
                                //         paginate: true,
                                //         store: new DevExpress.data.CustomStore({
                                //             key: "id",
                                //             loadMode: "raw",
                                //             load: function () {
                                //                 return sendRequest(url + "/server/getIp");
                                //             }
                                //         }),
                                //     },
                                //     valueExpr: "id",
                                //     displayExpr: "name"
                                }
                            }, {
                                dataField: "server.port",
                                label: {
                                    text: "port"
                                },
                                validationRules:[{
                                   type:"numeric",
                                   message: "必須填寫數字"
                                }]
                            }]
                        }, {
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
                // var server = $("#server").dxSelectBox({
                //     displayExpr: "name",
                //     // dataSource: companies,
                    // dataSource: {
                    //     paginate: true,
                    //     store: new DevExpress.data.CustomStore({
                    //         key: "id",
                    //         loadMode: "raw",
                    //         load: function () {
                    //             return sendRequest(url + "/sever/getMode");
                    //         }
                    //     }),
                    // },
                //     valueExpr: "id",
                
                    // onValueChanged: function(data) {
                    //     console.log(data,"data")
                    //     ip.option("dataSource", data.value);
                    // }
                // }).dxSelectBox("instance");
                // var ip = $("#ip").dxSelectBox({
                //     dataSource: {
                //         paginate: true,
                //         store: new DevExpress.data.CustomStore({
                //             key: "id",
                //             loadMode: "raw",
                //             load: function () {
                //                 return sendRequest(url + "/sever/getIp");
                //             }
                //         }),
                //     },
                //     valueExpr: "id",
                //     displayExpr: "name",
                //     // value: companies[0],
                //     onValueChanged: function(data) {
                //         port.option("dataSource", data.value);
                //     }
                // }).dxSelectBox("instance");
                // var port = $("#port").dxSelectBox({
                //     displayExpr: "Name",
                //     dataSource: companies,
                //     value: companies[0],
                //     onValueChanged: function(data) {
                //        form.option("formData", data.value);
                //     }
                // });
               

                $("#send").dxButton({
                    stylingMode: "contained",
                    text: "確認",
                    type: "success",
                    width: 120,
                    onClick: function() {
                        $('#form').dxForm('instance').validate();
                        var data = $('#form').dxForm('instance').option('formData');  
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
            }
        },
        error: function (result) {
            DevExpress.ui.notify("連線錯誤", "error", 3000);
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
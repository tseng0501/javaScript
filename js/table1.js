// var port = "20000"
var port = "8100"

var store = new DevExpress.data.CustomStore({
    key: "ServiceID",
    load: function (loadOptions) {
        var deferred = $.Deferred()
        args = {};
        [].forEach(function (i) {
            if (i in loadOptions && isNotEmpty(loadOptions[i]))
                args[i] = JSON.stringify(loadOptions[i]);
        });
        $.ajax({
            url: "http://127.0.0.1:" + port + "/api/deploymentlist",
            dataType: "json",
            type: 'GET',
            success: function (result) {
                deferred.resolve(result.data);

                DevExpress.ui.notify("連線成功1", "success", 3000);
            },
            error: function () {
                DevExpress.ui.notify("連線失敗", "error", 3000);
            },
        });
        return deferred.promise();
    },
});
$(function () {
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== "";
    }
    document.getElementById("scrollview").style.display = "none"; //一開始隱藏scrollview元素
    var editRowKey;
    var editRowObj = {};
    var grid = $("#gridContainer").dxDataGrid({
        dataSource: store,
        showBorders: true,
        remoteOperations: false,
        noDataText: "尚未有任何資料",
        paging: {
            pageSize: 5
        },
        height: 400,
        sorting: {
            mode: "multiple",
            showSortIndexes: false,
            ascendingText: "升序",
            descendingText: "降序",
            clearText: "清除排序"
        },
        onEditingStart: function (e) {
            editRowKey = e.key;
            editRowObj = e.data;
        },
        onInitNewRow: function (e) {
            editRowKey = 0;
        },
        columns: [{
            dataField: "ServiceName",
            caption: "服務名稱",
            dataType: "string"
        }, {
            dataField: "ServiceNameDescription",
            caption: "服務說明",
            dataType: "string"
        }, {
            dataField: "isDeployedBool",
            caption: "是否已佈署",
            dataType: "boolean"
        },
        {
            dataField: "isRunningBool",
            caption: "是否正在運行",
            dataType: "boolean"
        },
        {
            width: '6rem',
            alignment: 'center',
            cellTemplate: function (container, options) {
                if (options.data.isRunningBool == true) {
                    return $("<div>").append(
                        $("<div class = stop_btn>").dxButton({
                            text: "中止",
                            type: "danger",
                            useSubmitBehavior: true,
                            onClick: function (e) {
                                var id = options.row.data.ServiceID //個別資料的id
                                var stopURL = "http://127.0.0.1:" + port + "/api/killrunserver?id=" + id;

                                $.ajax({
                                    url: stopURL,
                                    type: "GET",
                                    success: function (result) {
                                        if (result.status == true) {
                                            document.getElementById("blog").style.display = "none"; //這個區塊隱藏

                                            DevExpress.ui.notify("中止成功", "success", 3000);
                                            grid.option('loadPanel.enabled', false);
                                            grid.refresh();

                                        } else {
                                            DevExpress.ui.notify("中止失敗", "error", 3000);
                                        }
                                    },
                                    error: function (result) {
                                        DevExpress.ui.notify("連線失敗", "error", 3000);
                                    }
                                });
                                refresh_send = 1; //1為不刷新的時候
                            }
                        }).appendTo(container));
                } else if (options.data.isDeployedBool == false && options.data.isRunningBool == false) {
                    return $("<div>").append(
                        $("<div class = deployment_btn>").dxButton({
                            text: "佈署",
                            type: "default",
                            useSubmitBehavior: true,
                            onClick: function (e) {
                                workingajax(options);
                                refresh_send = 0; //0為刷新的時候
                            }

                        }).appendTo(container));

                } else if (options.data.isDeployedBool == true && options.data.isRunningBool == false) {
                    return $("<div>").append(
                        $("<div class = working_btn>").dxButton({
                            text: "運行",
                            type: "success",
                            useSubmitBehavior: true,
                            onClick: function (e) {
                                workingajax(options);
                                refresh_send = 0;

                            }
                        }).appendTo(container));
                }
            }
        }, {
            type: "buttons",
            width: "4rem",
            buttons: [{
                hint: "查看",
                text: "查看",
                icon: "/static/images/paper.svg",
                onClick: function (e) {
                    viewajax(e);
                    refresh_send = 0;

                }
            }]
        }
        ],
        summary: {
            totalItems: [{
                column: "ServiceName",
                summaryType: "count",
                displayFormat: "總計: {0} ",
            }]
        }
    }).dxDataGrid("instance");

    function workingajax(options) {
        var id = options.row.data.ServiceID
        comlog_sericeID = id

        var url = "http://127.0.0.1:" + port + "/api/deployment?id=" + id;
        $.ajax({
            url: url,
            type: "GET",
            timeout: 0.01,

        });
        var url = "http://127.0.0.1:" + port + "/api/get/cmdlog?id=" + id;

        $.ajax({
            url: url,
            type: "GET",
            success: function (result) {
                var id = options.row.data.ServiceID; //個別資料的id
                var subordinate_title = options.row.data.ServiceName; //標題
                setTimeout(function () { //因為log很久 所以限制跑快一點
                    $("#scrollview-title").html(subordinate_title); //把資料標題放入HTML裡面
                    document.getElementById("blog").style.display = "block"; //這個區塊開啟
                    var resultdata_text = result.data.text.replaceAll('\n', '<br>')

                    $("#scrollview-content").html(resultdata_text); //把資料放入HTML裡面
                }, 0.0001);
                scrollView_load_refresh(id); //scrollview+load+refresh
                DevExpress.ui.notify("執行成功", "success", 3000);
            },
            error: function (result) {
                DevExpress.ui.notify("連線失敗", "error", 3000);
            }
        });
    }
    //查看
    function viewajax(e) {
        var id = e.row.data.ServiceID //個別資料的id
        comlog_sericeID = id
        var url = "http://127.0.0.1:" + port + "/api/get/cmdlog?id=" + id;
        $.ajax({
            url: url,
            type: "GET",
            success: function (result) {
                if (result.status == true) {
                    var result_data_text = result.data.text.replaceAll('\n', '<br>') //\n 換行變成<br>換行
                    var id = e.row.data.ServiceID; //個別資料的id
                    var subordinate_title = e.row.data.ServiceName; //標題
                    setTimeout(function () { //因為log很久 所以限制跑快一點
                        $("#scrollview-title").html(subordinate_title); //把資料標題放入HTML裡面
                        document.getElementById("blog").style.display = "block"; //這個區塊開啟

                        $("#scrollview-content").html(result_data_text); //把資料放入HTML裡面
                    }, 0.0001);
                    scrollView_load_refresh(id); //scrollview+load+refresh
                    DevExpress.ui.notify("執行成功", "success", 3000);
                } else {
                    DevExpress.ui.notify("執行失敗", "error", 3000);
                }
            },
            error: function (result) {
                DevExpress.ui.notify("連線失敗", "error", 3000);
            }
        });
    }
    var refresh_send = 1;
    
    //scrollview+load+refresh
    function scrollView_load_refresh(id) {
        comlog_sericeID = id
        scrolloptions = $("#scrollview").dxScrollView({
            scrollByContent: true, //最終用戶是否可以滾動窗口小部件內容，以向上或向下滑動
            scrollByThumb: true, //最終用戶是否可以使用滾動條滾動窗口小部件內容
            height: 300,
            elementAttr: { //附加到小部件的根元素的屬性。
                id: "scrollview",
                class: "class-name"
            },
        }).dxScrollView("instance");
        document.getElementById("scrollview").style.display = "block"; //開啟scrollView_load_refresh 之後，顯示scrollview元素
        var i_height = scrolloptions.scrollHeight();//獲得dxScrollView內容的高度
        scrolloptions.scrollTo(i_height);//指定滾動到指定的高度


        $.ajax({
            url: "http://127.0.0.1:" + port + "/api/get/cmdlog?id=" + id,
            type: 'GET',
            success: function (result_refresh) { //當請求成功時呼叫的函式
                if (result_refresh.status == true) {
                    var result_refresh_data_text = result_refresh.data.text.replaceAll('\n', '<br>')
                    document.getElementById("blog").style.display = "block"; //這個區塊開啟

                    $("#scrollview-content").html(result_refresh_data_text);

                    DevExpress.ui.notify("執行成功", "success", 3000);
                } else {
                    DevExpress.ui.notify("執行失敗", "error", 3000);
                }
            },
            error: function () { //請求出錯
                DevExpress.ui.notify("連線失敗", "error", 3000);
                clearInterval(timer);
            },
        })

    }
    var comlog_sericeID = null

    var timer = setInterval(function () { //每秒刷新一次
        grid.option('loadPanel.enabled', false); //移除loading的畫面
        grid.refresh();//刷新
        if (refresh_send == 0) { //當為刷新的時候
            scrollView_load_refresh(comlog_sericeID); //每秒刷新底下的scrollView
        }
    }, 1000);
});
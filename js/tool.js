'use strict';
//#region loading Class ------------------------------------------------------
class LocalStorage {
    /**
     * @param {String} param 
     */
    constructor(param) {

        this.sname = param;

        this.run = this.checkBrowserSupport();
    }

    checkBrowserSupport() {

        return typeof(Storage) !== 'undefined' ? true : false;
    }

    /** 將字串儲存到 Local Storage */
    set(value) {
        if (this.run) {

            value = (typeof value !== 'string' ? JSON.stringify(value) : value);

            localStorage.setItem(this.sname, value);
        }
    }

    /** 取得儲存於 Local Storage 的數據 */
    get() {
        if (this.run) {
            const value = localStorage.getItem(this.sname);

            if (value !== null) {
                return (isJSON(value) ? JSON.parse(value) : value);
            }
            return '';
        }
    }

    /** 從 Local Storage 中移除數據 */
    remove() {
        if (this.run) {
            localStorage.removeItem(this.sname);
        }
    }
}
//#endregion loading Class
//#region Class
/** 詢問視窗 */
class Confirm {
    /**
     * @param {Object}      options 
     * @param {String}      options.id          Confirm Html id
     * @param {Object[]}    options.buttons     自定義按鈕，預設為 yes & no.
     * @param {String}      options.buttons.name    識別按鈕的名稱
     * @param {String}      options.buttons.html    顯示於按鈕上的內容
     * @param {String}      options.buttons.type    Bootstrap 類型的 CSS
     * @param {Number}      options.buttons.delay   延遲允許點擊
     * @param {Function}    options.btnEvent    按鈕觸發的事件
     */
    constructor(options) {
        this.id = (options.id || 'Confirm');
        this.buttons = (options.buttons !== undefined && Array.isArray(options.buttons) && options.buttons.length > 0) ?
            options.buttons : [{ name: 'yes', html: '是', type: 'outline-success', }, { name: 'no', html: '否', type: 'outline-danger', }, ];

        this._btnHtml = '';
        for (let i = 0; i < this.buttons.length; i++) {
            const btn = this.buttons[i];
            const type = (btn.type === undefined ? 'outline-secondary' : btn.type);

            this._btnHtml += `<div class="btn btn-${type} ${btn.name}" name="${btn.name}">${btn.html}</div>`;
        }

        this.btnEvent = (options.btnEvent !== undefined && typeof options.btnEvent === 'function') ?
            options.btnEvent :
            function() { console.log('Button no default event!'); };
        this._showDefer = $.Deferred();
        this._closeDefer = $.Deferred();
    };
    /** 顯示詢問視窗
     * @param {String}  content     視窗內容.
     * @param {String}  title       視窗標題.
     */
    show(content, title) {
        const $Confirm = $('body').append(`<div id="${this.id}" class="confirm" style="display: none;"></div>`).find(`#${this.id}`);
        const btnEvent = this.btnEvent;

        $Confirm.html(`
                <div class="shell">
                    <div class="panel">
                        <div class="title"></div>
                        <div class="content"></div>
                        <div class="btn-group-bottom"></div>
                    </div>
                </div>`)
            .find('.title').html((title || '警告！')).end()
            .find('.content').html((content || '是否要繼續執行？')).end()
            .find('.btn-group-bottom').html(this._btnHtml).on('click', '.btn', function() {
                btnEvent($(this).attr('name'));
            }).end()

        .fadeIn(100, () => {
            /** 按鈕延遲允許點擊 */
            function btnDelay(options) {
                const $btn = $Confirm.find(`[name=${options.name}]`);

                Item.enable($btn, false);
                $btn.html(`${options.html} (${options.delay}s)`);
                options.delay--;

                const delay = setInterval(() => {
                    if (options.delay > 0) {
                        $btn.html(`${options.html} (${options.delay}s)`);
                        options.delay--;
                    } else {
                        clearInterval(delay);
                        $btn.html(options.html);
                        Item.enable($btn, true);
                    }
                }, 1000);
            }

            for (let i = 0; i < this.buttons.length; i++) {
                const btn = this.buttons[i];

                if (btn.delay > 0) {
                    btnDelay(btn);
                }
            }
        });

        return this._showDefer.promise();
    }

    /** 關閉詢問視窗 */
    close() {
        const defer = this._closeDefer;

        $(`#${this.id}`).fadeOut(100, function() {
            $(this).remove();
            defer.resolve();
        });

        return this._closeDefer.promise();
    }
}
//#endregion

/** Ajax
 * @param {Object}  options 
 * @param {String}  options.url     請求位置
 * @param {*}       options.data    請求時夾帶的資料
 * @param {Function} options.error      Http請求錯誤時執行
 * @param {Function} options.success    請求成功時執行
 * @param {Function} options.warning    未成功請求時執行
 * @param {Function} options.complete   完成後執行
 * @param {Function} options.beforeSend   完成後執行
 * 
 */
function Ajax(options, debug) {
    const ls = new LocalStorage('config');
    const config = ls.get();

    if (debug) {
        console.log('ajax.start', config.server + '/dashboard' + options.url);
        console.time('ajax.done!');
    }

    options.data = (options.data || {});
    options.data.token = config.token;

    $.ajax({
        // url: config.server + options.url,
        url: options.url,
        type: 'POST',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(options.data),
        dataType: 'json',
        error: function(r) {
            if (debug) {
                console.timeEnd('ajax.done!');
            }

            isFunction(options.error, true, r);

            if (debug) {
                console.log('Http error:', r);
            }
        },
        success: function(r) {

            if (typeof r === 'string') {
                console.warn('接收的資料格式不為 json！');

                return false;
            }

            if (debug) {
                console.timeEnd('ajax.done!');
                console.log('ajax.r', typeof r, r);
            }
            if (r.status) {
                isFunction(options.success, true, r.data);
            } else if (isFunction(options.warning)) {
                isFunction(options.warning, true, r.message);
            } else {
                Alert.show('error', r.message);
                // console.warn('ajax.warning:', r.message);
            }
        },
        beforeSend: function(r) {
            isFunction(options.beforeSend, true, r);

        },
        complete: function(r) {
            isFunction(options.complete, true, r);
        },
    });
}
const Alert = {
    /** jQuery element */
    _$panel: $('#Alert'),
    /** 私有FUNC */
    _private: {
        Msg: function(type, msg, tag) {
            if (tag === undefined) {
                switch (type) {
                    case 'primary':
                        tag = '未定';
                        break;
                    case 'secondary':
                        tag = '未定';
                        break;
                    case 'success':
                        tag = '成功';
                        break;
                    case 'danger':
                        tag = '錯誤';
                        break;
                    case 'warning':
                        tag = '警告';
                        break;
                    case 'info':
                        tag = '資訊';
                        break;
                    case 'light':
                        tag = '一般';
                        break;
                    case 'dark':
                        tag = '未定';
                        break;
                    default:
                        break;
                }
            }

            let _html = `
                <div class="shadow alert alert-${type} alert-dismissible fade show d-flex" role="alert">
                    <span class="align-self-start tag">${tag}</span>
                    <div class="align-self-center msg">${msg}</div>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;

            return _html;
        },
    },
    /** 設置 Alert 顯示於哪個Block
     * @param {jQuery} $element 
     */
    setting: function($element = $('body')) {
        $element.append(`<div id="Alert"></div>`);
        this._$panel = $('#Alert');
    },
    /** 顯示一則 Alert，並清除已存在的Alert
     * @param {String} type Alert類別 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
     * @param {String} msg  內容
     * @param {String} tag  預設輸出對應type的名稱，可自定義tag名稱
     */
    show: function(type, msg, tag) {
        this._$panel.html(this._private.Msg(type, msg, tag));
    },
    /** 添加一則 Alert，並保留已存在的Alert
     * @param {String} type Alert類別 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
     * @param {String} msg  內容
     * @param {String} tag  預設輸出對應type的名稱，可自定義tag名稱
     */
    showAppend: function(type, msg, tag) {
        this._$panel.append(this._private.Msg(type, msg, tag));
    },
    /** 清除全部 Alert */
    clear: function() {
        this._$panel.html('');
    },
};
Alert.setting();
/** Loading 畫面 */
const Loading = {
    $panel: null,
    $text: null,
    private: {
        run: null,
        /** 顯示狀態 */
        view: false,
        /** 延遲顯示時間(ms) */
        fadeInTime: 200,
        /** 延遲淡出時間(ms) */
        fadeoutTime: 200,
    },
    /** 顯示 Loading
     * @param {String} msg      訊息.(允許Html格式)
     * @param {jQuery} $element 選擇要Loading的元件
     */
    show: function(msg = '', $element = $('section.container')) {
        //確認是否設置Load UI
        if (this.$panel === null) {
            $element.append('<div id="Loading" style="display: none"></div>');
            this.$panel = $element.find('#Loading');
            this.$panel.html(`
                <div class="shell">
                    <div class="panel">
                        <h4 class="title">
                            <div class="spinner-border text-info" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </h4>
                        <div class="text"></div>
                    </div>
                </div>`);

            this.$text = this.$panel.find('.text');
            //禁用元件
            Item.enable(this.$panel.parent(), false);
        }

        //確認 延遲顯示 是否進行中
        if (this.private.run === null) {
            //延遲顯示 避免UI閃現
            this.private.run = setTimeout(() => {
                this.private.view = true;
                this.$panel.fadeIn(this.private.fadeInTime - 200);

                if (msg !== undefined) {
                    this.msg(msg);
                }
            }, this.private.fadeInTime);
        } else {
            if (msg !== undefined) {
                this.msg(msg);
            }
        }
    },
    /** 結束 Loading */
    hidden: function() {
        //確認 是否有設置load UI
        if (this.$panel === null) {
            //console.log('(hidden)未設定Loading');

            return false;
        }

        /** 移除load UI */
        const remove = () => {
            if (this.$panel !== null) {
                Item.enable(this.$panel.parent(), true);
                this.$panel.remove();
                this.$panel = null;
                this.$text = null;
            }
        }

        //如果顯示
        if (this.private.view) {
            this.$panel.fadeOut(this.private.fadeoutTime);

            //待淡出後
            setTimeout(() => {
                this.private.view = false;
                remove();
            }, this.private.fadeoutTime);
        } else {
            //清除 延遲顯示
            clearTimeout(this.private.run);
            remove();
        }
        this.private.run = null;
    },
    /** 改變 Loading的訊息
     * @param {String} msg 訊息.(允許Html格式)
     */
    msg: function(msg, debug) {
        if (this.$panel === null) {
            //console.log('(msg)未設定Loading');

            return false;
        }

        //確認是否顯示
        if (this.private.view) {
            if (debug) {
                console.log(msg);
            }

            this.$text.html(msg);
        } else {
            //避免 被延遲顯示 蓋過訊息
            setTimeout(() => {
                if (this.$panel !== null && this.private.view) {
                    this.$text.html(msg);
                }
            }, this.private.fadeInTime + 50);
        }
    },
};

/** 渲染 datetimepicker
 * @param {Object}  options
 * @param {String}  options.elementId
 * @param {String}  options.viewMode
 * @param {String}  options.format
 * @param {Number}  options.defaultDate
 */
function Datetimepicker(options) {
    options.icons = {
        time: 'far fa-clock',
        date: 'far fa-calendar-alt',
        up: 'fas fa-arrow-up',
        down: 'fas fa-arrow-down',
        previous: 'fas fa-caret-left',
        next: 'fas fa-caret-right',
        today: 'fas fa-calendar-o',
        clear: 'fa fa-delete',
        close: 'far fa-times',
    };
    options.tooltips = {
        selectDate: '選擇日期',
        selectTime: '選擇時間',
        today: '今日',
        clear: '清除選擇',
        close: '關閉選單',
        selectMonth: '選擇月份',
        prevMonth: '上個月',
        nextMonth: '下個月',
        selectYear: '選擇年份',
        prevYear: '去年',
        nextYear: '明年',
        selectDecade: '選擇十年',
        prevDecade: '前十年',
        nextDecade: '後十年',
        prevCentury: '上個世紀',
        nextCentury: '下個世紀',
        incrementHour: '增加小時',
        pickHour: '選擇小時',
        decrementHour: '減少小時',
        incrementMinute: '增加分鐘',
        pickMinute: '選擇分鐘',
        decrementMinute: '減少分鐘',
        incrementSecond: '增加秒數',
        pickSecond: '選擇秒數',
        decrementSecond: '減少秒數',
    };

    $('#' + options.elementId).datetimepicker(options);
}

class DxDataGridOptions {
    /** 渲染 datagrid
     * @param {Object}  options                         設定
     * @param {Array.<{}>} options.columns              Table 欄位資訊定義
     * @param {Object}  options.editing                 Table 編輯設定
     * @param {Boolean} options.editing.allowAdding     Table 新增Row
     * @param {Boolean} options.editing.allowDeleting   Table 刪除Row
     * @param {Boolean} options.editing.allowUpdating   Table 編輯Row
     * @param {String}  options.editing.mode            Table 編輯模式 'Batch' | 'Popup'
     * @param {Object}  options.editing.form            Form 顯示設定
     * @param {Array.<{}>} options.editing.form.items   Form 編輯介面設定
     * @param {String}  options.noDataText              無資料時顯示的文字
     * @param {String}  options.tableTitle              Table 標題
     * @param {Boolean} options.editing.form.showColonAfterLabel Form 中的 Label 是否顯示冒號
     * @param {Object}  options.editing.popup           Popup 設定
     * @param {Boolean} options.editing.popup.fullScreen    Popup 全螢幕顯示
     * @param {String}  options.editing.popup.title         Popup 標題
     * @param {String}  options.editing.popup.height        Popup 高度
     * @param {String}  options.editing.popup.widget        Popup 寬度
     * @param {String}  options.editing.popup.minHeight     Popup 最小高度
     * @param {String}  options.editing.popup.minWidth      Popup 最小寬度
     * @param {String}  options.editing.popup.maxHeight     Popup 最大高度
     * @param {String}  options.editing.popup.maxWidth      Popup 最大寬度
     * @param {Boolean} options.editing.useIcons        圖示
     * @param {String}  options.height                  Table 高度
     * @param {Object}  options.paging                  分頁頁籤設定
     * @param {Number}  options.paging.pageSize         每頁顯示筆數 0:不分頁
     * @param {Boolean} options.paging.showInfo         顯示頁籤資訊
     * @param {String}  options.paging.infoText         設定頁籤資訊顯示方式  
     */
    constructor(options = {}) {
        this.columns = (options.columns || []);
        this.dataSource = (options.dataSource || []);
        options.editing = (options.editing || {});
        options.editing.form = (options.editing.form || {});
        options.editing.popup = (options.editing.popup || {});
        this.editing = {
            allowAdding: true,
            allowDeleting: true,
            allowUpdating: true,
            mode: (options.editing.mode || 'popup'),
            form: {
                items: (options.editing.form.items || undefined),
                showColonAfterLabel: (options.editing.form.showColonAfterLabel || false),
            },
            popup: {
                fullScreen: (options.editing.popup.fullScreen || false),
                title: (options.editing.popup.title || 'Popup Title'),
                height: (options.editing.popup.height || '50%'),
                width: (options.editing.popup.width || '50%'),
                minHeight: (options.editing.popup.minHeight || '25rem'),
                minWidth: (options.editing.popup.minWidth || '30rem'),
                maxHeight: (options.editing.popup.maxHeight || '90%'),
                maxWidth: (options.editing.popup.maxWidth || '90%'),
            },
            useIcons: (options.editing.useIcons || true),
        };
        this.height = (options.height || '50rem');
        this.noDataText = (options.noDataText || 'No Datas');

    }
}

function DrawDxDataGrid($panel, options) {
    if ($panel === null) {
        return false;
    }
    $panel.dxDataGrid({
        allowColumnResizing: true,
        columns: options.columns,
        dataSource: (typeof options.dataSource === 'function' ? options.dataSource() : options.dataSource),
        editing: {
            allowUpdating: options.editing.allowUpdating,
            allowDeleting: options.editing.allowDeleting,
            allowAdding: options.editing.allowAdding,
            form: options.editing.form,
            mode: options.editing.mode,
            popup: {
                fullScreen: options.editing.popup.fullScreen,
                title: options.editing.popup.title,
                height: options.editing.popup.height,
                width: options.editing.popup.width,
                maxHeight: options.editing.popup.maxHeight,
                maxWidth: options.editing.popup.maxWidth,
                minHeight: options.editing.popup.minHeight,
                minWidth: options.editing.popup.minWidth,
                position: {
                    my: 'center',
                    at: 'center',
                    of: $panel.parent(),
                },
                showTitle: true,
            },
            texts: {
                addRow: '新增一筆',
                cancelAllChanges: '放棄變更',
                cancelRowChanges: '取消',
                confirmDeleteMessage: '確定要刪除這筆資料嗎？',
                editRow: '編輯這筆資料',
                deleteRow: '刪除這筆資料',
                saveAllChanges: '儲存變更',
                saveRowChanges: '儲存',
                undeleteRow: '取消刪除',
            },
            useIcons: options.editing.useIcons,
        },
        height: "100%",
        hoverStateEnabled: true,
        filterRow: {
            showAllText: " ",
            operationDescriptions: {
                between: '數值範圍',
                contains: '包含',
                endsWith: '符合字尾',
                equal: '完全相同',
                greaterThan: '大於',
                greaterThanOrEqual: '大於或等於',
                lessThan: '小於',
                lessThanOrEqual: '小於或等於',
                notContains: '不包含',
                notEqual: '完全不同',
                startsWith: '符合字首',
            },
            betweenEndText: '結束值',
            betweenStartText: '起始值',
            resetOperationText: '重置搜尋',
            visible: true,
        },
        showBorders: true,
        sorting: {
            clearText: '清除排序',
            ascendingText: '升序',
            descendingText: '降序',
        },
        paging: {
            pageSize: 8
        },
        noDataText: '尚未建立資料',
        summary: {
            totalItems: [{
                column: "name",
                summaryType: "count",
                displayFormat: "總計: {0} ",
            }]
        }
    });
}
/** DevExtreme Popup 格式設定 */
class DxPopupOptions {
    /**
     * @param {Object}  options                 設定
     * @param {String}  options.id              Popup id
     * @param {Function}    options.contentTemplate 顯示內容
     * @param {Boolean} options.dragEnabled     是否可拖曳視窗
     * @param {String}  options.height          Popup 高度
     * @param {String}  options.width           Popup 寬度
     * @param {Boolean} options.visible         是否顯示 Popup
     * @param {Object}  options.position        Popup 顯示位置設定
     * @param {String}  options.position.my     
     * @param {String}  options.position.at     
     * @param {String}  options.position.of     顯示於哪個元件內
     * @param {Boolean} options.showCloseButton 是否顯示關閉按鈕
     * @param {Boolean} options.showTitle       是否顯示 Popup 標題列
     * @param {String}  options.title           Popup Title
     * @param {Array.<{}>}  options.toolbarItems 自定義工具列
     * @param {Function}    options.onHidden    視窗隱藏後，執行的FUNC.
     * @param {Object}      options.datas       自定義參數，可供FUNC取用.
     * @param {Deferred}    options.defer       Callback Function
     */
    constructor(options = {}) {
        this.id = (options.id || 'DxPopup');
        this.contentTemplate = (options.contentTemplate || null);
        this.dragEnabled = (options.dragEnabled || false);
        this.height = (options.height || '90%');
        this.width = (options.width || '90%');
        this.visible = (options.visible || true);

        options.position = (options.position || {});
        this.position = {
            my: (options.position.my || 'center'),
            at: (options.position.at || 'center'),
            of: (options.position.of || $('section.container')),
        }

        this.showCloseButton = (options.showCloseButton || true);
        this.title = (options.title || 'Popup Title');
        this.showTitle = (options.showTitle || true);
        this.toolbarItems = (options.toolbarItems || []);
        this.onHidden = (options.onHidden || null);

        this.datas = (options.datas || null);
        this.defer = (options.defer || null);
    }
}
//#endregion --------------------------------------------------------------
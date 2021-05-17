'use strict';
/** 詢問視窗 */
class Confirm {
    /**
     *@param {Object}  options
     *@param {String}  options.id             Confirm Html id
     *@param {Object[]}  options.buttons      自定義按鈕
     *@param {String}  options.button.name    識別按鈕的名稱
     *@param {String}  options.button.html    顯示於按鈕上的內容
     *@param {String}  options.button.type    Bootstrap 類型的 CSS
     *@param {Function}  options.btnEvent     按鈕觸發的事件
     */

    constructor(options) {
        this.id = (options.id || 'Confirm');
        this.buttons = (options.buttons !== undefined && Array.isArray(options.button) && options.buttons.length > 0)
            ? options.buttons
            : [{ name: 'close', html: '關閉', type: 'outline-danger' }];
        this.btnhtml = '';
        for (let i = 0; i < this.buttons.length; i++) {
            const btn = this.buttons[i];
            const type = (btn.type === undefined ? 'outline-secondary' : btn.type);

            this.btnhtml += `<div class="btn btn-${type} ${btn.name}" name="${btn.name}">${btn.html}</div>`;

        }
        this.btnEvent = (optins.btnEvent !== undefined && typeof options.btnEvent === 'function')
            ? options.btnEvent
            : function () { console.log("ooo"); };
        this._showDefer = $.Deferred();//$.Deferred();生成一個deferred物件。
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
            .find('.btn-group-bottom').html(this._btnHtml).on('click', '.btn', function () {
                btnEvent($(this).attr('name'));
            }).end()
        return this._showDefer.promise();
    }
    /** 關閉詢問視窗 */
    close() {
        const defer = this._closeDefer;

        $(`#${this.id}`).fadeOut(100, function () {
            $(this).remove();
            defer.resolve();
        });

        return this._closeDefer.promise();
    }
}
/** 對JQuery元件操作 */
const Item = {
    /** 啟用/禁用 元件
   * @param {jQuery}   $element    操作的元件
   * @param {boolean}  enable
   */
    enable: function ($element, enable) {

        const status = (enable) ? 'removeClass' : 'addClass';
        enable = !enable;

        $element[status]('disabled');
        $element.attr('disabled', enable);
    },
    /** 顯示/隱藏 元件
      * @param {jQuery}   $element    操作的元件
      * @param {boolean}  enable
      */
    hidden: function ($element, enable) {

        const status = (enable) ? 'addClass' : 'removeClass';

        $element[status]('d-none');
    }
}
/** 檢查是否為 JSON 物件
 * https://stackoverflow.com/a/9804835
 * @param {*} item 
 */
function isJSON(item) {
    item = (typeof item !== "string" ? JSON.stringify(item) : item);

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    return (typeof item === "object" && item !== null ? true : false);
}

/** Ajax
 * @param {Object}  options 
 * @param {String}  options.url     請求位置
 * @param {*}       options.data    請求時夾帶的資料
 * @param {Function} options.error      Http請求錯誤時執行
 * @param {Function} options.success    請求成功時執行
 * @param {Function} options.beforesend 傳送請求時
 * @param {Function} options.warning    未成功請求時執行
 * @param {Function} options.complete   完成後執行
 */

function Ajax(options, debug) {
    const ls = new LocalStorage('config');
    const config = ls.get();

    const lsUser = new LocalStorage('user');
    const user = lsUser.get();

    if (debug) {
        console.log('ajax.start', config.server + '/dashboard' + options.url);
        console.log('ajax.data', options.data);
        console.time('ajax.done!');
    }
    options.data = (options.data || {});

    options.data.token = (options.data.token || user.token || "");

    $.ajax({
        url: config.server + '/dashboard' + options.url,
        type: 'POST',
        contentType: '',
        data: JSON.stringify(options.data),
        dataType: 'json',
        error: function (result) {
            if (debug) {
                console.timeEnd('ajax.done');//花了多長時間：                
            }
            isFunction(options.error, true, result);

            if (debug) {
                console.log('Http error:', result);
            }
        },
        success: function (result) {
            if (result.status) {
                isFunction(options.success, true, result.data);
            }
            else if (isFunction(options.warning)) {
                isFunction(options.warning, true, result.message);
            }
            else {
                console.warn('ajax.warning:', result.message);
            }
        },
        beforesend: function (result) {
            isFunction(options.beforesend, true, result);
        },
        complete: function (result) {
            isFunction(options.complete, true, result);
        },
    })
}
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
    show: function (msg = '', $element = $('section.container')) {
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

            this.$text = this.$panel.find('.text');//所選元素的後代元素
            //禁用元件
            Item.enable(this.$panel.parent(), false);//parent直接父元素
        }

        //確認 延遲顯示 是否進行中
        if (this.private.run === null) {
            //延遲顯示 避免UI閃現
            this.private.run = setTimeout(() => {
                this.private.view = true;
                this.$panel.fadeIn(this.private.fadeInTime - 200);//fadeIn淡入隱藏

                if (msg !== undefined) {
                    this.msg(msg);
                }
            }, this.private.fadeInTime);
        }
        else {
            if (msg !== undefined) {
                this.msg(msg);
            }
        }
    },
    /** 結束 Loading */
    hidden: function () {
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
        }
        else {
            //清除 延遲顯示
            clearTimeout(this.private.run);
            remove();
        }
        this.private.run = null;
    },
    /** 改變 Loading的訊息
      * @param {String} msg 訊息.(允許Html格式)
      */
    msg: function (msg, debug) {
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
        }
        else {
            //避免 被延遲顯示 蓋過訊息
            setTimeout(() => {
                if (this.$panel !== null && this.private.view) {
                    this.$text.html(msg);
                }
            }, this.private.fadeInTime + 50);
        }
    },
};

const Refresh = {
    datetimepicker: function (options) {
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
        $(options.item).datetimepicker(options);

    },
     /** 重新初始化 Bootstrap Toggle */
    bootstrapToggle: function () {
        $("[data-toggle='toggle']").bootstrapToggle('destroy').bootstrapToggle();
    }
}
/* 驗證email*/
function IsEmail(email) {

    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    const status = (regex.test(email));
    
    return status;
}
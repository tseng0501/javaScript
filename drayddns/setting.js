'use strict';

const Setting = {};
Setting.content = {};

Setting.content.convertOptionsData = function(datas) {
    // 轉換為暫存data供list切換顯示
    this.optionsData = [];
    for (let i = 0; i < datas.length; i++) {
        const group = datas[i];
        this.optionsData[group.id] = [];
        for (let j = 0; j < group.panelData.length; j++) {
            const panel = group.panelData[j]
            this.optionsData[group.id].push({
                id: panel.id,
                options: panel.options,
            })
        }
    }
}
Setting.content.changeOptionsData = function(datas) {
    // 儲存後修改暫存data
    const option = Page.setting.machineGroupsList.option
    const groupData = this.optionsData[option.groupID];

    for (let i = 0; i < groupData.length; i++) {
        if (groupData[i].id === option.machineID) {
            groupData[i].options = datas;
        }
    }
}

Setting.content.setTitle = function(val, id) {
    this.$title.html(val);
    this.$title.data('id', id);
}
Setting.content._getListData = function(datas, id) {
    for (let i = 0; i < datas.length; i++) {
        if (datas[i].id === id) {
            Setting.content.listData = datas[i].options;
            break
        }
    }
}
Setting.content.drawSetLists = function(datas, id) {
    this.clearLists();
    Setting.content._getListData(datas, id);

    let html = '';
    for (let i = 0; i < this.listData.length; i++) {
        const list = this.listData[i];
        html += `
        <div class="machineContent_panel_list" data-id="${list.id}">
            <span class="machineContent_panel_list_title">${list.text}</span>
            <input class="machineContent_panel_list_val" value="${list.value}" readonly>
        </div>`
    }
    this.$machinePanel.html(html);
};
Setting.content._setEditbar = function() {
    this.$btnEdit = this.$editbar.find('[data-mode="edit"]');
    this.$btnSave = this.$editbar.find('[data-mode="save"]');
    this.$btnCancel = this.$editbar.find('[data-mode="cancel"]');
    Item.enable(Setting.content.$editbar, false);
    this.$editbar.on('click', '.btn', function() {
        const $btn = $(this);
        const mode = $btn.data('mode');

        switch (mode) {
            case 'edit':
                Setting.content._editbarEdit();
                break;
            case 'save':
                Setting.content._editbarSave();
                break;
            case 'cancel':
                Setting.content._editbarCancel();
                break;
            default:
                break;
        }
    });
};
Setting.content._getInputs = function() {
    const datas = [];

    this.$machinePanel.find('.machineContent_panel_list').each(function() {
        const $list = $(this);
        datas.push({
            id: $list.data('id'),
            text: $list.find('.machineContent_panel_list_title').text(),
            value: $list.find('.machineContent_panel_list_val').val(),
        })
    });
    return datas;
};
Setting.content._saveValue = function(datas, options) {
    options = options || {};
    const path = Page.regionBar.get();
    const option = Page.setting.machineGroupsList.option;
    console.log(datas);

    Ajax({
        url: '/sensorGroupsMonitor/setValue',
        data: {
            path: {
                areaID: path.area,
                buildingID: path.building,
                regionID: path.region,
                groupID: option.groupID,
                machineID: option.machineID,
            },
            datas: datas
        },
        success: options.success,
        warning: options.warning
    });
};
Setting.content._editMode = function(enable) {
    const panel = this.$machinePanel;
    enable ? panel.removeClass('disabled') : panel.addClass('disabled');
    panel.find('input').prop('readonly', !enable);
};
Setting.content._editbarEdit = function() {
    Item.enable(this.$btnEdit, false);
    Item.enable(this.$machineList, false);

    Page.regionBar.enable(false);
    this._editMode(true);

    Item.hidden(this.$btnEdit, true);
    Item.hidden(this.$btnSave, false);
    Item.hidden(this.$btnCancel, false);
    Item.enable(this.$btnEdit, true);
};
Setting.content._editbarSave = function() {
    Item.enable(this.$btnSave, false);
    const inputData = this._getInputs();
    this._editMode(false);
    this._saveValue(inputData, {
        success: function(r) {
            const self = Setting.content;

            Alert.show('success', '設定儲存成功！');
            self.changeOptionsData(inputData);
            Item.hidden(self.$btnEdit, false);
            Item.hidden(self.$btnSave, true);
            Item.hidden(self.$btnCancel, true);
            Item.enable(self.$btnSave, true);
            Item.enable(self.$machineList, true);
            Page.regionBar.enable(true);
        },
        warning: function(msg) {
            Alert.show('warning', '設定儲存時發生錯誤，請稍後再試！');
            console.log('warning:', msg);
        }
    });
};
Setting.content._editbarCancel = function() {
    Item.enable(this.$btnCancel, false);

    this._editMode(false);
    const list = Page.setting.machineGroupsList.option;
    this.drawSetLists(this.optionsData[list.groupID], list.machineID);
    Item.hidden(this.$btnEdit, false);
    Item.hidden(this.$btnSave, true);
    Item.hidden(this.$btnCancel, true);
    Item.enable(this.$btnCancel, true);
    Item.enable(this.$machineList, true);
    Page.regionBar.enable(true);
};
Setting.content.draw = function($panel) {
    const contentHtml = `
        <div class="machineContent_title">
            <div class="machineContent_title_text"></div>
            <div class="machineContent_title_editbar">
                <div data-mode="edit" class="btn btn-outline-info" title="編輯">
                    <i class="fas fa-cog"></i>
                </div>
                <div data-mode="save" class="btn btn-outline-success d-none" title="儲存">
                    <i class="fas fa-check"></i>
                </div>
                <div data-mode="cancel" class="btn btn-outline-danger d-none" title="放棄">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        </div>
        <div class="machineContent_panel disabled"></div>`;
    const html = `
        <div class="machineContent">${contentHtml}</div>
        <div class="machineList"></div>`;

    this.$panel = $panel;
    this.$panel.html(html);

    this.$editbar = this.$panel.find('.machineContent_title_editbar');
    this.$title = this.$panel.find('.machineContent_title_text');
    this.$machinePanel = this.$panel.find('.machineContent_panel');
    this.$machineList = this.$panel.find('.machineList');
    //set
    Page.regionBar.set();
    this.setPanelText();
    this._setEditbar();
};
Setting.content.setPanelText = function() {
    this.$machinePanel.html(`<div class="machineContent_panel_text">請選擇設備</div>`);
}

Setting.content.clearLists = function() {
    this.$machinePanel.empty();
};
Setting.content.clear = function() {
    if (this.$editbar) {
        this.$editbar.off('click');
    }

    Page.regionBar.offChange();
};
Setting.content.onClick = function() {
    this.$panel.on('click', 'input, label', function() {
        $(this)
            .parents('.content')
            .find('li')
            .removeClass('active');
        $(this)
            .parents('li')
            .addClass('active');
    });
};
Setting.content.offClick = function() {
    if (this.$panel) {
        this.$panel.off('click');
    }
};
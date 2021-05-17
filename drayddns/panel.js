'use strict';

const Panel = {};

Panel.setting = {};

//#region Region Bar


//Realtime panel draw
Panel.panels = {};

Panel.panels._getMachineHtml = function(machine) {
    return `
        <div class="machine" id="${machine.id}" title="">
            <div class="machineName">${machine.machineName}</div>
            <div class="allStatus"></div>
            <div class="workorderGroup"></div>
            <div class="type">
                <div class="machineId">${machine.machineId}</div>
                <div class="partNoButton" data-status="false">
                    <span>料號</span>
                    <i class="fas fa-search"></i>
                </div>
                <ul class="partNo hidden"></ul>
            </div>
        </div>`;
}
Panel.panels._getGroup = function(group) {
    let groupChild = '';

    for (let i = 0; i < group.panelData.length; i++) {
        groupChild += `${this._getMachineHtml(group.panelData[i])}`;
    };

    return `
        <div class="panel-group" data-id="${group.groupId}">
            <div class="group-title">
                <span class="label">${group.groupName}</span>
                <span class="workOrderData"></span>
            </div>
            <div class="group-content">${groupChild}</div>
        </div>`;
}

Panel.panels.draw = function($panel, id) {
    id = (id || 'AllPanelsGroups');

    $panel.attr('id', id)
        // .addClass('panel')
        .html(`
            <div class="panels-status">
            </div>
            <div class="allpanel"></div>`);

    this._$panelGroups = $panel.find('.allpanel');
    Panel.panels.statusDraw($panel.find('.panels-status'));
}

Panel.panels.statusDraw = function($panel, id) {
    id = (id || 'statusGroups');
    const html = `
        <div class="status total" id="All">
            <h4 class="label">設備數</h4>
            <h1 class="value">0</h1>
        </div>
        <div class="status run" id="StatusRun">
            <h4 class="label">運行中</h4>
            <h1 class="value">0</h1>
        </div>
        <div class="status warning" id="StatusWarning">
            <h4 class="label">異常警告</h4>
            <h1 class="value">0</h1>
        </div>
        <div class="status danger" id="StatusDanger">
            <h4 class="label">異常停止</h4>
            <h1 class="value">0</h1>
        </div>
        <div class="status stop" id="StatusStop">
            <h4 class="label">關機</h4>
            <h1 class="value">0</h1>
        </div>`;
    $panel.attr('id', id).html(html);
}

Panel.panels.setStatusValue = function(data) {
    if (data) {
        $('.panels-status').find('.status').each(function() {
            const $status = $(this);
            const statusId = $status.attr('id').toString();
            let allLength = 0;
            let runLength = 0;
            let warningLength = 0;
            let dangerLength = 0;
            let stopLength = 0;

            for (let i = 0; i < data.length; i++) {
                const d = data[i].panelData;

                allLength += d.length;
                for (let j = 0; j < d.length; j++) {
                    const nowStatus = d[j].status.toString();

                    if (nowStatus === 'run') { runLength++ };
                    if (nowStatus === 'warning') { warningLength++ };
                    if (nowStatus === 'danger') { dangerLength++ };
                    if (nowStatus === 'stop') { stopLength++ };
                }

                if (statusId === 'All') {
                    $status.find('.value').text(allLength);
                };
                if (statusId === 'StatusRun') {
                    $status.find('.value').text(runLength);
                };
                if (statusId === 'StatusWarning') {
                    $status.find('.value').text(warningLength);
                };
                if (statusId === 'StatusDanger') {
                    $status.find('.value').text(dangerLength);
                };
                if (statusId === 'StatusStop') {
                    $status.find('.value').text(stopLength);
                };
            };
        });
    }
}


Panel.panels.setStruct = function(datas) {
    let html = '';

    for (let i = 0; i < datas.length; i++) {
        html += this._getGroup(datas[i]);
    }
    this._$panelGroups.html(html);
}

Panel.panels.clearStruct = function() {
    $('#AllPanelsGroups').empty();
}

Panel.panels.setWorkOrderValue = function($group, data) {
    if (data) {
        for (let i = 0; i < data.length; i++) {
            $group.find(".workOrderData").html('工單號碼: ' + data[i].workorder.workorderId);
        }
    }
}

Panel.panels.setPartNoValue = function($group, data) {
    if (data) {
        const $partNo = $group.find(".partNo");
        for (let i = 0; i < data.length; i++) {
            const partNoData = data[i].workorder.partNo;
            let html = '';

            for (let j = 0; j < partNoData.length; j++) {
                html += `<li>${partNoData[j]}</li>`;
            };

            $partNo.empty();
            $partNo.append(html);

            break;
        }
    }
}

Panel.panels.setMachinesValue = function($group, data) {
    if (!data) {
        return
    };
    $group.find('.machine').each(function() {
        const $machine = $(this);
        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            const ds = d.data;

            if ($machine.attr('id').toString() === d.id) {

                $machine.find('.machineName').removeClass().addClass('machineName ' + d.status)
                $machine.attr('title',
                    'run: ' + ds.run + '%, warning: ' + ds.warning + '%, danger: ' + ds.danger + '%, stop: ' + ds.stop + '%');

                // for_displayButtonOnclick
                $machine.find('.allStatus').children().each(function() {
                    const $statusType = $(this).attr('type').toString();
                    const $statusSpan = $(this).find('span');

                    if ($statusType === 'run') {
                        $statusSpan.html(ds.run + '%');
                    }
                    if ($statusType === 'warning') {
                        $statusSpan.html(ds.warning + '%');
                    }
                    if ($statusType === 'danger') {
                        $statusSpan.html(ds.danger + '%');
                    }
                    if ($statusType === 'stop') {
                        $statusSpan.html(ds.stop + '%');
                    }
                })
                $machine.find('.workorderGroup').each(function() {
                    if ($(this).attr('class').toString() === 'workorderGroup') {
                        $(this).find('.workorder').html('工單: ' + d.workorder.workorderId);
                    }
                })
                break;
            };
        };
    });
}

Panel.panels.setGroupsValue = function(data) {
    const panels = Panel.panels;

    panels._$panelGroups.find('.panel-group').each(function() {
        const $group = $(this);

        for (let i = 0; i < data.length; i++) {
            const panelData = data[i].panelData

            if ($group.data('id').toString() === data[i].groupId) {
                panels.setMachinesValue($group, panelData);
                panels.setWorkOrderValue($group, panelData);
                panels.setPartNoValue($group, panelData);
            };
            if (i === data.length - 1) {
                panels.setMachinesValue($group, null);
            };
        };
    });
}

Panel.panels.drawDisplayButton = function($panel) {
    const html = `
        <div class="displayButton" data-status="false" title="切換模式">
            <i class="far fa-file-alt"></i>
        </div>`;
    $panel.append(html);
    $('.region').addClass('haveButton');
    Panel.panels._displayButtonOnclick();
}

// buttonEven

Panel.panels.partNoButtonOnclick = function() {
    $('.partNoButton').on('click', function() {
        const $partNo = $(this).parent().find('.partNo');
        const $machine = $(this).closest('.machine');
        const $allGroups = $(this).closest('#AllPanelsGroups');

        if ($(this).attr('data-status') === 'false') {
            // close all partNo block
            $allGroups.find('.partNo').addClass('hidden').removeClass('onward');
            $allGroups.find('.machine').removeClass('onward');
            $allGroups.find('.partNoButton').attr('data-status', 'false');

            // open this partNo block
            $(this).attr('data-status', 'ture');
            $partNo.removeClass('hidden').addClass('onward');
            // this machine onward z-index*9999
            $machine.addClass('onward');
        } else {
            // close this
            $(this).attr('data-status', 'false');
            $partNo.addClass('hidden').removeClass('onward');
            $machine.removeClass('onward');
        }
    });
}


Panel.panels._displayButtonOnclick = function() {
    $('.displayButton').on('click', function() {
        const $icon = $(this).find('i')
        const path = Page.regionBar.get();
        if (!(path.area && path.building && path.region)) {
            return
        }
        if ($(this).attr('data-status') == 'false') {
            $(this).attr('data-status', 'ture');
            $icon.removeClass().addClass('far fa-file');
            const html = `
                <div class="status run" type="run"><span></span></div>
                <div class="status warning" type="warning"><span></span></div>
                <div class="status danger" type="danger"><span></span></div>
                <div class="status stop" type="stop"><span></span></div>`;
            const workorder = `<div class="workorder"></div>`

            $('.allStatus').append(html).addClass('show');
            $('.workorderGroup').append(workorder);
            Page.realtime.stop();
            Page.realtime.run();
        } else {
            $(this).attr('data-status', 'false');
            $icon.removeClass().addClass('far fa-file-alt');
            $('.allStatus').removeClass('show').empty();
            $('.workorderGroup').empty();
        }
    })
}
'use strict';

const Page = {};
Page.$panel = $('#Content');

Page.public = {};
Page.public.getStruct = function(options, failCount) {
    const path = Page.regionBar.get();

    failCount = failCount || 0;

    if (failCount > 500) {
        Alert.show('danger', '與伺服器連線失敗！');
        return false;
    }

    if (!(path.area && path.building && path.region)) {
        failCount++;
        setTimeout(() => {
            this.getStruct(options, failCount);
        }, 10);
        return false;
    }

    Ajax({
        url: '/machineStruct',
        data: {
            path: {
                areaID: path.area,
                buildingID: path.building,
                regionID: path.region
            }
        },
        success: function(r) {
            isFunction(options.success, true, r);
        }
    });
};
Page.public.drawMainStrust = function(id) {
    id = (id || '');
    const html = `
        <div id="${id}" class="content">
            <div class="region"></div>
            <div class="mainContent"></div>
        </div>`;
    Page.$panel.html(html);
}

Page.regionBar = {};
Page.regionBar.draw = function($panel, id) {
    id = (id || 'RegionBar');

    //#region HTML
    const html = `
        <div class="region-bar" id="${id}">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">地區</span>
                </div>
                <select name="" id="Area" class="form-control"></select>
            </div>
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">城市</span>
                </div>
                <select name="" id="Building" class="form-control"></select>
            </div>
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">建物</span>
                </div>
                <select name="" id="Region" class="form-control"></select>
            </div>
        </div>`;
    //#endregion
    $panel.html(html);

    this.$panel = $panel;
    this.$area = $('#Area');
    this.$building = $('#Building');
    this.$region = $('#Region');
}

Page.regionBar.get = function() {
    if (!this.$panel) {
        return false;
    }

    const selects = {
        area: '',
        building: '',
        region: '',
    };

    this.$panel.find('select').each(function() {
        selects[this.id.toLowerCase()] = this.value;
    });

    return selects;
}
Page.regionBar.set = function() {
    Ajax({
        url: '/region/getOptions',
        success: function(r) {
            const self = Page.regionBar;

            self.data = DeepCopy(r);
            self._setArea();
            self._setBuilding();
            self._setRegion();
            console.log('getOptionsData')
        },
    });
}

Page.regionBar.enable = function(status) {
    const nowStatus = (!status) ? 'addClass' : 'removeClass';
    this.$area[nowStatus]('disabled');
    this.$building[nowStatus]('disabled');
    this.$region[nowStatus]('disabled');

    Item.enable(this.$area, status);
    Item.enable(this.$building, status);
    Item.enable(this.$region, status);
    // 處理點擊事件class.disabled(/設定/編輯按鈕)
}

Page.regionBar.onChange = function(e) {

    e = (e || {});

    const regionBar = Page.regionBar;

    regionBar.$area.on('change', function() {
        regionBar._setBuilding(this.value);
        regionBar.$building.val(null);
        regionBar._setRegion();

        isFunction(e.area, true);
    });

    regionBar.$building.on('change', function() {
        regionBar._setRegion(this.value);
        regionBar.$region.val(null);
        isFunction(e.building, true);
    });

    regionBar.$region.on('change', function() {
        isFunction(e.region, true);
    });
}
Page.regionBar.offChange = function() {
    const regionBar = Page.regionBar;

    if (regionBar.$area) {
        regionBar.$area.off('change');
        regionBar.$area = null;
    }

    if (regionBar.$building) {
        regionBar.$building.off('change');
        regionBar.$building = null;
    }

    if (regionBar.$region) {
        regionBar.$region.off('change');
        regionBar.$region = null;
    }
}
Page.regionBar._findData = function(data, id) {
    if (!id) {
        return data;
    }

    for (let i = 0; i < data.length; i++) {
        const d = data[i];

        if (id === d.id) {
            return d.options;
        }
    }
}
Page.regionBar._setOptions = function($select, select, data) {
    const selectDatas = this._findData(data, select);

    let optionsHtml = '';

    for (let i = 0; i < selectDatas.length; i++) {
        const data = selectDatas[i];
        optionsHtml += `<option value="${data.id}">${data.text}</option>`;
    }

    $select.html(optionsHtml);
}
Page.regionBar._setArea = function() {
    this._setOptions(this.$area, null, this.data.options);
}
Page.regionBar._setBuilding = function(select) {
    select = (select || this.$area.val());

    (select !== null) ?
    this._setOptions(this.$building, select, this.data.options): this.$building.empty();
}
Page.regionBar._setRegion = function(select) {
        select = (select || this.$building.val());

        (select !== null) ?
        this._setOptions(this.$region, select, this._findData(this.data.options, this.$area.val())): this.$region.empty();
    }
    //#endregion

//#region Realtime
Page.realtime = {};

Page.realtime._data = [];
Page.realtime.draw = function() {
    const html = `
        <div id="RealtimePage" class="content">
            <div class="region"></div>
            <div class="panels" id="AllPanelsGroups"></div>
        </div>`;
    Page.$panel.html(html);

    Page.regionBar.draw(Page.$panel.find('.region'));
    Panel.panels.draw(Page.$panel.find('.panels'));
    Panel.panels.drawDisplayButton(Page.$panel.find('.region'));

    Page.realtime.regionBar.setOptions();
    Page.realtime.regionBar.onChange();
    Page.realtime.getPanelsStruct();

    Page.realtime.run();
}

Page.realtime.getPanelsStruct = function(options) {
    options = (options || {});
    options.success = function(r) {
        console.log(r);

        Panel.panels.setStruct(r);
        Panel.panels.partNoButtonOnclick();

    }
    Page.public.getStruct(options);
}

Page.realtime.run = function() {
    const path = Page.regionBar.get();

    if (path.area && path.building && path.region) {
        Ajax({
            url: '/realtime/getmachineData',
            data: {
                path: {
                    areaID: path.area,
                    buildingID: path.building,
                    regionID: path.region,
                },
            },
            success: function(r) {
                // console.log(r);
                Panel.panels.setGroupsValue(r);
                Panel.panels.setStatusValue(r);
            },
        });
    }

    this._runingGetData = setTimeout(() => {
        this.run();
    }, 1000);
}

Page.realtime.stop = function() {
    clearTimeout(this._runingGetData);
    this._runingGetData = null;
}

Page.realtime.regionBar = {};
Page.realtime.regionBar.setOptions = Page.regionBar.set;
Page.realtime.regionBar.onChange = function() {
    const realtime = Page.realtime;
    const panels = Panel.panels;
    const even = {
        area: function() {
            realtime.stop();
            panels.clearStruct();
        },
        building: function() {
            realtime.stop();
            panels.clearStruct();
        },
        region: function() {
            realtime.stop();
            panels.clearStruct();
            panels.draw(Page.$panel.find('.panels'));
            realtime.getPanelsStruct();
            realtime.run();
        },
    };
    Page.regionBar.onChange(even);
}

//#endregion

Page.clear = function() {
    Page.realtime.stop();
    Page.$panel.empty().removeClass();
    $(window).off('resize');
}


//#region chart
Page.chart = {};

Page.chart.regionBar = {};
Page.chart.searchWindows = {};

Page.chart.regionBar.setOptions = Page.regionBar.set;
Page.chart.regionBar.offChange = Page.regionBar.offChange;

Page.chart.machineGroupsList = new Chart.machineGroupsList();
Page.chart.dateRange = new Chart.dateRange();

Page.chart.searchWindows.draw = function() {
    // 主框架
    const chart = Page.chart;
    chart.searchWindows.drawStrust();
    // draw
    const $chooseBox = $('.alertWindows').find('.chooseBox');
    chart.dateRange.inquireText = `<i class="fas fa-search"></i> 查詢`;
    chart.dateRange.draw($chooseBox.find('.selectTimeBox'));
    Page.regionBar.draw($chooseBox.find('.region'));
    chart.machineGroupsList.draw($('.alertWindows').find('.machineList'));
    // set
    Page.realtime.regionBar.setOptions();
    chart.setCheckBoxStruct();
    // onClick
    chart.setGroupsListOnClick();
    chart.searchWindows.inquireOnClick();
    chart.searchWindows._onChangeEvent();
}

Page.chart.searchWindows.drawStrust = function() {
    const html = `
        <div id="ChartPage">
            <div class="alertBackground"></div>
            <div class="alertWindows">
                <div class="title">請選擇 查詢條件</div>
                <div class="alertContent">
                    <div class="chooseBox">
                        <div class="region"></div>
                        <div class="selectTimeBox"></div>
                    </div>
                    <div class="machineListGroup">
                        <div class="title">產線列表</div>
                        <div class="machineList"></div>
                    </div>
                </div>
            </div>
        </div>`;
    Page.$panel.html(html);
}

Page.chart.searchWindows._onChangeEvent = function() {
    const chart = Page.chart;
    const $machineList = $('.alertWindows').find('.machineList');
    const even = {
        area: function() {
            $machineList.empty();
        },
        building: function() {
            $machineList.empty();
        },
        region: function() {
            $machineList.empty();
            chart.machineGroupsList.draw($machineList);
            chart.setCheckBoxStruct();
        },
    };

    Page.regionBar.onChange(even);
}

Page.chart.searchWindows.inquireOnClick = function() {
    const chart = Page.chart;
    const machineGroupsList = chart.machineGroupsList

    chart.dateRange.inquireBtnOnClick(function() {
        const path = Page.regionBar.get();
        this.option = machineGroupsList.getChooseValue();

        if (!(path.area && path.building && path.region)) {
            Alert.show('warning', '請選擇地區');
            return false;
        }
        if (this.value === '') {
            Alert.show('warning', '請選擇機器');
            return false;
        }

        const options = {
            dateRange: Page.chart.dateRange.get(),
            path: path,
            machine: this.option.name,
            id: this.option.id,
        }

        Page.$panel.find('#ChartPage').empty();
        Page.chart.draw(options);
    });
}

Page.chart.inquireOnClick = function() {
    const chart = Page.chart;
    const machineGroupsList = chart.machineGroupsList

    chart.dateRange.inquireBtnOnClick(function() {
        const data = Page.chart.data;
        this.option = machineGroupsList.getChooseValue();
        if (!this.option.id) {
            Alert.show('warning', '請選擇機器');
            return false;
        }
        // 設定本次選擇值
        data.machine = this.option.name;
        data.id = this.option.id
        data.dateRange = chart.dateRange.get(),

            Chart.content.getChartsData(data);
    });
}

Page.chart.draw = function(options) {
    const chart = Page.chart;
    this.$page = Page.$panel.find('#ChartPage');

    // 保留選擇預設值
    this.data = DeepCopy(options);
    // draw
    chart.drawStrust(this.$page);
    this.$ListGroup = this.$page.find('#ListGroup');
    this.$machineList = this.$ListGroup.find('.machineList');
    chart.machineGroupsList.draw(this.$machineList);
    chart.dateRange.draw(this.$ListGroup.find('.selectTimeBox'));
    // set
    Chart.content.getChartsData(options);
    chart.setCheckBoxStruct();
    // onClick
    chart.setGroupsListOnClick();
    chart.machineGroupsList.changAreaBtnOnClick();
    Page.chart.inquireOnClick();
}

Page.chart.setCheckBoxStruct = function(options) {
    options = (options || {});
    options.success = function(r) {
        Page.chart.machineGroupsList.setList(r);
    }
    Page.public.getStruct(options);
}

Page.chart.setGroupsListOnClick = function() {
    Page.chart.machineGroupsList.groupOnClick();
    Page.chart.machineGroupsList.machineOnClick();
}

Page.chart.machineGroupsList.changAreaBtnOnClick = function() {
    Page.$panel.find('#changButton').on('click', function() {
        Page.chart.searchWindows.draw();
    })
}

Page.chart.drawStrust = function($chart) {
    const chartHtml = `
        <div class="squareChart">
            <div class="chart" id="Oee">
                <h3 class="chartTitle">整體設備效率 OEE</h3>
                <div id="OeeChart">
                    <div id="OeeData"></div>
                </div>
            </div>
            <div class="chart" id="Downtime">
                <h3 class="chartTitle">停機時間 Downtime</h3>
                <div id="DowntimeChart"></div>
            </div>
        </div>
        <div class="rectChart">
            <div class="chart" id="Performance">
                <h3 class="chartTitle">產能效率 Performance</h3>
                <div class="chartContent" id="PerformanceChart"></div>
            </div>
            <div class="chart" id="Availability">
                <h3 class="chartTitle">稼動率 Availability</h3>
                <div class="chartContent" id="AvailabilityChart"></div>
                <div class="values">
                    <div class="planValue">計畫工作時間
                        <p><span></span> 分</p>
                    </div>
                    <div class="realValue">實際工作時間<br>
                        <p><span></span> 分</p>
                    </div>
                </div>
            </div>            
            <div class="chart" id="Quality">
                <h3 class="chartTitle">良率 Quality</h3>
                <div class="chartContent" id="QualityChart"></div>
            </div>
        </div>`;
    const contentHtml = `
        <div class="machineTitle">
            <h4 class="machineName"></h4>
            <span class="machineText">時間區段 : </span>
            <span class="machineTime"></span>
        </div>
        <div class="charts">${chartHtml}</div>`;
    const listHtml = `
        <div class="machineGroupTitle">產線列表
            <i id="changButton" class="fas fa-search">
                <span>編輯區域</span>
            </i>
        </div>
        <div class="machineList"></div>
        <div class="selectTimeBox"></div>`;
    const allhtml = `
        <div class="allCharts">${contentHtml}</div>
        <div id="ListGroup">${listHtml}</div>`;

    $chart.html(allhtml);
}

Page.chart.getList = function() {
    Page.public.getStruct({
        success: function(r) {
            Page.chart.machineGroupsList.setList(r.groups);
        },
    });
}

//#endregion

Page.compare = {};
Page.compare.mainContent = {};
Page.compare.regionBar = {};
// Page.compare.regionBar.onChange = Page.regionBar.onChange;

Page.compare.drawStrust = function() {
    const html = `
        <div id="ComparePage" class="content">
            <div class="region"></div>
            <div class="mainContent"></div>
        </div>`;
    Page.$panel.html(html);
}
Page.compare.draw = function() {
    Page.public.drawMainStrust('ComparePage');
    const $page = Page.$panel.find('#ComparePage');
    const $region = $page.find('.region');
    // draw
    Page.regionBar.draw($region);
    Page.compare.drawGroupSelect($region);
    Page.compare.mainContent.draw($page.find('.mainContent'));
    // set
    Page.realtime.regionBar.setOptions();
    Page.compare.setGroupSelect();
    Page.compare._onChangeEvent();
    // onClick
    Page.compare.mainContent.onClick();
}
Page.compare.drawGroupSelect = function($region) {
    const html = `
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">產線</span>
            </div>
            <select id="Group" class="form-control"></select>
        </div>`;
    this.$region = $region;
    this.$region.children().append(html);
    this.$GroupSelect = this.$region.find('#Group');
}

Page.compare.setGroupSelect = function(options) {
    options = (options || {});
    options.success = function(r) {
        Page.compare.setGroupSelectList(r);
    }
    Page.public.getStruct(options);
}
Page.compare.setGroupSelectList = function(data) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
        const group = data[i];
        html += `<option value="${group.groupId}" id="${group.id}">${group.groupName}</option>`;
    }
    this.$GroupSelect.html(html);
}
Page.compare._onChangeEvent = function() {
    const $GroupSelect = this.$GroupSelect;

    const even = {
        area: function() {
            $GroupSelect.empty();
        },
        building: function() {
            $GroupSelect.empty();
        },
        region: function() {
            $GroupSelect.empty();
            Page.compare.setGroupSelect();
        },
    };
    Page.regionBar.onChange(even);
}

Page.compare.mainContent.draw = function($block) {
    const html = `
        <div class="modeBox"></div>
        <ul class="mainBox"></ul>`;
    $block.html(html);

    const $mainBox = $block.find('.mainBox');
    const $modeBox = $block.find('.modeBox');
    this.$mainBox = $mainBox;
    this.$modeBox = $modeBox;

    this.drawMainBox();
    this.drawModeBox();
}

Page.compare.mainContent.drawModeBox = function($block = this.$modeBox) {
    const html = `
        <div class="typetitle">請選擇 模式</div>
        <select class="typeSelect">
            <option value="oee">OEE</option>
            <option value="downtime">停機時間</option>
            <option value="availability">稼動率</option>
            <option value="performance">產能效率</option>
            <option value="quality">良率</option>
        </select>
        <ul class="allTab">
            <li class="cycle-tab current" data-item="year">
                <span class="writeLine" data-item="year">年比較</span>
            </li>
            <li class="cycle-tab" data-item="quarter">
                <span class="writeLine" data-item="quarter">季比較</span>
            </li>
            <li class="cycle-tab" data-item="month">
                <span class="writeLine" data-item="month">月比較</span>
            </li>
            <li class="cycle-tab" data-item="date">
                <span class="writeLine" data-item="date">日比較</span>
            </li>
        </ul>`;
    $block.html(html);
}
Page.compare.mainContent.drawMainBox = function(mode, $mainBox) {
    $mainBox = ($mainBox || this.$mainBox);
    mode = (mode || 'year')
    const html = `
        <li class="content ${mode}" data-mode="${mode}">
            <div class="time-content containerbox"></div>
            <div class="inquire"><i class="fas fa-search"></i></div>      
        </li>
        <li class="chart">
            <div id="chartContainer" class="center">
                <div class="chart-text">請選擇查詢條件</div>
            </div>
        </li>    `;
    $mainBox.html(html);
    this.mode = mode;
    this.$timeContent = $mainBox.find('.time-content');

    this.drawTimeContent();
    Compare.mainContent.setTimeContent(mode);

    Compare.mainContent.getTimeValue();
    Compare.mainContent.setDisplayTime();
}
Page.compare.mainContent.drawTimeContent = function() {
    const html = `
    <div class="start-time ">
        <div>請選擇 時間範圍<span id="startTime" class="displayTime"></span></div>
        <div class="dx-field-value">
            <div id="dateStart"></div>
        </div>
    </div>
    <div class="end-time ">
        <div>請選擇 時間範圍<span id="endTime" class="displayTime"></span></div>
        <div class="dx-field-value">
            <div id="dateEnd"></div>
        </div>  
    </div>`;
    this.$timeContent.html(html);
}

Page.compare.mainContent.onClick = function() {
    this.changTabOnClick();
    this.searchBtnOnClick();
}

Page.compare.mainContent.changTabOnClick = function() {
    const $cycleTab = this.$modeBox.find('.cycle-tab');
    $cycleTab.on('click', function(event) {
        const $this = $(this);
        const mode = event.target.dataset.item;

        if (this.className.indexOf('current') >= 0) return;

        Page.compare.mainContent.$mainBox.empty();
        $cycleTab.removeClass('current');
        $this.addClass('current');

        Compare.mainContent.clear();
        Page.compare.mainContent.drawMainBox(mode);
        Page.compare.mainContent.searchBtnOnClick();
    });
    this.$cycleTab = $cycleTab;
}

Page.compare.mainContent.searchBtnOnClick = function() {
    this.$searchBtn = this.$mainBox.find('.inquire');
    this.$searchBtn.on('click', function() {

        const $chartContainer = Page.compare.mainContent.$mainBox.find('#chartContainer');

        $chartContainer.removeClass('center');
        Page.compare.mainContent._ajaxData();
    });
}

Page.compare.mainContent._getTypeSelectVal = function() {
    return this.$modeBox.find('.typeSelect').val();
}

Page.compare.mainContent._ajaxData = function(options) {
    const path = Page.regionBar.get();
    const time = Compare.mainContent.getTime();
    this.valueMode = this._getTypeSelectVal();

    if (!path.region) {
        Alert.show('warning', '請選擇正確的地區！');
        return
    }
    if (!time) {
        return
    }
    options = options || {}
    console.log(path);

    Ajax({
        url: '/inquire',
        data: {
            path: {
                areaID: path.area,
                buildingID: path.building,
                regionID: path.region,
                groupID: path.group
            },
            dateRange: time,
            dateMode: this.mode,
            valueMode: this.valueMode
        },
        success: function(r) {
            Compare.mainContent.chartDraw(r)
        }
    })
}

Page.availability = {};

Page.availability.regionBar = {};
Page.availability.mainContent = {};

Page.availability.getTime = Compare.mainContent.getTime;
Page.availability.normalChart = new Availability.normalChart();
Page.availability.sortChart = new Availability.sortChart();
Page.availability.machineChart = new Availability.machineChart();
Page.availability.dateRange = new Chart.dateRange();
Page.availability.dateRange.endBox = false;
Page.availability.dateRange.inquireText = `<i class="fas fa-search"></i> 查詢`;

Page.availability.drawStrust = function() {
    const html = `
        <div id="AvailabilityPage" class="content">
            <div class="region"></div>
            <div class="mainContent">
                <div class="contentText">請選擇 查詢條件</div>
            </div>
        </div>`;
    Page.$panel.html(html);
}

Page.availability.draw = function() {
    // 主框架
    Page.public.drawMainStrust('AvailabilityPage');
    // draw
    const $page = Page.$panel.find('#AvailabilityPage');
    const $region = $page.find('.region');
    const timehtml = `<div class="dateBox"></div>`;
    Page.regionBar.draw($region);
    $region.children().append(timehtml);
    Page.availability.dateRange.draw($region.find('.dateBox'));
    // set
    Page.regionBar.set();
    Page.regionBar.onChange();
    // onClick
    Page.availability.searchBtnOnClick();
}

Page.availability.mainContent.draw = function($block) {
    const html = `
        <div class="analysis"></div>
        <div class="availability"></div>`;
    $block.html(html);

    const $analysis = $block.find('.analysis');
    const $availability = $block.find('.availability');
    this.$analysis = $analysis;
    this.$availability = $availability;

    // draw
    this.drawAnalysis();
    this.drawAvailability();
    // onClick
    this.displayBtnOnClick();
}

Page.availability.searchBtnOnClick = function() {
    const $region = Page.$panel.find('.region');
    this.$searchBtn = $region.find('.inquire');

    this.$searchBtn.on('click', function() {
        Loading.show('資料查詢中...', $('body'));
        const mainContent = Page.availability.mainContent;
        mainContent.draw(Page.$panel.find('.mainContent'));
        mainContent.setAvailabilityStruct();
        mainContent._ajaxData();
    });
}
Page.availability.dateRange.getTimeValue = function() {
    const value = $(`#${this.start}`).dxDateBox('instance').option('value');
    const first = moment(value).valueOf();
    const second = first + 1000 * 60 * 60 * 24;

    return Page.availability.getTime(first, second);
}

Page.availability.mainContent.drawAnalysis = function($block = this.$analysis) {
    const html = `
        <div class="chart">
            <h3 class="chartTitle">整體設備效率 OEE</h3>
            <div id="oeeAnalysis">請選擇右方設備名稱<br>以產生圖表</div>
        </div>
        <div class="chart">
            <h3 class="chartTitle">停機時間分析</h3>
            <div id="downtimeAnalysis"> 請選擇右方設備名稱<br>以產生圖表</div>
        </div>`;
    $block.html(html);
}

Page.availability.mainContent.drawAvailability = function($block = this.$availability) {
    const html = `
        <div class="toolBar">
            <div class="machineTitle">請選擇設備</div>
            <div class="displayCtrl">顯示模式 
                <div class="btn-group btn-group-toggle displayBtn" data-toggle="buttons">
                    <label class="btn btn-secondary active">
                        <input type="radio" name="options" id="normal" autocomplete="off" checked>普通
                    </label>
                    <label class="btn btn-secondary">
                        <input type="radio" name="options" id="sort" autocomplete="off">排序
                    </label>
                </div>
            </div>
        </div>
        <div class="allpanel"></div>`;
    $block.html(html);
    this.$panelGroups = this.$availability.find('.allpanel');
    this.$displayBtn = this.$availability.find('.displayBtn');
}

Page.availability.mainContent.setAvailabilityStruct = function(options) {
    options = (options || {});
    options.success = function(r) {
        Loading.private.view = true;
        Loading.msg('繪製圖表中...');
        Page.availability.mainContent.setAvailabilityList(r);
    }
    Page.public.getStruct(options);
}

Page.availability.mainContent.setAvailabilityList = function(datas) {
    let html = '';

    for (let i = 0; i < datas.length; i++) {
        html += this._getGroup(datas[i]);
    }
    this.$panelGroups.html(html);
};

Page.availability.mainContent._getMachineHtml = function(machine) {

    return `
        <div class="machine" id="${machine.id}" title="">
            <div class="label">
                <div class="machineName">${machine.machineName}</div>
                <div class="machineId">${machine.machineId}</div>
                <div class="machineVal"></div>
            </div>
            <div class="chart">
            <div id="normalChart_${machine.id}" class="chart_content normal"></div>
            <div id="sortChart_${machine.id}" class="chart_content sort"></div>
            </div>
        </div>`;
}

Page.availability.mainContent._getGroup = function(group) {
    let groupChild = '';

    for (let i = 0; i < group.panelData.length; i++) {
        groupChild += `${this._getMachineHtml(group.panelData[i])}`;
    };

    return `
        <div class="panel-group" data-id="${group.groupId}" id="${group.id}">
            <div class="group-title">
                <span class="label">${group.groupName}</span>
            </div>
            <div class="group-content">${groupChild}</div>
        </div>`;
}

Page.availability.mainContent.displayBtnOnClick = function() {
    this.$displayBtn.on('click', '.btn', function() {
        // 顯示模式切換
        const id = $(this).children().attr('id').toString();
        const $chart = $('.group-content').find('.chart_content');
        const status = id === 'sort' ? 'addClass' : 'removeClass';
        $chart[status]('showsort');
    })
}
Page.availability.mainContent.chartOnclick = function() {
    // 點選圖表名稱事件
    const $machines = $('.group-content').find('.machine');
    const $oeeChart = this.$analysis.find('#oeeAnalysis');
    const $downtimeChart = this.$analysis.find('#downtimeAnalysis');
    this.label = $machines.find('.label');
    let status = false

    this.label.on('click', function() {
        const $machine = $(this).parent();
        const name = $(this).find('.machineName').text();
        $machines.removeClass('active');
        $machine.addClass('active');
        $('.toolBar').find('.machineTitle').html('當前選擇設備為: ' + name)

        const groupId = $machine.closest('.panel-group').attr('id')
        const id = $machine.attr('id')

        if (!status) {
            $downtimeChart.empty().removeClass();
            $oeeChart.empty().removeClass();
        }
        const chartData = Page.availability.machineChart.getData(groupId, id);
        Page.availability.machineChart.draw(chartData);

        status = true
    })
}
Page.availability.mainContent.resize = function() {
    let resizeTimer = null;
    $(window).on('resize', function(e) {
        const width = $('.group-content').find('.machine .chart').width();
        if (resizeTimer) {
            window.clearTimeout(resizeTimer);
        }

        // 視窗改變size時重新修正圖表寬度
        resizeTimer = setTimeout(() => {
            Page.availability.normalChart.allRender(width);
            Page.availability.sortChart._resize(width);

        }, 100);
    });
}

Page.availability.mainContent._ajaxData = function() {
    const pa = Page.availability;
    const path = Page.regionBar.get();
    const time = pa.dateRange.getTimeValue();
    const mainContent = pa.mainContent;
    const normalChart = pa.normalChart;
    const sortChart = pa.sortChart;

    if (!(path.area && path.building && path.region)) {
        Alert.show('warning', '請選擇正確的地區！');
        return
    }
    if (!time) {
        return
    }
    // Loading.show('資料查詢中...', $('body'));

    Ajax({
        url: '/availability/getData',
        data: {
            path: {
                areaID: path.area,
                buildingID: path.building,
                regionID: path.region
            },
            dateRange: time,
            color: normalChart.colorArr
        },
        success: function(r) {
            console.log('getData', r);
            console.time('繪製圖表');
            // setNormalChart
            normalChart.drawAllChart(r);
            normalChart.allRender();
            mainContent.chartOnclick();
            // for MachineData(轉換格式)
            pa.machineChart.convertChartsData(r);
            // setSortChart
            sortChart.drawAllChart(r);
            sortChart.allRender(false);
            // resizeEvent
            mainContent.resize();
        },
        complete: function() {
            console.timeEnd('繪製圖表')
            Loading.hidden();
        },
    })
}

Page.setting = {};

Page.setting.machineGroupsList = new Chart.machineGroupsList();
Page.setting.machineGroupsList.input = false;
Page.setting.draw = function() {
    Page.public.drawMainStrust('SettingPage');
    const $mainContent = Page.$panel.find('.mainContent');

    Page.regionBar.draw(Page.$panel.find('.region'));
    Setting.content.draw($mainContent);
    const $machineList = $mainContent.find('.machineList');
    Page.setting.machineGroupsList.draw($machineList);

    Page.setting.setCheckBoxStruct();
    Page.setting.machineGroupsList.onClick($machineList);
    Page.regionBar.onChange({
        area: function() {
            Page.setting.machineGroupsList.clearAll();
            Setting.content.$title.empty();
            Setting.content.clearLists();
            Setting.content.setPanelText();
            Item.enable(Setting.content.$editbar, false);
        },
        building: function() {
            Page.setting.machineGroupsList.clearAll();
            Setting.content.$title.empty();
            Setting.content.clearLists();
            Setting.content.setPanelText();
            Item.enable(Setting.content.$editbar, false);
        },
        region: function() {
            Page.setting.machineGroupsList.clearAll();
            Setting.content.$title.empty();
            Setting.content.clearLists();
            Setting.content.setPanelText();
            Page.setting.machineGroupsList.draw($machineList);
            Page.setting.setCheckBoxStruct();
            Page.setting.machineGroupsList.onClick($machineList);
            Item.enable(Setting.content.$editbar, false);
        }
    });
};

Page.setting.setCheckBoxStruct = function(options) {
    options = (options || {});
    options.success = function(r) {
        Setting.content.convertOptionsData(r);
        Page.setting.machineGroupsList.setList(r);
    }
    Page.public.getStruct(options);
}
Page.setting.machineGroupsList.onClick = function($list) {
    Page.setting.machineGroupsList.groupOnClick();
    Page.setting.machineGroupsList.machineClickEvent($list);
}
Page.setting.machineGroupsList.machineClickEvent = function($list) {
    this.$list = $list
    this.option = {};
    const list = Page.setting.machineGroupsList;
    this.$list.on('click', '.machine', function() {
        Item.enable(Setting.content.$editbar, true);
        const groupId = $(this).closest('.groupCheckBox').data('id');
        const id = $(this).data('id');
        list.option['groupID'] = groupId;
        list.option['machineID'] = id;
        Setting.content.setTitle($(this).data('name'), id);
        Setting.content.drawSetLists(Setting.content.optionsData[groupId], id);
    })
}
Page.setting.machineGroupsList.offClick = function() {
    this.$list.off('click', '.machine');
}

Page.setting.machineGroupsList.clearAll = function() {
    this.clear();
    this.clearGroupOnClick();
    this.offClick();
}
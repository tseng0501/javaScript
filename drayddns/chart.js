'use strict';

const Chart = {};
Chart.content = {};

Chart.content._tooltip = function(e) {
    const prefix = e.chart.axisY[0].prefix;
    const suffix = e.chart.axisY[0].suffix;
    const colorList = e.chart._selectedColorSet;
    const entries = e.entries;
    let x = entries[0].dataPoint.x;
    let time = moment(x).format('YYYY/MM/DD HH:mm:ss');
    let content = `<span style="">時間 : ${time}</span></br>`;

    for (let i = 0; i < entries.length; i++) {
        let name = entries[i].dataSeries.legendText;
        let color = colorList[i]
        if (!name) {
            name = 'value';
        }
        const y = NumberRound(entries[i].dataPoint.y).toThousandthComma();

        if (entries.length === 1) {
            color = '#32D1BC';
        }

        content += `<span style="color:${color}">${name}</span>
            : ${prefix + y + suffix}</br>`;
    }
    return content;
}

Chart.content.getChartsData = function(options) {
    // ajax
    Ajax({
        url: '/chart/getData',
        data: options,
        success: function(r) {
            Chart.content.setChartsOption(r);
            Chart.content.setMachineTitle(r);
        },
    });
}

Chart.content.setMachineTitle = function(r) {
    const $title = $('.machineTitle');
    const date = r.dateRange;

    function formatDate(value) {
        return moment(value).format('YYYY/MM/DD HH:mm:ss');
    }

    $title.find('.machineTime').html(formatDate(date.first) + ' - ' + formatDate(date.second));
    $title.find('.machineName').html(r.machine);
}

Chart.content.setChartsOption = function(r) {
    this.drawOeeChart(r.oee);
    this.drawDowntimeChart(r.downtime);
    this.drawAvailabilityChart(r.availability);
    this.drawPerformanceChart(r.performance);
    this.drawQualityChart(r.quality);
}

Chart.content.drawOeeChart = function(data) {
    // OEE
    $('#OeeData').text(data + '%');

    $('#OeeChart').dxCircularGauge({
        scale: {
            startValue: 0,
            endValue: 100,
            tickInterval: 10,
            label: {
                useRangeColors: true
            }
        },
        rangeContainer: {
            palette: 'pastel',
            ranges: [
                { startValue: 70, endValue: 100 },
                { startValue: 35, endValue: 70 },
                { startValue: 0, endValue: 35 }
            ]
        },
        value: data
    });
}

Chart.content.drawDowntimeChart = function(data) {
    // 停機 
    $('#DowntimeChart').dxPieChart({
        dataSource: data,
        sizeGroup: 'piesGroup',
        palette: ['#367AF0', '#0ABD9E', '#F7B26B', '#EB5757', '#7CBAB4', '#92C7E2', '#75B5D6', '#B78C9B', '#F2CA84', '#A7CA74'],
        legend: {
            visible: false,
            // verticalAlignment: 'bottom',
            // horizontalAlignment: 'center',
            // itemTextPosition: 'right',
            // font: {
            //     // size: 16,
            //     color: 'whitesmoke'
            // },
        },
        tooltip: {
            enabled: true,
            color: '#303030',
            font: {
                size: 16,
                family: '微軟正黑體',
            },
            customizeTooltip: function(arg) {
                const color = arg.point._styles.normal.fill;
                return {
                    borderColor: color,
                    cornerRadius: 15,
                    text: `<span style="color: ${color}">${arg.argument}: ${arg.percentText}</span>`
                };
            }
        },
        series: [{
            argumentField: 'type',
            valueField: 'area',
            label: {
                visible: true,
                format: 'percent',
                font: {
                    size: 16
                },
                connector: {
                    visible: true,
                    width: 0.5
                },
            },
        }],
    });

}

Chart.content.drawAvailabilityChart = function(data) {
    // 稼動率
    const num = RoundDecimal(data.availability, 2) * 100;
    let chart = new CanvasJS.Chart('AvailabilityChart', {
        backgroundColor: 'transparent',
        dataPointWidth: 100,
        axisX: {
            labelFormatter: function(e) {
                return '';
            },
            margin: 15,
            tickLength: 0,
            lineThickness: 2,
        },
        axisY: {
            maximum: data.planWorking,
            suffix: ' 分',
            labelFontColor: 'whitesmoke',
            labelFontSize: 14,
            labelFontFamily: '微軟正黑體',
        },
        toolTip: {
            backgroundColor: '#303030',
            fontColor: 'whitesmoke',
            shared: true,
            fontSize: 16,
            fontFamily: '微軟正黑體',
            contentFormatter: function(e) {
                let content = '';
                const data = e.entries[0];
                const dataSeries = data.dataSeries;
                const axisY = dataSeries.axisY;
                const color = e.chart._selectedColorSet;
                content = `
                    <span style="color:${color[1]}">計畫工作時間</span>
                    : ${axisY.maximum}${axisY.suffix || ''}</br>
                    <span style="color:${color[0]}">實際工作時間</span>
                    : ${data.dataPoint.y}${axisY.suffix || ''}</br>
                    <span style="color:${color[2]}">稼動率</span>
                    : ${dataSeries.options.yValueFormatString}`;
                return content;
            },
        },
        data: [{
            type: 'bar',
            yValueFormatString: num + '%',
            indexLabel: "{y}",
            indexFontFamily: '微軟正黑體',
            indexLabelFontSize: 32,
            indexLabelFontColor: 'whitesmoke',
            dataPoints: [
                { y: data.realWorking },
            ]
        }]
    });

    // data block
    const $values = $('.rectChart').find('.values');

    $values.find('.planValue span').html(data.planWorking.toThousandthComma());
    $values.find('.realValue span').html(data.realWorking.toThousandthComma());

    chart.render();
}

Chart.content.drawPerformanceChart = function(data) {
    // 產能
    let Chart = new CanvasJS.Chart('PerformanceChart', {
        backgroundColor: '#424242',
        zoomEnabled: true,
        // exportEnabled: true,
        axisX: {
            labelFontColor: 'whitesmoke',
            labelFontSize: 14,
            labelFormatter: function(e) {
                return CanvasJS.formatDate(e.value, 'MM/DD HH:mm');
            },
        },
        axisY: {
            includeZero: false,
            labelFontColor: 'whitesmoke',
        },
        toolTip: {
            backgroundColor: '#303030',
            fontColor: 'whitesmoke',
            shared: true,
            content: this._tooltip,
            fontSize: 16,
            fontFamily: '微軟正黑體',
        },
        data: [{
            color: '#32D1BC',
            type: 'line',
            markerSize: 1,
            dataPoints: data
        }],
    });
    Chart.render();
}

Chart.content.drawQualityChart = function(data) {
    // 良率
    const chart = new CanvasJS.Chart('QualityChart', {
        backgroundColor: '#424242',
        zoomEnabled: true,
        // exportEnabled: true,
        axisX: {
            labelFontColor: 'whitesmoke',
            labelFontSize: 14,
            labelFormatter: function(e) {
                return CanvasJS.formatDate(e.value, 'MM/DD HH:mm');
            },
        },
        axisY: {
            includeZero: false,
            labelFontColor: 'whitesmoke',
        },
        toolTip: {
            backgroundColor: '#303030',
            fontColor: 'whitesmoke',
            shared: true,
            content: this._tooltip,
            fontSize: 16,
            fontFamily: '微軟正黑體',
        },
        data: [{
            color: '#32D1BC',
            type: 'line',
            markerSize: 1,
            dataPoints: data
        }],
    })
    chart.render();
}


Chart.machineGroupsList = class machineGroupsList {
        constructor(id) {
            this._id = (id || 'MachineGroupsList-' + UUID.v4());
            this.value = '';
            this.input = true;
        }

        _getMachineHtml(data) {
                return `
        <li class="machine" title="${data.machineId}" data-id="${data.id}" data-name="${data.machineName}"><label>
            ${this.input? `<input type="checkbox" class="checkbox" name="Checkbox[]"  value=${data.machineName} data-id="${data.id}">` : '' }
            ${data.machineName}
        </label></li>`;
    }
    _getGroupHtml(data) {
        let html = '';

        for (let i = 0; i < data.panelData.length; i++) {
            html += this._getMachineHtml(data.panelData[i]);
        }
        return `
            <li class="groupCheckBox" title="${data.groupId}" data-id="${data.id}">
                <div class="group-label">${data.groupName}
                    <i class="fas fa-chevron-down "></i>
                </div>
                <ul class="machineGroup">${html}</ul>
            </li>`;
    }
    _getChooseBoxHtml(data) {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += this._getGroupHtml(data[i]);
        }
        return html;
    }
    
    setList(data, $chooseBox) {
        $chooseBox = $chooseBox || this.$chooseBox;

        const html = this._getChooseBoxHtml(data);
        $chooseBox.html(html);
    }

    clear() {
        this.$chooseBox.empty();
    }

    draw($chooseBox) {
        const html = `<ul class="chooseBoxGroup" id="DataGrid"></ul>`;
        $chooseBox.html(html);
        
        this.$chooseBox = $chooseBox;
    }

    getChooseValue() {
        let value = {};
        this.$chooseBox.find('.checkbox').each(function () {
            
            if ($(this).is(':checked')) {
                value['id'] = $(this).data('id');
                value['name'] = $(this).val();
            }
        })
        return value
    }

    groupOnClick(onClick) {
        this.$chooseBox.on('click', '.group-label', function () {
            const $groupLabel = $(this);
            const state = $groupLabel.hasClass('chevronTurn');
            const status = !state ? 'addClass' : 'removeClass';

            $groupLabel[status]('chevronTurn');
            $groupLabel.parent().find('.machineGroup').toggle();
        });

        if (isFunction(onClick)) {
            this.$groupList.on('click', '.group-label', onClick);
        }
    }

    machineOnClick(onClick) {
        this.$chooseBox.on('click', '.checkbox', function () {
            $('.machineGroup').find('.checkbox').prop('checked', false);
            $(this).prop('checked', true);
        });

        if (isFunction(onClick)) {
            this.$groupList.on('click', '.group-label', onClick);
        }
    }

    clearGroupOnClick() {
        if (this.$chooseBox) {
            this.$chooseBox.off('click', '.group-label');
        }
    }
    clearMachineOnClick() {
        if (this.$groupList) {
            this.$groupList.off('click', '.element-machine');
        }
    }
}

Chart.dateRange = class dateRange {

    constructor(options) {
        this._id = UUID.v4();
        this.endBox = true;
        this.start = 'timeStart-' + this._id;
        this.end = 'timeEnd-' + this._id;
    }

    _init() {
        const now = moment().startOf('day').valueOf();
        // 初次顯示的時間
        let firstTime = moment(now).subtract(7, 'days').valueOf();
        let secondTime = moment(now).valueOf();

        // 修正為使用者前次選取的時間(chartPage)
        const data = Page.chart.data;
        if (data) {
            firstTime = data.dateRange.first;
            secondTime = data.dateRange.second;
        }
        
        const options = {
            acceptCustomValue: false,
            type: 'datetime',
            value: firstTime,
            displayFormat: 'yyyy/MM/dd HH:mm',
            elementAttr: {
                'data-mode': 'startTime',
            },
        };
        if (this.endBox === false) {
            options.displayFormat = 'yyyy/MM/dd'
            options.type = 'date'
        }
    
        $(`#${this.start}`).dxDateBox(options);
        
        options.value = secondTime;
        options.elementAttr['data-mode'] = 'endTime';
        
        $(`#${this.end}`).dxDateBox(options);
        
        this.contentLock();
    }

    draw($panel) {
        this.$panel = $panel;
        //#region HTML
        const html = `
            <div class="time__Box">
                ${
                    this.endBox ? 
                    `<div class="time__title">開始</div>` : 
                    `<div class="time__title">日期</div>`
                }
                <div class="dx-field-value">
                    <div id="${this.start}"></div>
                </div>
            </div>
            ${
                this.endBox ? 
                `<div class="time__Box">
                    <div class="time__title">結束</div>
                    <div class="dx-field-value">
                        <div id="${this.end}"></div>
                    </div>
                </div>` : ''
            }
            <div class="btn btn-outline-info inquire">
                ${
                    !this.inquireText ? `<i class="fas fa-search"></i>` : this.inquireText
                }
            </div>`;
        //#endregion
        this.$panel.html(html).addClass('date-range');

        this.$start = this.$panel.find('input[data-type="start"]');
        this.$end = this.endBox ? this.$panel.find('input[data-type="end"]') : '';
        this.$inquireBtn = this.$panel.find('.inquire');

        this._init();  
    }

    get() {
        this.getTimeValue = function (id) {

            const time = $(`#${id}`).dxDateBox('instance');
            const value = time.option('value');
            const timeValue = moment(value).valueOf();
            
            return timeValue;
        }
        let first = this.getTimeValue(this.start);
        let second = this.getTimeValue(this.end);

        if ( first === second) {
    
            Alert.show('warning', '請選擇正確的時間範圍！');
            this.timeRange = false;
            return false;
        } 
        if ( !first || !second ) {
    
            Alert.show('warning', '請選擇正確的時間格式！');
            this.timeRange = false;
            return false;
        }
    
        if ( first > second ) {
            [ first, second] = [ second, first]
        }

        return {
            first: first,
            second: second,
        };  
    }

    contentLock() {
        $('body').find('.dx-dropdowneditor-icon').on('click',function () {
    
            setTimeout(function () {
                $('.dx-texteditor-input').attr('readonly','true'); 
            },500);     
        });
    }

    inquireBtnOnClick(onClick) {
        if (isFunction(onClick)) {
            this.$inquireBtn.on('click', onClick);
        }
    }

}
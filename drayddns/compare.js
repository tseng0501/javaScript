'use strict';

const Compare = {};
Compare.mainContent = {};

Compare.mainContent._checkType = function(mode) {
    this.prefix = '';
    this.title = '';
    this.suffix = '%';

    if (this.valueMode.toString() === 'downtime') {
        this.suffix = '分';
        this.maximum = '';
    }

    switch (mode) {
        case 'year':
            this.title = '年度比較';
            this.type = 'bar';
            return;
        case 'quarter':
            this.prefix = 'Q';
            return;
        case 'month':
            this.unit = '月';
            break;
        case 'date':
            this.unit = '日';
            break;
        default:
            break;
    }
}

Compare.mainContent._toolTip = function(e) {
    const compare = Page.compare.mainContent;
    const content = Compare.mainContent;
    const entries = e.entries
    const i = e.entries[0].dataPoint.x;
    const list = ['~03', '~06', '~09', '~12'];
    let formatStr = 'YYYY-MM';
    let timeKey = 'months';
    let dateRange = '';
    let text = '';

    switch (compare.mode) {
        case 'year':
            formatStr = 'YYYY';
            break;
        case 'quarter':
            timeKey = 'quarters';
            dateRange = list[i];
            break;
        case 'month':
            break;
        case 'date':
            formatStr = 'YYYY-MM-DD';
            timeKey = 'days';
            break;
    }

    const r = [{
        data: content.first,
        color: 'rgba(207, 90, 58)',
        index: 0,
    }, {
        data: content.second,
        color: 'rgba(56, 151, 139)',
        index: 1,
    }];

    function format(r) {
        if (!entries[r.index]) return '';
        const suffix = entries[r.index].dataSeries.axisY.suffix;

        const data = moment(r.data).add(entries[r.index].dataPoint.x, timeKey).format(formatStr);
        let result =
            `<span style="color:${r.color}">${ data + dateRange }</span>
            : ${entries[r.index].dataPoint.y}${suffix || ''}<br/>`;

        return result;
    }
    text += format(r[0]) + format(r[1]);

    if (entries[0] && entries[1]) {
        const value = (entries[0].dataPoint.y - entries[1].dataPoint.y).toFixed(2);
        text += `<span style='color: white'>差異</span> : ${value}`;
    }
    return text;
}

Compare.mainContent.chartDraw = function(r) {
    const compare = Page.compare.mainContent;
    const content = Compare.mainContent;
    const mode = compare.mode;
    this.valueMode = compare._getTypeSelectVal();
    this.type = 'column';
    this._checkType(mode);

    CanvasJS.addColorSet('color', [
        'rgba(207, 90, 58, 0.845)',
        'rgba(56, 151, 139, 0.695)',
    ]);

    let chart = new CanvasJS.Chart('chartContainer', {
        exportEnabled: true,
        backgroundColor: 'transparent',
        fontFamily: '微軟正黑體',
        fontColor: 'rgb(246, 245, 244)',
        animationEnabled: true,
        dataPointMaxWidth: 40,
        colorSet: 'color',
        axisX: {
            labelFormatter: function(e) {
                if (mode === 'year') return '';
                return e.label;
            },
            title: (this.title || ''),
            titleFontFamily: '微軟正黑體',
            labelFontFamily: '微軟正黑體',
            tickLength: 15,
            labelFontColor: 'rgb(246, 245, 244)',
            titleFontColor: 'rgb(246, 245, 244)',
            labelAutoFit: true,
            lineColor: 'rgba(56, 151, 139)',
            prefix: (this.prefix || ''),
            suffix: (this.unit || ''),
        },
        axisY: {
            lineColor: 'rgba(56, 151, 139)',
            labelFontColor: 'rgb(246, 245, 244)',
            tickColor: 'rgba(56, 151, 139)',
            tickLength: 15,
            suffix: (this.suffix || ''),

        },
        toolTip: {
            shared: true,
            fontFamily: '微軟正黑體',
            backgroundColor: '#2a2a2a',
            fontColor: '#fff',
            contentFormatter: this._toolTip,
        },
        legend: {
            cursor: 'pointer',
            fontColor: 'rgb(246, 245, 244)',
            itemclick: toggleDataSeries,
        },
        data: [{
                type: content.type,
                name: this.firstTime,
                legendText: this.firstTime,
                fontColor: '#6c9eeb',
                showInLegend: true,
                dataPoints: r.firstData,
            },
            {
                type: content.type,
                name: this.secondTime,
                legendText: this.secondTime,
                labelFontColor: '#1c4487',
                showInLegend: true,
                dataPoints: r.secondData,
            }
        ]
    });
    if (this.valueMode !== 'downtime') {
        chart.options.axisY['maximum'] = 100;
    }
    chart.render();

    function toggleDataSeries(e) {

        let dataSeries = e.dataSeries;
        if ((typeof dataSeries.visible === 'undefined') || dataSeries.visible) {
            dataSeries.visible = false;
        } else {
            dataSeries.visible = true;
        }
        chart.render();
    }
}
Compare.mainContent.setTimeContent = function(mode) {
    const lastYear = moment().subtract(1, 'years').valueOf();
    this.now = moment().valueOf();

    const options = {
        acceptCustomValue: false,
        format: 'date',
        value: lastYear,
        displayFormat: 'yyyy',
        calendarOptions: {
            maxZoomLevel: 'decade',
            minZoomLevel: 'century',
        },
        elementAttr: {
            'data-mode': 'startTime',
        },
        onValueChanged: function() {
            const value = this.option('value');
            let rangeValue = moment(value).format('YYYY');
            if (Compare.mainContent.mode === 'date') {
                rangeValue = moment(value).format('YYYY / MM');
            }
            const mode = this.option('elementAttr');
            $("#" + mode['data-mode']).text(rangeValue);
        },
    };
    if (mode === 'date') {
        options.displayFormat = 'yyyy / MM';
        options.calendarOptions.maxZoomLevel = 'year';
    }
    $("#dateStart").dxDateBox(options);
    options.value = this.now;
    options.elementAttr['data-mode'] = 'endTime';
    $("#dateEnd").dxDateBox(options);
}

Compare.mainContent.getTime = function(first = this.first, second = this.second) {
    const time = {
        first: first,
        second: second,
    };

    if (time.first >= this.now || time.second >= this.now) {
        Alert.show('warning', '選擇的時間超出範圍！');
        return false;
    }
    if (time.first === time.second) {
        Alert.show('warning', '請選擇不同的區間！');
        return false;
    }
    if (!time.first || !time.second) {
        Alert.show('warning', '請選擇正確的時間！');
        return false;
    }
    return time;
}
Compare.mainContent.getTimeValue = function() {
    let mode = 'year';
    let formatStr = 'YYYY';

    if (this.mode === 'date') {
        formatStr = 'YYYY / MM';
        mode = 'month';
    }

    this.timeValue = function(value) {
        const date = $('#' + value).dxDateBox('instance');
        const timeNow = date.option('value');
        const time = moment(timeNow).startOf(mode).valueOf();
        const timeStr = moment(time).format(formatStr);

        return {
            time: time,
            timeStr: timeStr
        };
    }
    const first = this.timeValue('dateStart');
    this.first = first.time;
    this.firstTime = first.timeStr;

    const second = this.timeValue('dateEnd');
    this.second = second.time;
    this.secondTime = second.timeStr;
}

Compare.mainContent.setDisplayTime = function() {
    $("#startTime").text(this.firstTime);
    $("#endTime").text(this.secondTime);
}

Compare.mainContent.clear = function() {
    if (this.first || this.second) {
        this.first = null;
        this.second = null;
    }
    if (this.firstTime || this.secondTime) {
        this.firstTime = null;
        this.secondTime = null;
    }
    if (this.unit) {
        this.unit = null;
    }
}
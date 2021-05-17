'use strict';

const Availability = {};

Availability.normalChart = class normalChart {

    constructor(options) {
        this._id = UUID.v4();
        this.chartArr = [];
        this.colorArr = ['#268070', '#9d7a57', '#974d4d', '#525252', '#000000'];
    }
    _toolTip(e) {
        const date = moment(e.entries[0].dataPoint.x).format('YYYY/MM/DD HH:mm:ss');
        const color = e.entries[0].dataPoint.color;

        if (color === undefined) {
            return null;
        }
        const status = (color === '#525252' ? '關機' : color === '#268070' ? '正常' : color === '#974d4d' ? '警告' : '錯誤');
        return `<sapn>${date}<br><strong style="color: ${color}">${status}</strong></sapn>`;
    }

    _getValColor(value) {
        //0: Run, 1: Warning, 2: Danger, 3: Stop
        //0: #268070綠, 1: #9d7a57黃, 2: #974d4d紅, 3: #525252灰
        const color = ['#268070', '#9d7a57', '#974d4d', '#525252', '#000000'];
        return color[(value > 3 ? 4 : value)]
    }

    _convertDataPoints(data) {
        // 如data沒給color 使用此轉換
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            const point = data[i];
            arr.push({
                x: point.x,
                y: 1,
                color: this._getValColor(point.y),
            });
        }
        return arr
    }

    draw(id, data) {
        if (data === undefined || data.legend === 0) return;

        const chart = new CanvasJS.Chart('normalChart_' + id, {
            backgroundColor: 'transparent',
            zoomEnabled: true,
            animationEnabled: true,
            rangeChanging: (e) => {
                this.tool(chart, true, false);
            },
            axisX: {
                labelFontColor: 'whitesmoke',
                labelFontSize: 16,
                labelFormatter: function(e) {
                    return CanvasJS.formatDate(e.value, 'HH:mm');
                },
            },
            axisY: {
                minimum: 0,
                maximum: 1,
                tickLength: 0,
                lineThickness: 0,
                margin: -5,
                valueFormatString: ' ' //comment this to show numeric values
            },
            toolTip: {
                backgroundColor: '#323232',
                fontColor: 'whitesmoke',
                fontSize: 16,
                fontFamily: '微軟正黑體',
                shared: true,
                content: this._toolTip,
            },
            data: [{
                type: 'column',
                dataPoints: data.normalChart,
            }],
        });

        const tool = this.tool;
        $(`#normalChart_${id}`).on('click', 'button[state="reset"]', function() {
            chart.render();
            tool(chart, true);
        });

        return {
            chart: chart,
            dataPoints: data.normalChart,
            id: id
        }
    }

    drawAllChart(datas) {
        if (datas) {
            for (let i = 0; i < datas.length; i++) {
                const panels = datas[i].panelData;
                for (let j = 0; j < panels.length; j++) {
                    const panel = panels[j];
                    this.chartArr.push(
                        this.draw(panel.id, panel.chartData)
                    );
                    // 標題下方數值
                    this.setMachineVal(panel);
                }
            }
        }
    }

    setMachineVal(panelData) {
        let val = RoundDecimal(panelData.chartData.availability, 2) + '%';
        $(`#${panelData.id}`).find('.machineVal').html(val);
    }

    allRender(width) {
            for (let i = 0; i < this.chartArr.length; i++) {
                const chart = this.chartArr[i].chart;
                chart.render();
                this.tool(chart, true, width);
            }
        }
        // tool(chart, calcNum, width) {
        //     const data = chart.data[0].dataPoints;
        //     let dataCount = data.length;

    //     let chartWidth = chart.width
    //     if (width) {
    //         // resize
    //         chart.set('width', width * 1.018, true);
    //     } else {
    //         // 第一次
    //         chart.set('width', chartWidth * 1.013, true);
    //     }

    //     if (calcNum && data.length > 0) {
    //         const axisX = chart.axisX[0];
    //         const count = {
    //             start: axisX.viewportMinimum,
    //             end: axisX.viewportMaximum,
    //         };
    //         let startAddress = 0;
    //         //尋找起始資料
    //         for (let i = 0; i < data.length; i++) {
    //             if (data[i].x > count.start) {
    //                 startAddress = i;
    //                 break;
    //             }
    //         }
    //         //計算資料筆數
    //         dataCount = 0;
    //         for (let i = startAddress; i < data.length; i++) {
    //             if (data[i].x > count.end) {
    //                 dataCount--; //讓在許取資料筆數少時補償
    //                 break;
    //             }
    //             dataCount++;
    //         }
    //     }
    //     chart.set('dataPointWidth', Math.ceil(chart.axisX[0].bounds.width / dataCount), true);
    // }
}

Availability.sortChart = class sortChart {

    constructor(options) {
        this._id = UUID.v4();
        this.chartArr = [];
        this.colorArr = ['#268070', '#9d7a57', '#974d4d', '#525252', '#000000'];
        this.resize = false;
    }

    _toolTip(e) {
        const prefix = e.chart.axisY[0].prefix;
        const suffix = e.chart.axisY[0].suffix;
        const colorList = e.chart._selectedColorSet;
        const entries = e.entries;
        let content = '';

        for (let i = 0; i < entries.length; i++) {
            let name = entries[i].dataSeries.name;
            let color = colorList[i]
            if (!name) {
                name = 'value';
            }
            const y = NumberRound(entries[i].dataPoint.y).toThousandthComma();
            content += `<span style="color:${color}">${name}</span>
                : ${prefix + y + suffix}</br>`;
        }
        return content;
    }

    _getChartData(data) {
        let arr = [];
        const nameArr = ['正常', '錯誤', '警告', '關機']
        for (let i = 0; i < 4; i++) {
            arr.push({
                type: 'stackedBar100',
                showInLegend: false,
                name: nameArr[i],
                dataPoints: [data[i]],
            })
        }
        return arr
    }

    draw(id, data) {
        if (data === undefined || data.legend === 0) return;

        CanvasJS.addColorSet('color', ['#268070', '#9d7a57', '#974d4d', '#525252', '#000000']);
        const chartData = this._getChartData(data.sortChart);
        const chart = new CanvasJS.Chart('sortChart_' + id, {
            backgroundColor: 'transparent',
            zoomEnabled: false,
            animationEnabled: false,
            dataPointWidth: 200,
            colorSet: 'color',
            axisX: {
                minimum: 0,
                maximum: 1,
                tickLength: 0,
                lineThickness: 0,
                margin: -30,
                valueFormatString: ' ',
            },
            axisY: {
                // 數值刻度
                interval: 10,
                maximum: 100,
                suffix: '%',
                labelFontColor: 'whitesmoke',
                labelFontSize: 16,
            },
            toolTip: {
                backgroundColor: '#323232',
                fontColor: 'whitesmoke',
                fontSize: 16,
                fontFamily: '微軟正黑體',
                shared: true,
                content: this._toolTip,
            },
            data: chartData,
        });

        return {
            chart: chart,
            dataPoints: chartData,
            id: id
        }
    }

    drawAllChart(datas) {
        if (!datas) return;

        for (let i = 0; i < datas.length; i++) {
            const panels = datas[i].panelData;
            for (let j = 0; j < panels.length; j++) {
                const panel = panels[j];
                this.chartArr.push(
                    this.draw(panel.id, panel.chartData)
                );
            }
        }
    }

    allRender() {
        for (let i = 0; i < this.chartArr.length; i++) {
            const chart = this.chartArr[i].chart;
            chart.render();
            this.toolWidth(chart, false);
        }
    }
    _resize(width) {
        for (let i = 0; i < this.chartArr.length; i++) {
            const chart = this.chartArr[i].chart;
            this.toolWidth(chart, width);
        }
    }
    toolWidth(chart, width) {
        // 補齊圖表右邊空間
        let chartWidth = chart.width
            // resize
        if (width) {
            chart.set('width', width * 1.05, true);
            return
        }
        // 第一次
        chart.set('width', chartWidth * 1.021, true);
    }
}

Availability.machineChart = class machineChart {

    constructor(options) {
        this._id = UUID.v4();
        this.customColor = ['#367AF0', '#0ABD9E', '#F7B26B', '#EB5757', '#7CBAB4', '#92C7E2', '#75B5D6', '#B78C9B', '#F2CA84', '#A7CA74'];
        this.chartData = {};
    }

    convertChartsData(datas) {
        for (let i = 0; i < datas.length; i++) {
            const group = datas[i];
            this.chartData[group.id] = [];
            for (let j = 0; j < group.panelData.length; j++) {
                const panel = group.panelData[j]
                this.chartData[group.id].push({
                    id: panel.id,
                    oee: panel.oee,
                    downtime: panel.downtime
                })
            }
        }
    }

    getData(groupId, panelId, failCount) {
        if (!(groupId && panelId)) return;
        failCount = failCount || 0;
        if (failCount > 500) {
            Alert.show('danger', '與伺服器連線失敗！');
            return false;
        }

        if (this.chartData === {}) {
            failCount++;
            setTimeout(() => {
                this.getData(groupId, panelId, failCount);
            }, 10);
            return false;
        }

        const data = this.chartData[groupId];
        for (let i = 0; i < data.length; i++) {
            const panel = data[i];
            if (panelId === panel.id) {

                return {
                    oee: panel.oee,
                    downtime: panel.downtime,
                }
            }
        }
    }
    convertDecimalPoint(data) {
        for (let i = 0; i < data.length; i++) {
            data[i] = NumberRound(data[i], 2);
        }
        return data
    }

    draw(data) {
        this.drawOee(this.convertDecimalPoint(data.oee));
        this.drawDowntime(data.downtime)
    }

    drawDowntime(data) {
        $("#downtimeAnalysis").dxPieChart({
            type: 'doughnut',
            palette: this.customColor,
            dataSource: data,
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'left',
                itemTextPosition: 'right',
                font: {
                    color: 'whitesmoke',
                    size: 16,
                    family: '微軟正黑體',
                },
            },
            'export': {
                enabled: false
            },
            tooltip: {
                enabled: true,
                color: '#303030',
                cornerRadius: 15,
                font: {
                    size: 16,
                    family: '微軟正黑體',
                },
                customizeTooltip: function(arg) {
                    const color = arg.point._styles.normal.fill;
                    return {
                        borderColor: color,
                        text: `<span class="bg-grey" style="color: ${color}">${arg.argument}: ${arg.percentText}</span>`,
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

    drawOee(data) {
        $("#oeeAnalysis").dxBarGauge({
            palette: this.customColor,
            startValue: 0,
            endValue: 100,
            values: data,
            tooltip: {
                enabled: true,
                font: {
                    size: 16,
                    family: '微軟正黑體',
                },
                color: '#303030',
                cornerRadius: 15,
                customizeTooltip: function(arg) {
                    let type = _checkIndex(arg);
                    return {
                        borderColor: arg.color,
                        text: `<span style="color:${arg.color}">${type}: ${arg.valueText} %</span>`
                    };
                }
            },
            label: {
                format: {
                    type: 'fixedPoint',
                    precision: 0
                },
                customizeText: function(arg) {
                    return arg.valueText + ' %';
                }
            },
            legend: {
                visible: true,
                verticalAlignment: 'bottom',
                horizontalAlignment: 'left',
                customizeText: function(arg) {
                    return _legend(arg, ' %');
                },
                font: {
                    size: 16,
                    family: '微軟正黑體',
                }
            },
            'export': {
                enabled: false
            },
        });

        function _checkIndex(item) {
            const i = item.index;
            let type = '';
            if (i === 0) type = 'OEE';
            if (i === 1) type = '產能效率';
            if (i === 2) type = '稼動率';
            if (i === 3) type = '良率';
            return type
        }

        function _legend(data, suffix) {
            const type = _checkIndex(data.item);
            // color: ${data.item.color}
            return `<span style="color: whitesmoke">${type}: ${data.item.value}${suffix || ''}</span>`;
        }
    }

}
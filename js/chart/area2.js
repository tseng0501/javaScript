$(function() {
    var chart = $("#chart").dxChart({
        palette: "Harmony Light",
        dataSource: dataSource,
        commonSeriesSettings: {
            // type: types[0],
            argumentField: "day",
            stepline: {
                point: {
                    visible: false
                }
            }
        },
        valueAxis: {
            visualRange: {
                startValue: 10
            },
            label: {
                customizeHint: function() {
                    return this.valueText + "kwh99";

                },
                customizeText: function() {
                    return this.valueText + "kwh";
                }
            },
        },
        series: [{
                type: "stackedarea",
                valueField: "y65",
                name: "本地電源用電量"
            },
            {
                type: "stepline",
                valueField: "y1564",
                name: "最大契約容量",
                color: '#f04318',
                dashStyle: "dash"
            },
            {
                type: "stackedarea",
                valueField: "y014",
                name: "放電電源用電量"
            }
        ],
        argumentAxis: {
            aggregationInterval: 'hour'
        },
        "export": {
            enabled: true
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        }
    }).dxChart("instance");

    // document.getElementById("suggest").innerHTML = "&nbsp;&nbsp;<span>建議: </span>" + "&nbsp;<br />" +
    //     "&nbsp;&nbsp;<span>演化步數: </span>" + last_step_info_dict.step_int + "&nbsp;" + "&nbsp;<br />" +
    //     "<span>尖峰契約容量: </span>" + last_step_info_dict.peak + "&nbsp;" + "&nbsp;<br />" +
});

var dataSource = [{
    day: 1,
    y014: 58,
    y1564: 56,
    y65: 45
}, {
    day: 2,
    y014: 87,
    y1564: 50,
    y65: 45
}, {
    day: 3,
    y014: 32,
    y1564: 98,
    y65: 58
}, {
    day: 4,
    y014: 42,
    y1564: 78,
    y65: 32
}, {
    day: 5,
    y014: 50,
    y1564: 56,
    y65: 45
}, {
    day: 6,
    y014: 50,
    y1564: 78,
    y65: 10
}, {
    day: 7,
    // y014: 0,
    y1564: 78,
    // y65: 0
}, {
    day: 8,
    // y014: 0,
    y1564: 78,
    // y65: 0
}, {
    day: 9,
    // y014: 0,
    y1564: 78,
    // y65: 0
}, {
    day: 10,
    // y014: 56,
    y1564: 98,
    // y65: 51
}, {
    day: 11,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 12,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 13,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 14,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 15,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 16,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 17,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 18,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 19,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 20,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 21,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 22,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 23,
    // y014: 0,
    y1564: 98,
    // y65: 0
}, {
    day: 24,
    // y014: 0,
    y1564: 98,
    // y65: 0
}];
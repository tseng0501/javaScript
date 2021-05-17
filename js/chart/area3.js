var dataSource = [{
    day: 1610035200000,
    y014: 58,
    y1564: 56,
    y65: 45
}, {
    day: 1610036100000,
    y014: 87,
    y1564: 50,
    y65: 45
}, {
    day: 1610037000000,
    y014: 32,
    y1564: 98,
    y65: 58
}, {
    day: 1610037900000,
    y014: 42,
    y1564: 78,
    y65: 32
}, {
    day: 1610038800000,
    y014: 50,
    y1564: 56,
    y65: 45
}, {
    day: 1610039700000,
    y014: 50,
    y1564: 78,
    y65: 10
}, {
    day: 1610040600000,
    y014: 30,
    y1564: 78,
    y65: 60
}, {
    day: 1610041500000,
    y014: 40,
    y1564: 78,
    y65: 50
}, {
    day: 1610042400000,
    y014: 60,
    y1564: 78,
    y65: 50
}, {
    day: 1610043300000,
    y014: 56,
    y1564: 48,
    y65: 54
}, {
    day: 1610044200000,
    y014: 20,
    y1564: 68,
    y65: 54
}, {
    day: 1610045100000,
    y014: 10,
    y1564: 88,
    y65: 65
}, {
    day: 1610046000000,
    y014: 65,
    y1564: 48,
    y65: 53
}, {
    day: 1610046900000,
    y014: 54,
    y1564: 28,
    y65: 32
}, {
    day: 1610047800000,
    y014: 44,
    y1564: 68,
    y65: 51
}, {
    day: 1610048700000,
    y014: 32,
    y1564: 66,
    y65: 81
}, {
    day: 1610049600000,
    y014: 43,
    y1564: 68,
    y65: 21
}, {
    day: 1610050500000,
    y014: 31,
    y1564: 38,
    y65: 41
}, {
    day: 1610051400000,
    y014: 54,
    y1564: 98,
    y65: 61
}, {
    day: 1610052300000,
    y014: 60,
    y1564: 94,
    y65: 71
}, {
    day: 1610053200000,
    y014: 40,
    y1564: 98,
    y65: 23
}, {
    day: 1610054100000,
    y014: 70,
    y1564: 21,
    y65: 51
}, {
    day: 1610055000000,
    y014: 90,
    y1564: 98,
    y65: 58
}, {
    day: 1610055900000,
    y014: 10,
    y1564: 38,
    y65: 45
}];

$(function() {
    var highAverage = 77,
        lowAverage = 38;
    var chart = $("#chart").dxChart({
        palette: "Harmony Light",
        dataSource: dataSource,
        valueAxis: {
            visualRange: {
                startValue: 10
            },
            label: {
                customizeText: function() {
                    return this.valueText + "kw";
                }
            },
            constantLines: [{
                label: {
                    text: "Low Average"
                },
                // paddingLeftRight: 1200,
                width: 2,
                value: lowAverage,
                color: "#8c8cff",
                dashStyle: "dash"
            }, {
                label: {
                    text: "High Average"
                },
                width: 2,
                value: highAverage,
                color: "#ff7c7c",
                dashStyle: "dash"
            }]
        },
        argumentAxis: {
            label: {
                customizeText: function(e) {
                    var result = e.value;
                    var timer = moment(result).format('YYYY/MM/DD HH:mm:ss')
                    return timer;
                }
            }
        },
        series: [{
                // type: "spline",
                argumentField: "day",
                valueField: "y65",
                name: "本地電源用電量",

            },
            {
                // type: "spline",
                argumentField: "day",
                valueField: "y1564",
                name: "最大契約容量",
                color: '#f04318',

                // dashStyle: "dash"
            },
            {
                // type: "spline",
                argumentField: "day",
                valueField: "y014",
                name: "放電電源用電量",
            }
        ],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        tooltip: {
            enabled: true,
            shared: true,
            // contentTemplate: function(e) {
            //     console.log(e)

            // },
            customizeTooltip: function(arg) {
                let content = '';
                let time = moment(arg.argument).format('YYYY/MM/DD HH:mm:ss');
                content += "時間 : " + time + "<br>";

                for (let i = 0; i < arg.points.length; i++) {
                    const arg_name = arg.points[i].seriesName;
                    const arg_value = arg.points[i].value;


                    content += `<p>${arg_name} : ${arg_value}KWh<br></p>`;
                    // console.log(content)

                }

                return {
                    text: content
                };

            }
        }
    }).dxChart("instance");

    // document.getElementById("suggest").innerHTML = "&nbsp;&nbsp;<span>建議: </span>" + "&nbsp;<br />" +
    //     "&nbsp;&nbsp;<span>演化步數: </span>" + last_step_info_dict.step_int + "&nbsp;" + "&nbsp;<br />" +
    //     "<span>尖峰契約容量: </span>" + last_step_info_dict.peak + "&nbsp;" + "&nbsp;<br />" +
});
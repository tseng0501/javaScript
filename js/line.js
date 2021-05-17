$(function () {
    var highAverage = 77,
    lowAverage = 28;
    var chart = $("#chart").dxChart({
        palette: "Violet",
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "country",
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            discreteAxisDivisionMode: "crossLabels",
            label: {
                customizeText: function (e) {
                    return e.value + "99"
                }
            },
        },
        valueAxis: [{
            name: "frequency",
            position: "left",
            constantLines: [{
                label: {
                    text: "Low Average"
                },
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
            // tickInterval: 300
        }, {
            name: "percentage",
            position: "right",
            showZero: true,
            label: {
                customizeText: function (info) {
                    console.log(info)

                    return info.valueText + "%";
                }
            }
            // },
            // tickInterval: 20,
            // valueMarginsEnabled: false
        }],
        series: [
            { valueField: "hydro", name: "Hydro-electric",axis: "frequency",},
            { valueField: "oil", name: "Hydro-electric",color: "#6b71c3",axis: "percentage", },


        ],
        legend: {
            visible: false
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true
        },
        zoomAndPan: {
            argumentAxis: 'both'
        }
    }).dxChart("instance");

});

var dataSource = [{
    country: "USA",
    hydro: 59.8,
    oil: 37.6,
    gas: 582,
    coal: 564.3,
    nuclear: 187.9
}, {
    country: "China",
    hydro: 74.2,
    oil: 38.6,
    gas: 35.1,
    coal: 956.9,
    nuclear: 11.3
}, {
    country: "Russia",
    hydro: 40,
    oil: 28.5,
    gas: 361.8,
    coal: 105,
    nuclear: 32.4
}, {
    country: "Japan",
    hydro: 22.6,
    oil: 41.5,
    gas: 64.9,
    coal: 120.8,
    nuclear: 64.8
}, {
    country: "India",
    hydro: 19,
    oil: 19.3,
    gas: 28.9,
    coal: 204.8,
    nuclear: 3.8
}, {
    country: "Germany",
    hydro: 6.1,
    oil: 23.6,
    gas: 77.3,
    coal: 85.7,
    nuclear: 37.8
}];

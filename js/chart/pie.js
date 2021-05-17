$(function() {
    $("#pie").dxPieChart({
        palette: "bright",
        dataSource: dataSource,
        title: "Olympic Medals in 2008",
        legend: {
            orientation: "horizontal",
            itemTextPosition: "right",
            horizontalAlignment: "center",
            verticalAlignment: "bottom",
            columnCount: 4
        },
        "export": {
            enabled: true
        },
        series: [{
            argumentField: "country",
            valueField: "medals",
            label: {
                visible: true,
                font: {
                    size: 16
                },
                connector: {
                    visible: true,
                    width: 0.5
                },
                position: "columns",
                customizeText: function(arg) {
                    return arg.valueText + " (" + arg.percentText + ")";
                }
            }
        }]
    });
})

var dataSource = [{
        country: "本地電源用電量",
        medals: 110
    }, {
        country: "最大契約容量",
        medals: 100
    }, {
        country: "放電電源用電量",
        medals: 72
    }
    // , {
    //     country: "Britain",
    //     medals: 47
    // }, {
    //     country: "Australia",
    //     medals: 46
    // }, {
    //     country: "Germany",
    //     medals: 41
    // }, {
    //     country: "France",
    //     medals: 40
    // }, {
    //     country: "South Korea",
    //     medals: 31
    // }
];
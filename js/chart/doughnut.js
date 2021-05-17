$(function() {
    $("#pie").dxPieChart({
        type: "doughnut",
        palette: "Soft Pastel",
        dataSource: dataSource,
        tooltip: {
            enabled: true,
            format: "millions",
            customizeTooltip: function(arg) {
                console.log(arg)
                return {
                    text: arg.valueText + " - " + (arg.percent * 100).toFixed(2) + "%"
                };
            }
        },
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "left",
        },
        series: [{
            argumentField: "region",
            label: {
                visible: true,
                // format: "millions",
                connector: {
                    visible: true
                }
            }
        }]
    });
});

var dataSource = [{
    region: "Asia",
    val: 4119626293,
    time: 100
}, {
    region: "Africa",
    val: 1012956064,
    time: 100
}, {
    region: "Northern America",
    val: 344124520,
    time: 100
}, {
    region: "Latin America and the Caribbean",
    val: 590946440,
    time: 100
}, {
    region: "Europe",
    val: 727082222,
    time: 100
}, {
    region: "Oceania",
    val: 35104756,
    time: 100
}];
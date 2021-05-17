$(function() {
    var chartInstance = $("#chart").dxChart({
        rotated: true,
        title: "Olympic Gold Medals in 2008",
        dataSource: goldMedals,
        series: {
            color: "#f3c40b",
            argumentField: "country",
            valueField: "medals",
            type: "bar",
            label: {
                visible: true
            }
        },
        legend: {
            visible: false
        }
    }).dxChart("instance");

    var pieChartInstance = $("#pieChart").dxPieChart({
        palette: 'Harmony Light',
        dataSource: allMedals,
        title: "Total Olympic Medals\n in 2008",
        series: [{
            argumentField: "country",
            valueField: "medals",
            label: {
                visible: true,
                connector: {
                    visible: true
                }
            }
        }]
    }).dxPieChart("instance");

    $("#export").dxButton({
        icon: "export",
        text: "Export",
        type: "default",
        width: 145,
        onClick: function() {
            DevExpress.viz.exportWidgets([
                [chartInstance, pieChartInstance]
            ], {
                fileName: "chart",
                format: 'PNG'
            });
        }
    });
});
var allMedals = [{
    country: "USA",
    medals: 110
}, {
    country: "China",
    medals: 100
}, {
    country: "Russia",
    medals: 71
}, {
    country: "UK",
    medals: 47
}, {
    country: "Australia",
    medals: 46
}, {
    country: "Germany",
    medals: 41
}, {
    country: "France",
    medals: 41
}, {
    country: "South Korea",
    medals: 31
}];

var goldMedals = [{
    country: "China",
    medals: 51
}, {
    country: "USA",
    medals: 36
}, {
    country: "Russia",
    medals: 22
}, {
    country: "UK",
    medals: 19
}, {
    country: "Germany",
    medals: 16
}, {
    country: "Australia",
    medals: 14
}, {
    country: "South Korea",
    medals: 13
}, {
    country: "France",
    medals: 7
}];
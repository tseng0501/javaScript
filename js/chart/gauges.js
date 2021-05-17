$(function() {
    var productsToValues = function() {
        return $.map(products, function(item) {
            return item.count;
        });
    }
    var gauge = $("#gauge").dxBarGauge({
        startValue: 0,
        endValue: 200,
        values: productsToValues(),
        label: { visible: true },
        tooltip: {
            enabled: true,
            customizeTooltip: function(arg) {
                return {
                    text: getText(arg, arg.valueText)
                };
            }
        },
        title: {
            text: "Average Speed by Racer",
            font: {
                size: 28
            }
        },
        legend: {
            visible: true,
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            customizeText: function(arg) {
                return getText(arg.item, arg.text);
            }
        }
    });

    function getText(item, text) {
        if (item.index == 0) {
            return "Hummers: " + text + " km/h";
        } else if (item.index == 1) {
            return "Shovers: " + text + " km/h";

        } else if (item.index == 2) {
            return "Ladders: " + text + " km/h";

        } else if (item.index == 3) {
            return "Watering cans: " + text + " km/h";

        }

    }
});
$(function() {
    $("#chart").dxChart({
        rotated: true, //左向
        pointSelectionMode: "multiple",
        dataSource: products,
        commonSeriesSettings: {
            argumentField: "name",
            type: "stackedbar",
            selectionStyle: {
                hatching: {
                    direction: "left"
                }
            }
        },
        series: [
            { valueField: "area", name: "本地電源用電量", color: "#ffd700" },
            { valueField: "region", name: "最大契約容量", color: "#c0c0c0" },
            { valueField: "build", name: "放電電源用電量", color: "#cd7f32" },

        ],
        title: {
            text: "Olympic Medals in 2008"
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function(arg) {
                return {
                    text: arg.seriesName + ":" + arg.valueText + "kwh"
                }
            }
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
    });
});
var products = [{
    name: 'Hummers',
    count: 41,
    area: 62,
    region: 57,
    build: 42
}, {
    name: 'Shovers',
    count: 32,
    area: 67,
    region: 58,
    build: 42
}, {
    name: 'Ladders',
    count: 13,
    area: 63,
    region: 54,
    build: 22
}, {
    name: 'Watering cans',
    count: 48,
    area: 64,
    region: 60,
    build: 72
}];

$(function() {
    $("#normalChart").dxChart({
        dataSource: dataSource,
        "export": {
            enabled: true
        },
        valueAxis: {
            visualRange: {
                startValue: 40
            },
            maxValueMargin: 0.01,
        },

        series: [{
            argumentField: "day",
            valueField: "temperature",
            type: "bar",
            color: "#e7d19a"
        }],
        title: {
            text: "Daily Temperature in May"
        },
        legend: {
            visible: false
        }
    });
});

$(function() {
    $("#normal").dxChart({
        dataSource: products,
        commonSeriesSettings: {
            argumentField: "name",
            type: "bar",
        },

        series: [
            { valueField: "area", name: "本地電源用電量", color: "#ffd700" },
            { valueField: "region", name: "最大契約容量", color: "#c0c0c0" },
            { valueField: "build", name: "放電電源用電量", color: "#cd7f32" }
        ],
        title: {
            text: "Daily Temperature in May"
        },
        legend: {
            visible: false
        }
    });
});
var dataSource = [{
    day: '1',
    temperature: 57,
}, {
    day: '2',
    temperature: 58
}, {
    day: '3',
    temperature: 57
}, {
    day: '4',
    temperature: 59
}, {
    day: '5',
    temperature: 63
}, {
    day: '6',
    temperature: 63
}, {
    day: '7',
    temperature: 63
}, {
    day: '8',
    temperature: 64
}, {
    day: '9',
    temperature: 64
}, {
    day: '10',
    temperature: 64
}, {
    day: '11',
    temperature: 69
}, {
    day: '12',
    temperature: 72
}, {
    day: '13',
    temperature: 75
}, {
    day: '14',
    temperature: 78
}, {
    day: '15',
    temperature: 76
}, {
    day: '16',
    temperature: 70
}, {
    day: '17',
    temperature: 65
}, {
    day: '18',
    temperature: 65
}, {
    day: '19',
    temperature: 68
}, {
    day: '20',
    temperature: 70
}, {
    day: '21',
    temperature: 73
}, {
    day: '22',
    temperature: 73
}, {
    day: '23',
    temperature: 75
}, {
    day: '24',
    temperature: 78
}, {
    day: '25',
    temperature: 76
}, {
    day: '26',
    temperature: 76
}, {
    day: '27',
    temperature: 80
}, {
    day: '28',
    temperature: 76
}, {
    day: '29',
    temperature: 75
}, {
    day: '30',
    temperature: 75
}, {
    day: '31',
    temperature: 74
}];
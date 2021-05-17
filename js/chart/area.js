$(function() {
    var highAverage = 77;

    $("#chart").dxChart({
        dataSource: dataSource,
        customizePoint: function() {
            if (this.value > highAverage) {
                return { color: "#ff7c7c", hoverStyle: { color: "#ff7c7c" } };
            }
        },
        customizeLabel: function() {
            if (this.value > highAverage) {
                return {
                    visible: true,
                    backgroundColor: "#ff7c7c",
                    customizeText: function() {
                        return this.valueText + "kw";
                    }
                };
            }
        },
        "export": {
            enabled: true
        },
        valueAxis: {
            visualRange: {
                startValue: 40
            },
            maxValueMargin: 0.01,
            label: {
                customizeHint: function() {
                    return this.valueText + "kwh99";

                },
                customizeText: function() {
                    return this.valueText + "kwh";
                }
            },
            constantLines: [{
                label: {
                    text: "High Average"
                },
                width: 2,
                value: highAverage,
                color: "#ff7c7c",
                dashStyle: "dash"
            }]
        },
        series: [{
            argumentField: "day",
            valueField: "temperature",
            type: "area",
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


var dataSource = [{
    day: '1',
    temperature: 57
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
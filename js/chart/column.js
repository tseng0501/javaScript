window.onload = function() {
    var chart = new CanvasJS.Chart('chart', {
        // backgroundColor:"t"
        zoomEnabled: true,
        animationEnabled: true,
        rangeChanging: (e) => {
            this.tool(chart, true, false);
        },
        axisY: {
            minimum: 0,
            maximum: 1,
            tickLength: 0,
            lineThickness: 0,
            margin: -5,
            valueFormatString: ' '
        },
        axisX: {
            labelFontColoe: 'whitesmoke',
            labelFontSize: 16,
            labelFormatter: function(e) {
                return CanvasJS.formatDate(e.value, 'HH:mm');
            }
        },
        toolTip: {
            fontColor: 'whitesmoke',
            shared: true,
            content: this._toopTip,

        },
        data: [{
            type: 'column',
            // dataPoint: data.chart,
        }]
    });
    chart.render();
}
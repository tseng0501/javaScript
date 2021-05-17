// 'use strict';
// const Page = {};
// Page.chartbar = {};
// Page.chartbar.draw = function() {
//     console.log("99")
//         // Page.chartbar.path = '';
//     let rangeMode = 'chartbar';
//     Page.chartbar.drawTimeContent(rangeMode)
//         // Panel.regionBar.draw(rangeMode, $('#Toolbar'), 'RegionBar', true, '請選擇條件');
//     Page.chartbar.mainContent.tabDraw();
//     Page.chartbar.onChange();
//     Page.chartbar.searchOnClick();
//     // Page.chartbar.getPath();

//     Page.chartbar.setTimeContent();
// };
// Page.chartbar.drawTimeContent = function(rangeMode) {
//     $('.main-content-outside').addClass(rangeMode);
//     const html = `
//         <div class="start-time">
//             <div class="text">請選擇 開始時間</div>
//             <div class="dx-field-value">
//                 <div id="dateStart"></div>
//             </div>
//         </div>
//         <div class="end-time">
//             <div class="text">請選擇 結束時間</div>
//             <div class="dx-field-value">
//                 <div id="dateEnd"></div>
//             </div>
//             <div class="time-content containerbox"></div>
//         </div>`;

//     const mainHtml = `
//         <div class="hide-content open">
//             <div class="time-content">${html}</div>
//             <div class="search-button"><i class="fas fa-search"></i></div>
//             <div class="download"><i class="fas fa-download"></i></div>
//         </div>`;

//     this.$toolBar = $('.main-content-outside').find('#Toolbar');
//     this.$toolBar.html(mainHtml);
//     this.$toolBar.addClass("has");
//     this.$toolBar.addClass("timehas");

//     this.$hideContent = this.$toolBar.find('.hide-content');
//     this.$searchBtn = this.$toolBar.find('.search-button');
//     this.$cycleContent = $('.main-content').find('.cycleContent');
// }



window.onload = function() {
    var chart = new CanvasJS.Chart("chartContainer", {
        backgroundColor: 'transparent',
        zoomEnabled: true,
        animationEnabled: true,
        rangeChanging: (e) => {
            this.tool(chart, true, false);
        },
        axisX: {
            intervalType: "hours",
            labelFontColor: 'whitesmoke',
            labelFontSize: 16,
            labelFormatter: function(e) {
                return CanvasJS.formatDate(e.value, 'HH:mm');
            },
        },
        // dataPointWidth: 90,
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
            type: "column",
            dataPoints: data,
        }]

    });
    chart.render();
}